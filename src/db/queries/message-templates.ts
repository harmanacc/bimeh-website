import { db } from "@/db";
import { messageTemplatesTable } from "@/db/schema";
import { eq, desc, isNull, or, and } from "drizzle-orm";
import type { MessageTemplate, NewMessageTemplate } from "@/db/schema";

// Get all message templates
export async function getMessageTemplates() {
  return await db
    .select()
    .from(messageTemplatesTable)
    .orderBy(desc(messageTemplatesTable.createdAt));
}

// Get message templates for a specific product or global templates
export async function getMessageTemplatesForProduct(productId?: number) {
  const conditions = [];
  if (productId) {
    conditions.push(eq(messageTemplatesTable.productId, productId));
  } else {
    conditions.push(isNull(messageTemplatesTable.productId));
  }

  return await db
    .select()
    .from(messageTemplatesTable)
    .where(...conditions)
    .orderBy(desc(messageTemplatesTable.createdAt));
}

// Get all templates available for a product (product-specific + global)
export async function getAvailableTemplatesForProduct(productId?: number) {
  return await db
    .select()
    .from(messageTemplatesTable)
    .where(
      productId
        ? or(
            eq(messageTemplatesTable.productId, productId),
            isNull(messageTemplatesTable.productId)
          )
        : isNull(messageTemplatesTable.productId)
    )
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

// Get default template for a channel and optional product
export async function getDefaultTemplateForChannel(
  channel: string,
  productId?: number
) {
  // First try product-specific default
  if (productId) {
    const [productTemplate] = await db
      .select()
      .from(messageTemplatesTable)
      .where(eq(messageTemplatesTable.channel, channel as any))
      .where(eq(messageTemplatesTable.productId, productId))
      .where(eq(messageTemplatesTable.isDefault, true))
      .limit(1);

    if (productTemplate) return productTemplate;
  }

  // Fallback to global default
  const [globalTemplate] = await db
    .select()
    .from(messageTemplatesTable)
    .where(eq(messageTemplatesTable.channel, channel as any))
    .where(isNull(messageTemplatesTable.productId))
    .where(eq(messageTemplatesTable.isDefault, true))
    .limit(1);

  return globalTemplate || null;
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

// Set template as default for its channel and product/global scope
export async function setDefaultTemplate(id: number) {
  // First get the template to know its channel and productId
  const template = await getMessageTemplateById(id);
  if (!template) throw new Error("Template not found");

  // Unset all defaults for the same channel and scope (global or product-specific)
  const unsetCondition = template.productId
    ? and(
        eq(messageTemplatesTable.channel, template.channel),
        eq(messageTemplatesTable.isDefault, true),
        eq(messageTemplatesTable.productId, template.productId)
      )
    : and(
        eq(messageTemplatesTable.channel, template.channel),
        eq(messageTemplatesTable.isDefault, true),
        isNull(messageTemplatesTable.productId)
      );

  await db
    .update(messageTemplatesTable)
    .set({ isDefault: false })
    .where(unsetCondition);

  // Set the new default
  const [updatedTemplate] = await db
    .update(messageTemplatesTable)
    .set({ isDefault: true })
    .where(eq(messageTemplatesTable.id, id))
    .returning();

  return updatedTemplate;
}
