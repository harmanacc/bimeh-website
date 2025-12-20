import { Suspense } from "react";
import { getMessageTemplates } from "@/db/queries/message-templates";
import { getCustomers } from "@/db/queries/customers";
import { getLeads } from "@/db/queries/leads";
import { MessagesPanel } from "@/components/admin/outreach/messages-panel";

export default async function MessagesPage() {
  // Fetch data server-side
  const [templates, customersResult, leadsResult] = await Promise.all([
    getMessageTemplates(),
    getCustomers({ limit: 100 }), // Get recent customers
    getLeads({ limit: 100 }), // Get recent leads
  ]);

  const recipients = [
    ...customersResult.customers.map((c) => ({
      ...c,
      type: "customer" as const,
    })),
    ...leadsResult.leads.map((l) => ({ ...l, type: "lead" as const })),
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ارسال پیام</h1>
        <p className="text-gray-600 mt-1">
          انتخاب قالب پیام، گیرنده و ارسال از طریق واتس‌اپ
        </p>
      </div>

      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <MessagesPanel templates={templates} recipients={recipients} />
      </Suspense>
    </div>
  );
}
