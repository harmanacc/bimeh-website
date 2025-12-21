"use server";

import { revalidatePath } from "next/cache";
import { convertLeadToCustomer, updateCustomer } from "@/db/queries/customers";
import { updateLead } from "@/db/queries/leads";
import { createActivity } from "@/db/queries/activities";
import { db } from "@/db";
import { activitiesTable } from "@/db/schema";
import { replaceTemplateVariables } from "@/lib/template-utils";
import { toWhatsAppFormat } from "@/lib/phone-utils";
import type {
  Customer,
  Lead,
  CustomerStatus,
  LeadStatus,
  MessageChannel,
} from "@/db/schema";

export type CustomerRecipient = {
  id: number;
  leadId: number | null;
  firstName: string;
  lastName: string;
  phone: string;
  insuranceType: string | null;
  preferredChannel: MessageChannel | null;
  status: CustomerStatus | null;
  createdAt: Date;
  updatedAt: Date;
  lead: {
    id: number;
    productId: number | null;
    source: string | null;
  } | null;
  type: "customer";
};

export type LeadRecipient = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  productId: number | null;
  source: string | null;
  importedBy: string | null;
  status: LeadStatus | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: number;
    name: string;
  } | null;
  type: "lead";
};

type Recipient = CustomerRecipient | LeadRecipient;

export async function convertLeadToCustomerAction(leadId: number) {
  try {
    const customer = await convertLeadToCustomer(leadId, {
      status: "new",
    });
    revalidatePath("/admin/outreach/leads");
    revalidatePath("/admin/outreach/customers");
    return { success: true, customer };
  } catch (error) {
    console.error("Error converting lead to customer:", error);
    return { success: false, error: "Failed to convert lead" };
  }
}

export async function markLeadAsContacted(leadId: number, adminId?: string) {
  try {
    // Update lead status
    await updateLead(leadId, { status: "contacted" as const });

    // TODO: Log activity after customer creation

    revalidatePath("/admin/outreach/leads");
    return { success: true };
  } catch (error) {
    console.error("Error marking lead as contacted:", error);
    return { success: false, error: "Failed to mark as contacted" };
  }
}

