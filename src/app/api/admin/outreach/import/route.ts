import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import { db } from "@/db";
import { leadsTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

function normalizePhone(phone: string): string {
  // Remove spaces, dashes, etc.
  let normalized = phone.replace(/[\s\-\(\)]/g, "");
  // If starts with 0, replace with +98
  if (normalized.startsWith("0")) {
    normalized = "+98" + normalized.slice(1);
  }
  // If starts with 9, assume +989
  if (normalized.startsWith("9") && !normalized.startsWith("+98")) {
    normalized = "+98" + normalized;
  }
  return normalized;
}

function mapColumns(row: any): {
  firstName: string;
  lastName: string;
  phone: string;
  productName?: string;
} {
  // Map common column names
  const mappings: { [key: string]: string } = {
    // firstName
    نام: "firstName",
    اسم: "firstName",
    name: "firstName",
    firstName: "firstName",
    first_name: "firstName",
    // lastName
    "نام خانوادگی": "lastName",
    فامیلی: "lastName",
    surname: "lastName",
    lastName: "lastName",
    last_name: "lastName",
    // phone
    تلفن: "phone",
    شماره: "phone",
    phone: "phone",
    "شماره تلفن": "phone",
    phone_number: "phone",
    // productName
    "نوع بیمه": "productName",
    insuranceType: "productName",
    insurance_type: "productName",
    product: "productName",
    محصول: "productName",
  };

  const mapped: any = {};
  for (const key in row) {
    const lowerKey = key.toLowerCase();
    const mappedKey = mappings[key] || mappings[lowerKey] || key;
    mapped[mappedKey] = row[key];
  }

  return {
    firstName: mapped.firstName || "",
    lastName: mapped.lastName || "",
    phone: mapped.phone || "",
    productName: mapped.productName,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "File must have at least header and one row" },
        { status: 400 }
      );
    }

    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1) as any[][];

    const leads = rows.map((row) => {
      const rowObj: any = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || "";
      });
      return rowObj;
    });

    return NextResponse.json({ leads, columns: headers });
  } catch (error) {
    console.error("Error parsing file:", error);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leads } = await request.json();

    if (!Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Fetch all products for matching
    const products = await db.select().from(productsTable);

    const validLeads = [];
    const errors = [];

    for (const lead of leads) {
      try {
        const mappedLead = mapColumns(lead);
        const normalizedPhone = normalizePhone(mappedLead.phone);
        if (!normalizedPhone || !mappedLead.firstName || !mappedLead.lastName) {
          errors.push({ lead, error: "Missing required fields" });
          continue;
        }

        // Check for duplicate phone
        const existing = await db
          .select()
          .from(leadsTable)
          .where(eq(leadsTable.phone, normalizedPhone));
        if (existing.length > 0) {
          errors.push({ lead, error: "Duplicate phone number" });
          continue;
        }

        // Find product by name
        let productId = null;
        if (mappedLead.productName) {
          const product = products.find(
            (p) => p.name === mappedLead.productName
          );
          if (product) {
            productId = product.id;
          }
        }

        validLeads.push({
          firstName: mappedLead.firstName,
          lastName: mappedLead.lastName,
          phone: normalizedPhone,
          productId,
          source: "Excel import",
          importedBy: "admin", // TODO: get from session
        });
      } catch (err) {
        errors.push({ lead, error: "Validation error" });
      }
    }

    if (validLeads.length > 0) {
      await db.insert(leadsTable).values(validLeads);
    }

    return NextResponse.json({
      success: true,
      inserted: validLeads.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    console.error("Error inserting leads:", error);
    return NextResponse.json(
      { error: "Failed to insert leads" },
      { status: 500 }
    );
  }
}
