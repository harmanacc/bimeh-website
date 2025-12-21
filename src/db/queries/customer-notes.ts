import { db } from "@/db";
import { customerNotesTable, customersTable } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import type { CustomerNote, NewCustomerNote } from "@/db/schema";

// Get all notes for a specific customer, sorted by latest first
export async function getCustomerNotes(customerId: number) {
  return await db
    .select({
      id: customerNotesTable.id,
      customerId: customerNotesTable.customerId,
      note: customerNotesTable.note,
      createdAt: customerNotesTable.createdAt,
      updatedAt: customerNotesTable.updatedAt,
    })
    .from(customerNotesTable)
    .where(eq(customerNotesTable.customerId, customerId))
    .orderBy(desc(customerNotesTable.createdAt));
}

// Get customer note by ID
export async function getCustomerNoteById(id: number) {
  const [note] = await db
    .select({
      id: customerNotesTable.id,
      customerId: customerNotesTable.customerId,
      note: customerNotesTable.note,
      createdAt: customerNotesTable.createdAt,
      updatedAt: customerNotesTable.updatedAt,
      customer: {
        id: customersTable.id,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
      },
    })
    .from(customerNotesTable)
    .leftJoin(
      customersTable,
      eq(customerNotesTable.customerId, customersTable.id)
    )
    .where(eq(customerNotesTable.id, id))
    .limit(1);

  return note || null;
}

// Create new customer note
export async function createCustomerNote(data: NewCustomerNote) {
  const [note] = await db.insert(customerNotesTable).values(data).returning();
  return note;
}

// Update customer note
export async function updateCustomerNote(
  id: number,
  data: Partial<NewCustomerNote>
) {
  const [note] = await db
    .update(customerNotesTable)
    .set(data)
    .where(eq(customerNotesTable.id, id))
    .returning();
  return note;
}

// Delete customer note
export async function deleteCustomerNote(id: number) {
  const [note] = await db
    .delete(customerNotesTable)
    .where(eq(customerNotesTable.id, id))
    .returning();
  return note;
}
