import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerNotes,
  createCustomerNote,
  updateCustomerNote,
  deleteCustomerNote,
} from "@/db/queries/customer-notes";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      "GET /api/admin/outreach/customers/[id]/notes - params:",
      resolvedParams
    );
    const session = await auth();
    if (!session) {
      console.log("Unauthorized access to notes");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = parseInt(resolvedParams.id);
    if (isNaN(customerId)) {
      console.log("Invalid customer ID:", resolvedParams.id);
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    console.log("Fetching notes for customerId:", customerId);
    const notes = await getCustomerNotes(customerId);
    console.log("Fetched notes:", notes);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching customer notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = parseInt(resolvedParams.id);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { note } = body;

    if (!note || typeof note !== "string") {
      return NextResponse.json(
        { error: "Note is required and must be a string" },
        { status: 400 }
      );
    }

    const newNote = await createCustomerNote({
      customerId,
      note,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating customer note:", error);
    return NextResponse.json(
      { error: "Failed to create customer note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = parseInt(resolvedParams.id);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { noteId, note } = body;

    if (!noteId || isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    if (!note || typeof note !== "string") {
      return NextResponse.json(
        { error: "Note is required and must be a string" },
        { status: 400 }
      );
    }

    const updatedNote = await updateCustomerNote(noteId, { note });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating customer note:", error);
    return NextResponse.json(
      { error: "Failed to update customer note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = parseInt(resolvedParams.id);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const noteId = parseInt(url.searchParams.get("noteId") || "");

    if (!noteId || isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const deletedNote = await deleteCustomerNote(noteId);

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer note:", error);
    return NextResponse.json(
      { error: "Failed to delete customer note" },
      { status: 500 }
    );
  }
}
