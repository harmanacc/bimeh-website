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
  Package,
  MessageSquare,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { name: "مدیریت محصولات", href: "/admin/products", icon: Package },
  { name: "مدیریت قالب‌ها", href: "/admin/templates", icon: FileText },
  { name: "آپلود لیدها", href: "/admin/upload-leads", icon: Upload },
  { name: "مدیریت لیدها", href: "/admin/outreach/leads", icon: Table },
  { name: "مدیریت مشتریان", href: "/admin/outreach/customers", icon: Users },
  { name: "ارسال پیام", href: "/admin/outreach/messages", icon: MessageSquare },
  { name: "تاریخچه فعالیت", href: "/admin/activity-history", icon: History },
  { name: "صادرات داده", href: "/admin/export-data", icon: Download },
];

export default function Sidebar() {
  const { data: session } = useSession();

  const userHref =
    session?.user.role === "customer"
      ? "/customer/profile"
      : `/admin/user-details`;

  return (
    <div className="w-64 bg-white h-full p-4 border-r border-gray-200 flex flex-col">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-black">BIM760</h1>
      </div>
      <div className="mb-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-black"
          )}
        >
          <span>داشبورد</span>
        </Link>
      </div>
      <Separator className="mb-4" />
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
          <span>تنظیمات</span>
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
