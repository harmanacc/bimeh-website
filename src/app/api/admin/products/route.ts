import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsTable } from "@/db/schema";

export async function GET() {
  try {
    const products = await db.select().from(productsTable);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
