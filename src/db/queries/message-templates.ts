import { db } from "@/db";
import { messageTemplatesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { MessageTemplate, NewMessageTemplate } from "@/db/schema";

// Get all message templates
export async function getMessageTemplates() {
  return await db
    .select()
    .from(messageTemplatesTable)
    .orderBy(desc(messageTemplatesTable.createdAt));
}

// Get message template by ID
export async function getMessageTemplateById(id: number) {
  const [template] = await db
    .select()
    .from(messageTemplatesTable)
    .where(eq(messageTemplatesTable.id, id))
    .limit(1);

  return template || null;
}

// Get default template for a channel
export async function getDefaultTemplateForChannel(channel: string) {
  const [template] = await db
    .select()
    .from(messageTemplatesTable)
    .where(eq(messageTemplatesTable.channel, channel as any))
    .where(eq(messageTemplatesTable.isDefault, true))
    .limit(1);

  return template || null;
}

// Create new message template
export async function createMessageTemplate(data: NewMessageTemplate) {
  const [template] = await db
    .insert(messageTemplatesTable)
    .values(data)
    .returning();
  return template;
}

// Update message template
export async function updateMessageTemplate(
  id: number,
  data: Partial<NewMessageTemplate>
) {
  const [template] = await db
    .update(messageTemplatesTable)
    .set(data)
    .where(eq(messageTemplatesTable.id, id))
    .returning();
  return template;
}

// Delete message template
export async function deleteMessageTemplate(id: number) {
  const [template] = await db
    .delete(messageTemplatesTable)
    .where(eq(messageTemplatesTable.id, id))
    .returning();
  return template;
}
