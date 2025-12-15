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
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

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
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
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
          <CardTitle>لیدها ({total} مورد)</CardTitle>
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
                      <TableHead className="text-right">نام</TableHead>
                      <TableHead className="text-right">نام خانوادگی</TableHead>
                      <TableHead className="text-right">شماره تلفن</TableHead>
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
                          {lead.firstName}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.lastName}
                        </TableCell>
                        <TableCell className="text-right">
                          {lead.phone}
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
    </div>
  );
}
