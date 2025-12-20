import { Suspense } from "react";
import { getActivities } from "@/db/queries/activities";
import { ActivityHistoryPanel } from "@/components/admin/activity-history-panel";

export default async function ActivityHistoryPage() {
  // Fetch initial data server-side
  const activitiesResult = await getActivities({ limit: 50 });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">تاریخچه فعالیت‌ها</h1>
        <p className="text-gray-600 mt-1">
          مشاهده و فیلتر فعالیت‌های بازاریابی و ارسال پیام
        </p>
      </div>

      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <ActivityHistoryPanel initialActivities={activitiesResult.activities} />
      </Suspense>
    </div>
  );
}
