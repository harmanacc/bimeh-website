"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import type { Activity, Customer, Lead } from "@/db/schema";

type ActivityWithJoins = Activity & {
  customer: Pick<Customer, "id" | "firstName" | "lastName" | "phone"> | null;
  lead: Pick<Lead, "id" | "firstName" | "lastName" | "phone"> | null;
};

interface ActivityHistoryPanelProps {
  initialActivities: ActivityWithJoins[];
}

export function ActivityHistoryPanel({
  initialActivities,
}: ActivityHistoryPanelProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter activities based on current filters
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Tab filter
    if (activeTab === "customers") {
      filtered = filtered.filter((activity) => activity.customer !== null);
    } else if (activeTab === "leads") {
      filtered = filtered.filter((activity) => activity.lead !== null);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((activity) => {
        const customerName = activity.customer
          ? `${activity.customer.firstName} ${activity.customer.lastName}`
          : "";
        const leadName = activity.lead
          ? `${activity.lead.firstName} ${activity.lead.lastName}`
          : "";
        const phone = activity.customer?.phone || activity.lead?.phone || "";
        const message = activity.messageText.toLowerCase();

        return (
          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phone.includes(searchTerm) ||
          message.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Channel filter
    if (channelFilter && channelFilter !== "all") {
      filtered = filtered.filter(
        (activity) => activity.channel === channelFilter
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(
        (activity) => activity.status === statusFilter
      );
    }

    // Date filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(
        (activity) => new Date(activity.createdAt) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(
        (activity) => new Date(activity.createdAt) <= toDate
      );
    }

    return filtered;
  }, [
    activities,
    activeTab,
    searchTerm,
    channelFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">ارسال شده</Badge>;
      case "pending":
        return <Badge variant="secondary">در انتظار</Badge>;
      case "failed":
        return <Badge variant="destructive">ناموفق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <Badge variant="default">واتس‌اپ</Badge>;
      case "sms":
        return <Badge variant="secondary">پیامک</Badge>;
      case "email":
        return <Badge variant="outline">ایمیل</Badge>;
      default:
        return <Badge variant="outline">{channel}</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setChannelFilter("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فیلترها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">جستجو</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="نام، شماره تلفن یا متن پیام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">کانال</label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="همه کانال‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="whatsapp">واتس‌اپ</SelectItem>
                  <SelectItem value="sms">پیامک</SelectItem>
                  <SelectItem value="email">ایمیل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وضعیت</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="همه وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="sent">ارسال شده</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="failed">ناموفق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">از تاریخ</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تا تاریخ</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌ها ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="customers">مشتریان</TabsTrigger>
              <TabsTrigger value="leads">لیدها</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>گیرنده</TableHead>
                      <TableHead>شماره تلفن</TableHead>
                      <TableHead>کانال</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead>تاریخ ارسال</TableHead>
                      <TableHead>متن پیام</TableHead>
                      <TableHead>قالب استفاده شده</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          {activity.customer ? (
                            <div>
                              <div className="font-medium">
                                {activity.customer.firstName}{" "}
                                {activity.customer.lastName}
                              </div>
                              <Badge variant="default" className="text-xs">
                                مشتری
                              </Badge>
                            </div>
                          ) : activity.lead ? (
                            <div>
                              <div className="font-medium">
                                {activity.lead.firstName}{" "}
                                {activity.lead.lastName}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                لید
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-gray-500">نامشخص</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {activity.customer?.phone ||
                            activity.lead?.phone ||
                            "-"}
                        </TableCell>
                        <TableCell>
                          {getChannelBadge(activity.channel)}
                        </TableCell>
                        <TableCell>{getStatusBadge(activity.status)}</TableCell>
                        <TableCell>
                          {activity.sentAt
                            ? format(
                                new Date(activity.sentAt),
                                "yyyy/MM/dd HH:mm",
                                { locale: faIR }
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-xs truncate"
                            title={activity.messageText}
                          >
                            {activity.messageText}
                          </div>
                        </TableCell>
                        <TableCell>{activity.templateUsed || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  هیچ فعالیتی یافت نشد
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
