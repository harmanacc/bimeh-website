"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { convertLeadToCustomerAction, markLeadAsContacted } from "../actions";
import { useMessagingStore } from "@/lib/stores/messaging-store";
import GroupSelectionDialog from "@/components/admin/outreach/group-selection-dialog";

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  product?: {
    id: number;
    name: string;
  };
  source?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const { addToGroup } = useMessagingStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const limit = 10;

  const fetchLeads = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const response = await fetch(`/api/admin/outreach/leads?${params}`);
      if (!response.ok) throw new Error("Failed to fetch leads");
      const data = await response.json();
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      toast.error("خطا در بارگذاری لیدها");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = () => {
    fetchLeads(search, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchLeads(search, newPage);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این لید را حذف کنید؟")) return;
    try {
      const response = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      toast.success("لید با موفقیت حذف شد");
      fetchLeads(search, page);
    } catch (error) {
      toast.error("خطا در حذف لید");
      console.error(error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update lead status");
      toast.success("وضعیت لید بروزرسانی شد");
      fetchLeads(search, page);
    } catch (error) {
      toast.error("خطا در بروزرسانی وضعیت لید");
      console.error(error);
    }
  };

  const handleConvertToCustomer = async (id: number) => {
    try {
      const result = await convertLeadToCustomerAction(id);
      if (result.success) {
        toast.success("لید به مشتری تبدیل شد");
        fetchLeads(search, page);
      } else {
        toast.error(result.error || "خطا در تبدیل");
      }
    } catch (error) {
      toast.error("خطا در تبدیل لید به مشتری");
      console.error(error);
    }
  };

  const handleMarkContacted = async (id: number) => {
    try {
      const result = await markLeadAsContacted(id);
      if (result.success) {
        toast.success("لید به عنوان تماس گرفته شده علامت‌گذاری شد");
        fetchLeads(search, page);
      } else {
        toast.error(result.error || "خطا در علامت‌گذاری");
      }
    } catch (error) {
      toast.error("خطا در علامت‌گذاری تماس");
      console.error(error);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads((prev) => [...prev, leadId]);
    } else {
      setSelectedLeads((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const handleAddToGroup = () => {
    if (selectedLeads.length === 0) return;
    setIsGroupDialogOpen(true);
  };

  const handleGroupDialogSuccess = () => {
    setSelectedLeads([]);
    fetchLeads(search, page); // Refresh to update any changes
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">مدیریت لیدها</h1>
        <p className="text-muted-foreground">
          مشاهده و مدیریت لیدهای وارد شده به سیستم.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فیلتر و جستجو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="جستجو بر اساس نام یا شماره تلفن..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              جستجو
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>لیدها ({total} مورد)</CardTitle>
            {selectedLeads.length > 0 && (
              <Button onClick={handleAddToGroup} variant="secondary">
                <Users className="h-4 w-4 mr-2" />
                افزودن {selectedLeads.length} مورد به گروه
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : leads.length === 0 ? (
            <p>هیچ لیدی یافت نشد.</p>
          ) : (
            <>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">
                        <Checkbox
                          checked={
                            selectedLeads.length === leads.length &&
                            leads.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeads(leads.map((lead) => lead.id));
                            } else {
                              setSelectedLeads([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="text-right">نام</TableHead>
                      <TableHead className="text-right">نام خانوادگی</TableHead>
                      <TableHead className="text-right">شماره تلفن</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">محصول</TableHead>
                      <TableHead className="text-right">منبع</TableHead>
                      <TableHead className="text-right">تاریخ ایجاد</TableHead>
                      <TableHead className="text-right">
                        تاریخ بروزرسانی
                      </TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-right">
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={(checked) =>
                              handleSelectLead(lead.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.firstName}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.lastName}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={lead.status}
                            onValueChange={(value) =>
                              handleStatusChange(lead.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lead">لید</SelectItem>
                              <SelectItem value="contacted">
                                تماس گرفته شده
                              </SelectItem>
                              <SelectItem value="deactivated">
                                غیرفعال
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.product ? (
                            <Badge variant="secondary">
                              {lead.product.name}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.source || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(lead.createdAt).toLocaleString("fa-IR", {
                            timeZone: "Asia/Tehran",
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(lead.updatedAt).toLocaleString("fa-IR", {
                            timeZone: "Asia/Tehran",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToCustomer(lead.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkContacted(lead.id)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(lead.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  صفحه {page} از {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <GroupSelectionDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        userIds={selectedLeads}
        userType="lead"
        onSuccess={handleGroupDialogSuccess}
      />
    </div>
  );
}
