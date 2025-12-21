import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import { db } from "@/db";
import { leadsTable, productsTable, customersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  normalizePhoneNumber,
  validatePhoneNumber,
} from "../../../lib/phone-validation";

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
    // productName removed - products selected manually in preview
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

    const allHeaders = jsonData[0] as string[];
    const rows = jsonData.slice(1) as any[][];

    // Only include relevant columns
    const allowedColumns = [
      "نام",
      "اسم",
      "name",
      "firstName",
      "first_name",
      "نام خانوادگی",
      "فامیلی",
      "surname",
      "lastName",
      "last_name",
      "تلفن",
      "شماره",
      "phone",
      "شماره تلفن",
      "phone_number",
    ];
    const headers = allHeaders.filter((h) => allowedColumns.includes(h));

    const leads = rows.map((row) => {
      const rowObj: any = {};
      headers.forEach((header, index) => {
        const headerIndex = allHeaders.indexOf(header);
        rowObj[header] = row[headerIndex] || "";
      });
      return rowObj;
    });

    // Add product column for manual selection
    headers.push("محصول");
    leads.forEach((lead) => {
      lead["محصول"] = "";
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
        const normalizedPhone = normalizePhoneNumber(mappedLead.phone);
        const validation = validatePhoneNumber(normalizedPhone);
        if (
          !validation.success ||
          !mappedLead.firstName ||
          !mappedLead.lastName
        ) {
          errors.push({
            lead,
            error: validation.error || "Missing required fields",
          });
          continue;
        }

        // Check for duplicate phone in leads and customers
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
          errors.push({ lead, error: "Duplicate phone number" });
          continue;
        }

        // Find product by name or keywords
        let productId = null;
        if (mappedLead.productName) {
          const product = products.find((p) => {
            // Exact match by name
            if (p.name === mappedLead.productName) return true;
            // Match by keywords (comma-separated)
            if (p.keywords) {
              const keywords = p.keywords
                .split(",")
                .map((k) => k.trim().toLowerCase());
              const searchTerm = mappedLead.productName!.toLowerCase();
              return keywords.some(
                (keyword) =>
                  searchTerm.includes(keyword) || keyword.includes(searchTerm)
              );
            }
            return false;
          });
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