export async function updateLeadStatus(leadId: number, status: string) {
  try {
    await updateLead(leadId, {
      status: status as "lead" | "contacted" | "deactivated",
    });
    revalidatePath("/admin/outreach/leads");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateCustomerStatus(customerId: number, status: string) {
  try {
    await updateCustomer(customerId, {
      status: status as
        | "new"
        | "contacted"
        | "target"
        | "active"
        | "deactivated",
    });
    revalidatePath("/admin/outreach/customers");
    return { success: true };
  } catch (error) {
    console.error("Error updating customer status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function sendWhatsAppMessage(
  recipient: Recipient,
  messageText: string,
  templateUsed?: string,
  adminId?: string
) {
  try {
    // Convert phone number to WhatsApp format (+989xxxxxxxxx)
    const normalizedPhone = toWhatsAppFormat(recipient.phone);

    let customerId: number;
    let leadId: number | null = null;

    if (recipient.type === "lead") {
      // It's a lead - convert to customer first
      const customer = await convertLeadToCustomer(recipient.id, {
        status: "contacted",
      });
      customerId = customer.id;
      leadId = recipient.id;
      revalidatePath("/admin/outreach/leads");
    } else {
      // It's already a customer
      customerId = recipient.id;
      await updateCustomer(recipient.id, { status: "contacted" });
      revalidatePath("/admin/outreach/customers");
    }

    // Process template variables in message
    const processedMessage = replaceTemplateVariables(
      messageText,
      recipient as Partial<Customer | Lead>
    );

    // Generate WhatsApp link
    const whatsappUrl = `https://web.whatsapp.com/send/?phone=${normalizedPhone}&text=${encodeURIComponent(
      processedMessage
    )}`;

    return {
      success: true,
      whatsappUrl,
      normalizedPhone,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function logActivity(
  recipient: Recipient,
  messageText: string,
  channel: string = "whatsapp",
  templateUsed?: string,
  adminId?: string
) {
  try {
    let customerId: number;
    let leadId: number | null = null;

    if (recipient.type === "lead") {
      // It's a lead - convert to customer first
      const customer = await convertLeadToCustomer(recipient.id, {
        status: "contacted",
      });
      customerId = customer.id;
      leadId = recipient.id;
      revalidatePath("/admin/outreach/leads");
    } else {
      // It's already a customer
      customerId = recipient.id;
      await updateCustomer(recipient.id, { status: "contacted" });
      revalidatePath("/admin/outreach/customers");
    }

    // Create activity record
    const activity = await createActivity({
      customerId,
      leadId,
      messageText,
      channel: channel as MessageChannel,
      outreachType: "initial-contact",
      templateUsed,
      sentAt: new Date(),
      sentBy: adminId,
      status: "sent",
    });

    return { success: true, activity };
  } catch (error) {
    console.error("Error logging activity:", error);
    return { success: false, error: "Failed to log activity" };
  }
}

export async function getMessagePreview(
  templateText: string,
  recipient: Recipient
) {
  try {
    const processedMessage = replaceTemplateVariables(
      templateText,
      recipient as Partial<Customer | Lead>
    );
    return { success: true, message: processedMessage };
  } catch (error) {
    console.error("Error generating message preview:", error);
    return { success: false, error: "Failed to generate preview" };
  }
}

// Group management actions
export async function createGroupAction(
  name: string,
  description?: string,
  adminId?: string
) {
  try {
    const { createGroup } = await import("@/db/queries/groups");
    const group = await createGroup({
      name,
      description,
      createdBy: adminId,
    });
    revalidatePath("/admin/outreach/groups");
    return { success: true, group };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function updateGroupAction(
  id: number,
  name: string,
  description?: string
) {
  try {
    const { updateGroup } = await import("@/db/queries/groups");
    const group = await updateGroup(id, { name, description });
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    revalidatePath("/admin/outreach/groups");
    return { success: true, group };
  } catch (error) {
    console.error("Error updating group:", error);
    return { success: false, error: "Failed to update group" };
  }
}

export async function deleteGroupAction(id: number) {
  try {
    const { deleteGroup } = await import("@/db/queries/groups");
    const success = await deleteGroup(id);
    if (!success) {
      return { success: false, error: "Group not found" };
    }
    revalidatePath("/admin/outreach/groups");
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { success: false, error: "Failed to delete group" };
  }
}

export async function addUsersToGroupAction(
  groupId: number,
  userIds: number[],
  userType: "lead" | "customer",
  adminId?: string
) {
  try {
    const { addUsersToGroup } = await import("@/db/queries/groups");
    const members = await addUsersToGroup(groupId, userIds, userType, adminId);
    revalidatePath("/admin/outreach/groups");
    return { success: true, members };
  } catch (error) {
    console.error("Error adding users to group:", error);
    return { success: false, error: "Failed to add users to group" };
  }
}

export async function removeUserFromGroupAction(
  groupId: number,
  userId: number,
  userType: "lead" | "customer"
) {
  try {
    const { removeUserFromGroup } = await import("@/db/queries/groups");
    const success = await removeUserFromGroup(groupId, userId, userType);
    if (!success) {
      return { success: false, error: "User not found in group" };
    }
    revalidatePath("/admin/outreach/groups");
    return { success: true };
  } catch (error) {
    console.error("Error removing user from group:", error);
    return { success: false, error: "Failed to remove user from group" };
  }
}

export async function changeUserGroupAction(
  currentGroupId: number,
  newGroupId: number,
  userId: number,
  userType: "lead" | "customer",
  adminId?: string
) {
  try {
    // First remove from current group
    const { removeUserFromGroup, addUsersToGroup } = await import(
      "@/db/queries/groups"
    );
    const removeSuccess = await removeUserFromGroup(
      currentGroupId,
      userId,
      userType
    );
    if (!removeSuccess) {
      return { success: false, error: "User not found in current group" };
    }

    // Then add to new group
    const addResult = await addUsersToGroup(
      newGroupId,
      [userId],
      userType,
      adminId
    );
    if (!addResult) {
      return { success: false, error: "Failed to add user to new group" };
    }

    revalidatePath("/admin/outreach/groups");
    return { success: true };
  } catch (error) {
    console.error("Error changing user group:", error);
    return { success: false, error: "Failed to change user group" };
  }
}
