"use client";

import Link from "next/link";
import {
  Upload,
  Table,
  Users,
  History,
  Download,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  { name: "Upload Leads", href: "/admin/upload-leads", icon: Upload },
  { name: "Leads Table", href: "/admin/leads-table", icon: Table },
  { name: "Customers Table", href: "/admin/customers-table", icon: Users },
  { name: "Activity History", href: "/admin/activity-history", icon: History },
  { name: "Export Data", href: "/admin/export-data", icon: Download },
];

export default function Sidebar() {
  const { data: session } = useSession();

  const userHref =
    session?.user.role === "customer"
      ? "/customer/profile"
      : `/admin/user-details`;

  return (
    <div className="w-64 bg-white h-full p-4 border-r border-gray-200 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-black"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t pt-4 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-black"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        {session?.user && (
          <Link
            href={userHref}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-black"
            )}
          >
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span>{session.user.name || session.user.email}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
