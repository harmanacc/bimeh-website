import { NextRequest, NextResponse } from "next/server";
import { getActivities } from "@/db/queries/activities";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/outreach/activities - URL:", request.url);
    // Note: This route doesn't use params, so no need to await them
    const session = await auth();
    if (!session) {
      console.log("Unauthorized access to activities");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const customerId = searchParams.get("customerId")
      ? parseInt(searchParams.get("customerId")!)
      : undefined;
    const leadId = searchParams.get("leadId")
      ? parseInt(searchParams.get("leadId")!)
      : undefined;
    const channel = searchParams.get("channel") || undefined;
    const status = searchParams.get("status") || undefined;

    console.log("Activities query params:", {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      customerId,
      leadId,
      channel,
      status,
    });

    const result = await getActivities({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      customerId,
      leadId,
      channel,
      status,
    });

    console.log("Activities result:", result);

    // For customer-specific activity requests, return just the activities array
    // For general activity requests, return the full pagination object
    if (customerId) {
      console.log(
        "Returning customer-specific activities:",
        result.activities.length
      );
      return NextResponse.json({
        activities: result.activities,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
