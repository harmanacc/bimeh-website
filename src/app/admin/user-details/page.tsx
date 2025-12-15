import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function UserDetailsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(session.user.id)))
    .limit(1);

  if (!user) {
    redirect("/admin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <p className="text-sm text-gray-600">{user.firstName || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <p className="text-sm text-gray-600">{user.lastName || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <p className="text-sm text-gray-600">{user.displayName || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <p className="text-sm text-gray-600">{user.phone || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Active</label>
          <p className="text-sm text-gray-600">
            {user.isActive ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
