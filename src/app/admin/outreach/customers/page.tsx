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
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useMessagingStore } from "@/lib/stores/messaging-store";
import GroupSelectionDialog from "@/components/admin/outreach/group-selection-dialog";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  insuranceType?: string;
  preferredChannel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const { addToGroup } = useMessagingStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const limit = 10;

  const fetchCustomers = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const response = await fetch(`/api/admin/outreach/customers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data.customers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      toast.error("خطا در بارگذاری مشتریان");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = () => {
    fetchCustomers(search, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchCustomers(search, newPage);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این مشتری را حذف کنید؟")) return;
    try {
      const response = await fetch(`/api/admin/outreach/customers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete customer");
      toast.success("مشتری با موفقیت حذف شد");
      fetchCustomers(search, page);
    } catch (error) {
      toast.error("خطا در حذف مشتری");
      console.error(error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/outreach/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update customer status");
      toast.success("وضعیت مشتری بروزرسانی شد");
      fetchCustomers(search, page);
    } catch (error) {
      toast.error("خطا در بروزرسانی وضعیت مشتری");
      console.error(error);
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels: { [key: string]: string } = {
      whatsapp: "واتس‌اپ",
      sms: "پیامک",
      email: "ایمیل",
      telegram: "تلگرام",
      bale: "بله",
      eita: "ایتا",
      instgram: "اینستاگرام",
    };
    return labels[channel] || channel;
  };

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const handleAddToGroup = () => {
    if (selectedCustomers.length === 0) return;
    setIsGroupDialogOpen(true);
  };

  const handleGroupDialogSuccess = () => {
    setSelectedCustomers([]);
    fetchCustomers(search, page); // Refresh to update any changes
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">مدیریت مشتریان</h1>
        <p className="text-muted-foreground">مشاهده و مدیریت مشتریان سیستم.</p>
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
            <CardTitle>مشتریان ({total} مورد)</CardTitle>
            {selectedCustomers.length > 0 && (
              <Button onClick={handleAddToGroup} variant="secondary">
                <Users className="h-4 w-4 mr-2" />
                افزودن {selectedCustomers.length} مورد به گروه
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : customers.length === 0 ? (
            <p>هیچ مشتری‌ای یافت نشد.</p>
          ) : (
            <>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">
                        <Checkbox
                          checked={
                            selectedCustomers.length === customers.length &&
                            customers.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCustomers(
                                customers.map((customer) => customer.id)
                              );
                            } else {
                              setSelectedCustomers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="text-right">نام</TableHead>
                      <TableHead className="text-right">نام خانوادگی</TableHead>
                      <TableHead className="text-right">شماره تلفن</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">نوع بیمه</TableHead>
                      <TableHead className="text-right">کانال ترجیحی</TableHead>
                      <TableHead className="text-right">تاریخ ایجاد</TableHead>
                      <TableHead className="text-right">
                        تاریخ بروزرسانی
                      </TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) =>
                              handleSelectCustomer(
                                customer.id,
                                checked as boolean
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{customer.firstName}</TableCell>
                        <TableCell>{customer.lastName}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <Select
                            value={customer.status}
                            onValueChange={(value) =>
                              handleStatusChange(customer.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">جدید</SelectItem>
                              <SelectItem value="contacted">
                                تماس گرفته شده
                              </SelectItem>
                              <SelectItem value="target">هدف</SelectItem>
                              <SelectItem value="active">فعال</SelectItem>
                              <SelectItem value="deactivated">
                                غیرفعال
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {customer.insuranceType ? (
                            <Badge variant="secondary">
                              {customer.insuranceType}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getChannelLabel(customer.preferredChannel)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(customer.createdAt).toLocaleString(
                            "fa-IR",
                            { timeZone: "Asia/Tehran" }
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(customer.updatedAt).toLocaleString(
                            "fa-IR",
                            { timeZone: "Asia/Tehran" }
                          )}
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
                              onClick={() => handleDelete(customer.id)}
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
        userIds={selectedCustomers}
        userType="customer"
        onSuccess={handleGroupDialogSuccess}
      />
    </div>
  );
}
