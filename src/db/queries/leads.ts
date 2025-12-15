import { db } from "@/db";
import { leadsTable, productsTable } from "@/db/schema";
import { eq, like, or, desc, asc, sql } from "drizzle-orm";
import type { Lead, NewLead } from "@/db/schema";

// Get all leads with optional pagination and search
export async function getLeads({
  page = 1,
  limit = 10,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) {
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  if (search) {
    whereClause = or(
      like(leadsTable.firstName, `%${search}%`),
      like(leadsTable.lastName, `%${search}%`),
      like(leadsTable.phone, `%${search}%`)
    );
  }

  const orderBy = sortOrder === "desc" ? desc : asc;
  let orderColumn;
  switch (sortBy) {
    case "firstName":
      orderColumn = orderBy(leadsTable.firstName);
      break;
    case "lastName":
      orderColumn = orderBy(leadsTable.lastName);
      break;
    case "phone":
      orderColumn = orderBy(leadsTable.phone);
      break;
    case "createdAt":
    default:
      orderColumn = orderBy(leadsTable.createdAt);
      break;
  }

  const leads = await db
    .select({
      id: leadsTable.id,
      firstName: leadsTable.firstName,
      lastName: leadsTable.lastName,
      phone: leadsTable.phone,
      productId: leadsTable.productId,
      source: leadsTable.source,
      importedBy: leadsTable.importedBy,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
      },
    })
    .from(leadsTable)
    .leftJoin(productsTable, eq(leadsTable.productId, productsTable.id))
    .where(whereClause)
    .orderBy(orderColumn)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leadsTable)
    .where(whereClause);

  return {
    leads,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

// Get lead by ID
export async function getLeadById(id: number) {
  const [lead] = await db
    .select({
      id: leadsTable.id,
      firstName: leadsTable.firstName,
      lastName: leadsTable.lastName,
      phone: leadsTable.phone,
      productId: leadsTable.productId,
      source: leadsTable.source,
      importedBy: leadsTable.importedBy,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
      },
    })
    .from(leadsTable)
    .leftJoin(productsTable, eq(leadsTable.productId, productsTable.id))
    .where(eq(leadsTable.id, id))
    .limit(1);

  return lead || null;
}

// Create new lead
export async function createLead(data: NewLead) {
  const [lead] = await db.insert(leadsTable).values(data).returning();
  return lead;
}

// Update lead
export async function updateLead(id: number, data: Partial<NewLead>) {
  const [lead] = await db
    .update(leadsTable)
    .set(data)
    .where(eq(leadsTable.id, id))
    .returning();
  return lead;
}

// Delete lead
export async function deleteLead(id: number) {
  const [lead] = await db
    .delete(leadsTable)
    .where(eq(leadsTable.id, id))
    .returning();
  return lead;
}

// Bulk delete leads
export async function deleteLeads(ids: number[]) {
  await db.delete(leadsTable).where(sql`${leadsTable.id} IN ${ids}`);
}
