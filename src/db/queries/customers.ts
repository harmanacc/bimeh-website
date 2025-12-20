import { db } from "@/db";
import { customersTable, leadsTable, productsTable } from "@/db/schema";
import { eq, like, or, desc, asc, sql, inArray } from "drizzle-orm";
import type { Customer, NewCustomer } from "@/db/schema";

// Get all customers with optional pagination and search
export async function getCustomers({
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
      like(customersTable.firstName, `%${search}%`),
      like(customersTable.lastName, `%${search}%`),
      like(customersTable.phone, `%${search}%`)
    );
  }

  const orderBy = sortOrder === "desc" ? desc : asc;
  let orderColumn;
  switch (sortBy) {
    case "firstName":
      orderColumn = orderBy(customersTable.firstName);
      break;
    case "lastName":
      orderColumn = orderBy(customersTable.lastName);
      break;
    case "phone":
      orderColumn = orderBy(customersTable.phone);
      break;
    case "insuranceType":
      orderColumn = orderBy(customersTable.insuranceType);
      break;
    case "createdAt":
    default:
      orderColumn = orderBy(customersTable.createdAt);
      break;
  }

  const customers = await db
    .select({
      id: customersTable.id,
      leadId: customersTable.leadId,
      firstName: customersTable.firstName,
      lastName: customersTable.lastName,
      phone: customersTable.phone,
      insuranceType: customersTable.insuranceType,
      preferredChannel: customersTable.preferredChannel,
      status: customersTable.status,
      createdAt: customersTable.createdAt,
      updatedAt: customersTable.updatedAt,
      lead: {
        id: leadsTable.id,
        productId: leadsTable.productId,
        source: leadsTable.source,
      },
    })
    .from(customersTable)
    .leftJoin(leadsTable, eq(customersTable.leadId, leadsTable.id))
    .where(whereClause)
    .orderBy(orderColumn)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customersTable)
    .where(whereClause);

  return {
    customers,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

// Get customer by ID
export async function getCustomerById(id: number) {
  const [customer] = await db
    .select({
      id: customersTable.id,
      leadId: customersTable.leadId,
      firstName: customersTable.firstName,
      lastName: customersTable.lastName,
      phone: customersTable.phone,
      insuranceType: customersTable.insuranceType,
      preferredChannel: customersTable.preferredChannel,
      status: customersTable.status,
      createdAt: customersTable.createdAt,
      updatedAt: customersTable.updatedAt,
      lead: {
        id: leadsTable.id,
        productId: leadsTable.productId,
        source: leadsTable.source,
      },
    })
    .from(customersTable)
    .leftJoin(leadsTable, eq(customersTable.leadId, leadsTable.id))
    .where(eq(customersTable.id, id))
    .limit(1);

  return customer || null;
}

// Create new customer
export async function createCustomer(data: NewCustomer) {
  const [customer] = await db.insert(customersTable).values(data).returning();
  return customer;
}

// Update customer
export async function updateCustomer(id: number, data: Partial<NewCustomer>) {
  const [customer] = await db
    .update(customersTable)
    .set(data)
    .where(eq(customersTable.id, id))
    .returning();
  return customer;
}

// Delete customer
export async function deleteCustomer(id: number) {
  const [customer] = await db
    .delete(customersTable)
    .where(eq(customersTable.id, id))
    .returning();
  return customer;
}

// Bulk delete customers
export async function deleteCustomers(ids: number[]) {
  await db.delete(customersTable).where(sql`${customersTable.id} IN ${ids}`);
}

// Convert lead to customer
export async function convertLeadToCustomer(
  leadId: number,
  additionalData: Partial<NewCustomer> = {}
) {
  const lead = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.id, leadId))
    .limit(1);

  if (!lead.length) {
    throw new Error("Lead not found");
  }

  const customerData: NewCustomer = {
    leadId,
    firstName: lead[0].firstName,
    lastName: lead[0].lastName,
    phone: lead[0].phone,
    insuranceType: additionalData.insuranceType,
    preferredChannel: additionalData.preferredChannel || "whatsapp",
    status: additionalData.status || "new",
  };

  return await createCustomer(customerData);
}

// Get customers by IDs
export async function getCustomersByIds(ids: number[]) {
  if (ids.length === 0) return [];

  return await db
    .select({
      id: customersTable.id,
      leadId: customersTable.leadId,
      firstName: customersTable.firstName,
      lastName: customersTable.lastName,
      phone: customersTable.phone,
      insuranceType: customersTable.insuranceType,
      preferredChannel: customersTable.preferredChannel,
      status: customersTable.status,
      createdAt: customersTable.createdAt,
      updatedAt: customersTable.updatedAt,
      lead: {
        id: leadsTable.id,
        productId: leadsTable.productId,
        source: leadsTable.source,
      },
    })
    .from(customersTable)
    .leftJoin(leadsTable, eq(customersTable.leadId, leadsTable.id))
    .where(inArray(customersTable.id, ids));
}
