import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Activity, MessageChannel } from "@/db/schema";

interface ActivityHistoryPanelProps {
  customerId: number;
}

export default function ActivityHistoryPanel({
  customerId,
}: ActivityHistoryPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      console.log("Fetching activities for customerId:", customerId);
      const response = await fetch(
        `/api/admin/outreach/activities?customerId=${customerId}&sortBy=sentAt&sortOrder=desc`
      );
      console.log("Activities fetch response status:", response.status);
      if (!response.ok)
        throw new Error(
          `Failed to fetch activities: ${response.status} ${response.statusText}`
        );
      const data = await response.json();
      console.log("Fetched activities data:", data);
      setActivities(data.activities);
    } catch (error) {
      toast.error("خطا در بارگذاری فعالیت‌ها");
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [customerId]);

  const getChannelLabel = (channel: MessageChannel) => {
    const labels: { [key: string]: string } = {
      whatsapp: "واتس‌اپ",
      sms: "پیامک",
      email: "ایمیل",
      telegram: "تلگرام",
      bale: "بله",
      eita: "ایتا",
      instagram: "اینستاگرام",
    };
    return labels[channel] || channel;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "در انتظار",
      sent: "ارسال شده",
      failed: "ناموفق",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("fa-IR", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card dir="rtl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>تاریخچه فعالیت‌ها</CardTitle>
          <Button onClick={fetchActivities} variant="outline" size="sm">
            <Clock className="h-4 w-4 ml-2" />
            به‌روزرسانی
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>در حال بارگذاری فعالیت‌ها...</p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground">فعالیتی وجود ندارد</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <Badge variant="outline">
                      {getStatusLabel(activity.status)}
                    </Badge>
                    <Badge variant="secondary">
                      {getChannelLabel(activity.channel)}
                    </Badge>
                    {activity.isAiGenerated && (
                      <Badge variant="default">AI</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.sentAt
                      ? formatDateTime(activity.sentAt)
                      : formatDateTime(activity.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Send className="h-4 w-4" />
                  <span>ارسال شده توسط: {activity.sentBy || "سیستم"}</span>
                </div>

                {activity.failureReason && activity.status === "failed" && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    <span className="font-medium">دلیل خطا:</span>{" "}
                    {activity.failureReason}
                  </div>
                )}

                <div className="bg-muted p-3 rounded">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>متن پیام:</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">
                    {activity.messageText}
                  </p>
                </div>

                {activity.templateUsed && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">الگوی استفاده شده:</span>{" "}
                    {activity.templateUsed}
                  </div>
                )}

                {activity.notes && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">یادداشت:</span>{" "}
                    {activity.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
