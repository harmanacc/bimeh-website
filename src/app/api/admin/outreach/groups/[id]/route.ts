import { NextRequest, NextResponse } from "next/server";
import {
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupMembers,
} from "@/db/queries/groups";
import { getLeadsByIds } from "@/db/queries/leads";
import { getCustomersByIds } from "@/db/queries/customers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const group = await getGroupById(id);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const members = await getGroupMembers(id);

    // Get user details for each member
    const leadIds = members
      .filter((m) => m.userType === "lead")
      .map((m) => m.userId);
    const customerIds = members
      .filter((m) => m.userType === "customer")
      .map((m) => m.userId);

    const [leads, customers] = await Promise.all([
      leadIds.length > 0 ? getLeadsByIds(leadIds) : Promise.resolve([]),
      customerIds.length > 0
        ? getCustomersByIds(customerIds)
        : Promise.resolve([]),
    ]);

    // Combine members with user details
    const membersWithDetails = members.map((member) => {
      const userDetails =
        member.userType === "lead"
          ? leads.find((l) => l.id === member.userId)
          : customers.find((c) => c.id === member.userId);

      return {
        ...member,
        user: userDetails,
      };
    });

    return NextResponse.json({
      group,
      members: membersWithDetails,
      _count: {
        members: members.length,
      },
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const group = await updateGroup(id, {
      name: name.trim(),
      description: description?.trim(),
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const success = await deleteGroup(id);
    if (!success) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
