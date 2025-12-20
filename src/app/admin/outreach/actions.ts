"use server";

import { revalidatePath } from "next/cache";
import { convertLeadToCustomer, updateCustomer } from "@/db/queries/customers";
import { updateLead } from "@/db/queries/leads";
import { createActivity } from "@/db/queries/activities";
import { db } from "@/db";
import { activitiesTable } from "@/db/schema";
import { replaceTemplateVariables } from "@/lib/template-utils";
import type { Customer, Lead } from "@/db/schema";

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
  recipient: Customer | Lead,
  messageText: string,
  templateUsed?: string,
  adminId?: string
) {
  try {
    // Normalize phone number (remove any non-numeric characters except +)
    const normalizedPhone = recipient.phone.replace(/[^\d+]/g, "");

    let customerId: number;
    let leadId: number | null = null;

    if ("leadId" in recipient) {
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
    const processedMessage = replaceTemplateVariables(messageText, recipient);

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
  recipient: Customer | Lead,
  messageText: string,
  channel: string = "whatsapp",
  templateUsed?: string,
  adminId?: string
) {
  try {
    let customerId: number;
    let leadId: number | null = null;

    if ("leadId" in recipient) {
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
      channel: channel as any,
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
  recipient: Customer | Lead
) {
  try {
    const processedMessage = replaceTemplateVariables(templateText, recipient);
    return { success: true, message: processedMessage };
  } catch (error) {
    console.error("Error generating message preview:", error);
    return { success: false, error: "Failed to generate preview" };
  }
}
