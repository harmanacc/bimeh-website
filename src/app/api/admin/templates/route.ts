import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messageTemplatesTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getMessageTemplates,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  setDefaultTemplate,
} from "@/db/queries/message-templates";

export async function GET() {
  try {
    // Get all templates with product information
    const templates = await db
      .select({
        id: messageTemplatesTable.id,
        name: messageTemplatesTable.name,
        templateText: messageTemplatesTable.templateText,
        channel: messageTemplatesTable.channel,
        productId: messageTemplatesTable.productId,
        isDefault: messageTemplatesTable.isDefault,
        createdAt: messageTemplatesTable.createdAt,
        updatedAt: messageTemplatesTable.updatedAt,
        createdBy: messageTemplatesTable.createdBy,
        product: {
          id: productsTable.id,
          name: productsTable.name,
        },
      })
      .from(messageTemplatesTable)
      .leftJoin(
        productsTable,
        eq(messageTemplatesTable.productId, productsTable.id)
      )
      .orderBy(messageTemplatesTable.createdAt);

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, templateText, channel, productId, isDefault } = body;

    if (!name || !templateText || !channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const template = await createMessageTemplate({
      name,
      templateText,
      channel,
      productId: productId || null,
      isDefault: isDefault || false,
      createdBy: "admin", // TODO: Get from session
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    const action = searchParams.get("action");

    if (action === "set-default") {
      if (!templateId) {
        return NextResponse.json(
          { error: "Template ID required" },
          { status: 400 }
        );
      }

      const template = await setDefaultTemplate(parseInt(templateId));
      return NextResponse.json({ template });
    }

    // Regular update
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, templateText, channel, productId, isDefault } = body;

    const template = await updateMessageTemplate(parseInt(templateId), {
      name,
      templateText,
      channel,
      productId: productId || null,
      isDefault,
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID required" },
        { status: 400 }
      );
    }

    const template = await deleteMessageTemplate(parseInt(templateId));
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
