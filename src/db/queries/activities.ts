import { db } from "@/db";
import { activitiesTable, customersTable, leadsTable } from "@/db/schema";
import { eq, like, or, desc, asc, sql, gte, lte, and } from "drizzle-orm";
import type { Activity, NewActivity } from "@/db/schema";

// Get all activities with optional filters and pagination
export async function getActivities({
  page = 1,
  limit = 10,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  customerId,
  leadId,
  channel,
  status,
  dateFrom,
  dateTo,
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  customerId?: number;
  leadId?: number;
  channel?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
} = {}) {
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(customersTable.firstName, `%${search}%`),
        like(customersTable.lastName, `%${search}%`),
        like(customersTable.phone, `%${search}%`),
        like(leadsTable.firstName, `%${search}%`),
        like(leadsTable.lastName, `%${search}%`),
        like(leadsTable.phone, `%${search}%`)
      )
    );
  }

  if (customerId) {
    conditions.push(eq(activitiesTable.customerId, customerId));
  }

  if (leadId) {
    conditions.push(eq(activitiesTable.leadId, leadId));
  }

  if (channel) {
    conditions.push(eq(activitiesTable.channel, channel as any));
  }

  if (status) {
    conditions.push(eq(activitiesTable.status, status as any));
  }

  if (dateFrom) {
    conditions.push(gte(activitiesTable.createdAt, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(activitiesTable.createdAt, dateTo));
  }

  if (conditions.length > 0) {
    whereClause = and(...conditions);
  }

  const orderBy = sortOrder === "desc" ? desc : asc;
  let orderColumn;
  switch (sortBy) {
    case "sentAt":
      orderColumn = orderBy(activitiesTable.sentAt);
      break;
    case "createdAt":
    default:
      orderColumn = orderBy(activitiesTable.createdAt);
      break;
  }

  const activities = await db
    .select({
      id: activitiesTable.id,
      customerId: activitiesTable.customerId,
      leadId: activitiesTable.leadId,
      messageText: activitiesTable.messageText,
      isAiGenerated: activitiesTable.isAiGenerated,
      channel: activitiesTable.channel,
      outreachType: activitiesTable.outreachType,
      templateUsed: activitiesTable.templateUsed,
      sentAt: activitiesTable.sentAt,
      sentBy: activitiesTable.sentBy,
      status: activitiesTable.status,
      failureReason: activitiesTable.failureReason,
      notes: activitiesTable.notes,
      createdAt: activitiesTable.createdAt,
      updatedAt: activitiesTable.updatedAt,
      customer: {
        id: customersTable.id,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        phone: customersTable.phone,
      },
      lead: {
        id: leadsTable.id,
        firstName: leadsTable.firstName,
        lastName: leadsTable.lastName,
        phone: leadsTable.phone,
      },
    })
    .from(activitiesTable)
    .leftJoin(customersTable, eq(activitiesTable.customerId, customersTable.id))
    .leftJoin(leadsTable, eq(activitiesTable.leadId, leadsTable.id))
    .where(whereClause)
    .orderBy(orderColumn)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(activitiesTable)
    .leftJoin(customersTable, eq(activitiesTable.customerId, customersTable.id))
    .leftJoin(leadsTable, eq(activitiesTable.leadId, leadsTable.id))
    .where(whereClause);

  return {
    activities,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

// Get activities for a specific customer
export async function getActivitiesForCustomer(customerId: number) {
  return await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.customerId, customerId))
    .orderBy(desc(activitiesTable.createdAt));
}

// Get activities for a specific lead
export async function getActivitiesForLead(leadId: number) {
  return await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.leadId, leadId))
    .orderBy(desc(activitiesTable.createdAt));
}

// Get activity by ID
export async function getActivityById(id: number) {
  const [activity] = await db
    .select({
      id: activitiesTable.id,
      customerId: activitiesTable.customerId,
      leadId: activitiesTable.leadId,
      messageText: activitiesTable.messageText,
      isAiGenerated: activitiesTable.isAiGenerated,
      channel: activitiesTable.channel,
      outreachType: activitiesTable.outreachType,
      templateUsed: activitiesTable.templateUsed,
      sentAt: activitiesTable.sentAt,
      sentBy: activitiesTable.sentBy,
      status: activitiesTable.status,
      failureReason: activitiesTable.failureReason,
      notes: activitiesTable.notes,
      createdAt: activitiesTable.createdAt,
      updatedAt: activitiesTable.updatedAt,
      customer: {
        id: customersTable.id,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        phone: customersTable.phone,
      },
      lead: {
        id: leadsTable.id,
        firstName: leadsTable.firstName,
        lastName: leadsTable.lastName,
        phone: leadsTable.phone,
      },
    })
    .from(activitiesTable)
    .leftJoin(customersTable, eq(activitiesTable.customerId, customersTable.id))
    .leftJoin(leadsTable, eq(activitiesTable.leadId, leadsTable.id))
    .where(eq(activitiesTable.id, id))
    .limit(1);

  return activity || null;
}

// Create new activity
export async function createActivity(data: NewActivity) {
  const [activity] = await db.insert(activitiesTable).values(data).returning();
  return activity;
}

// Update activity
export async function updateActivity(id: number, data: Partial<NewActivity>) {
  const [activity] = await db
    .update(activitiesTable)
    .set(data)
    .where(eq(activitiesTable.id, id))
    .returning();
  return activity;
}

// Delete activity
export async function deleteActivity(id: number) {
  const [activity] = await db
    .delete(activitiesTable)
    .where(eq(activitiesTable.id, id))
    .returning();
  return activity;
}
