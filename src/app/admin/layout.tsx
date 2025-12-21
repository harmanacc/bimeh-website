import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutContent from "@/components/admin/layout-content";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !["admin", "super-admin"].includes(session.user.role)) {
    redirect("/auth/signin");
  }

  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
