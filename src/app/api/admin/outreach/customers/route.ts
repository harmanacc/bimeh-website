import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/db/queries/customers";
import { db } from "@/db";
import { leadsTable, customersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { validatePhoneNumber } from "@/lib/phone-validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const result = await getCustomers({
      page,
      limit,
      search,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(body.phone);
    const validation = validatePhoneNumber(normalizedPhone);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if phone number already exists in leads or customers
    const existingLead = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.phone, normalizedPhone))
      .limit(1);

    const existingCustomer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.phone, normalizedPhone))
      .limit(1);

    if (existingLead.length > 0 || existingCustomer.length > 0) {
      return NextResponse.json(
        { error: "شماره تلفن تکراری است" },
        { status: 400 }
      );
    }

    const customer = await createCustomer({ ...body, phone: normalizedPhone });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
