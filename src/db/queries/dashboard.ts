import { db } from "@/db";
import {
  customersTable,
  leadsTable,
  activitiesTable,
  productsTable,
  groupsTable,
  messageTemplatesTable,
} from "@/db/schema";
import { eq, desc, sql, gte, lte, and } from "drizzle-orm";

// Dashboard metrics interface
export interface DashboardMetrics {
  totalCustomers: number;
  totalLeads: number;
  totalMessagesSent: number;
  messagesSentToday: number;
  newCustomersToday: number;
  newLeadsToday: number;
  activeCustomers: number;
  totalProducts: number;
  totalGroups: number;
  totalMessageTemplates: number;
  latestCustomer: {
    id: number;
    firstName: string;
    lastName: string;
    createdAt: Date;
  } | null;
  lastActivity: {
    id: number;
    sentAt: Date | null;
    channel: string;
    customer: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  } | null;
}

// Get comprehensive dashboard metrics
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Get today's date in UTC
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // Run all queries in parallel for better performance
  const [
    totalCustomersResult,
    totalLeadsResult,
    totalMessagesSentResult,
    messagesSentTodayResult,
    newCustomersTodayResult,
    newLeadsTodayResult,
    activeCustomersResult,
    totalProductsResult,
    totalGroupsResult,
    totalMessageTemplatesResult,
    latestCustomerResult,
    lastActivityResult,
  ] = await Promise.all([
    // Total customers
    db.select({ count: sql<number>`count(*)` }).from(customersTable),

    // Total leads
    db.select({ count: sql<number>`count(*)` }).from(leadsTable),

    // Total messages sent
    db
      .select({ count: sql<number>`count(*)` })
      .from(activitiesTable)
      .where(eq(activitiesTable.status, "sent")),

    // Messages sent today
    db
      .select({ count: sql<number>`count(*)` })
      .from(activitiesTable)
      .where(
        and(
          gte(activitiesTable.sentAt, today),
          sql`${activitiesTable.sentAt} < ${tomorrow.toISOString()}`,
          eq(activitiesTable.status, "sent")
        )
      ),

    // New customers today
    db
      .select({ count: sql<number>`count(*)` })
      .from(customersTable)
      .where(
        and(
          gte(customersTable.createdAt, today),
          sql`${customersTable.createdAt} < ${tomorrow.toISOString()}`
        )
      ),

    // New leads today
    db
      .select({ count: sql<number>`count(*)` })
      .from(leadsTable)
      .where(
        and(
          gte(leadsTable.createdAt, today),
          sql`${leadsTable.createdAt} < ${tomorrow.toISOString()}`
        )
      ),

    // Active customers (status = 'active')
    db
      .select({ count: sql<number>`count(*)` })
      .from(customersTable)
      .where(eq(customersTable.status, "active")),

    // Total products
    db.select({ count: sql<number>`count(*)` }).from(productsTable),

    // Total groups
    db.select({ count: sql<number>`count(*)` }).from(groupsTable),

    // Total message templates
    db.select({ count: sql<number>`count(*)` }).from(messageTemplatesTable),

    // Latest customer
    db
      .select({
        id: customersTable.id,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
        createdAt: customersTable.createdAt,
      })
      .from(customersTable)
      .orderBy(desc(customersTable.createdAt))
      .limit(1),

    // Last activity
    db
      .select({
        id: activitiesTable.id,
        sentAt: activitiesTable.sentAt,
        channel: activitiesTable.channel,
        customer: {
          firstName: customersTable.firstName,
          lastName: customersTable.lastName,
        },
      })
      .from(activitiesTable)
      .leftJoin(
        customersTable,
        eq(activitiesTable.customerId, customersTable.id)
      )
      .where(sql`${activitiesTable.sentAt} IS NOT NULL`)
      .orderBy(desc(activitiesTable.sentAt))
      .limit(1),
  ]);

  return {
    totalCustomers: totalCustomersResult[0].count,
    totalLeads: totalLeadsResult[0].count,
    totalMessagesSent: totalMessagesSentResult[0].count,
    messagesSentToday: messagesSentTodayResult[0].count,
    newCustomersToday: newCustomersTodayResult[0].count,
    newLeadsToday: newLeadsTodayResult[0].count,
    activeCustomers: activeCustomersResult[0].count,
    totalProducts: totalProductsResult[0].count,
    totalGroups: totalGroupsResult[0].count,
    totalMessageTemplates: totalMessageTemplatesResult[0].count,
    latestCustomer: latestCustomerResult[0] || null,
    lastActivity: lastActivityResult[0] || null,
  };
}

// Get customer status distribution
export async function getCustomerStatusDistribution() {
  const result = await db
    .select({
      status: customersTable.status,
      count: sql<number>`count(*)`,
    })
    .from(customersTable)
    .groupBy(customersTable.status);

  return result;
}

// Get message channel distribution
export async function getMessageChannelDistribution() {
  const result = await db
    .select({
      channel: activitiesTable.channel,
      count: sql<number>`count(*)`,
    })
    .from(activitiesTable)
    .where(eq(activitiesTable.status, "sent"))
    .groupBy(activitiesTable.channel);

  return result;
}

// Get recent activities (last 10)
export async function getRecentActivities(limit = 10) {
  return await db
    .select({
      id: activitiesTable.id,
      sentAt: activitiesTable.sentAt,
      channel: activitiesTable.channel,
      status: activitiesTable.status,
      customer: {
        id: customersTable.id,
        firstName: customersTable.firstName,
        lastName: customersTable.lastName,
      },
    })
    .from(activitiesTable)
    .leftJoin(customersTable, eq(activitiesTable.customerId, customersTable.id))
    .where(sql`${activitiesTable.sentAt} IS NOT NULL`)
    .orderBy(desc(activitiesTable.sentAt))
    .limit(limit);
}
