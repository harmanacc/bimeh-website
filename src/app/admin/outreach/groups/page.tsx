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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
} from "../actions";

interface Group {
  id: number;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
  };
}

interface GroupMemberWithUser {
  id: number;
  groupId: number;
  userId: number;
  userType: "lead" | "customer";
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    status?: string;
    // Other fields...
  };
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<
    GroupMemberWithUser[]
  >([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const limit = 10;

  const fetchGroups = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      });
      const response = await fetch(`/api/admin/outreach/groups?${params}`);
      if (!response.ok) throw new Error("Failed to fetch groups");
      const data = await response.json();
      setGroups(data.groups);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      toast.error("خطا در بارگذاری گروه‌ها");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchGroups(newPage);
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error("نام گروه را وارد کنید");
      return;
    }

    try {
      const result = await createGroupAction(
        formData.name.trim(),
        formData.description.trim() || undefined,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success("گروه با موفقیت ایجاد شد");
        setFormData({ name: "", description: "" });
        setIsCreateDialogOpen(false);
        fetchGroups(page);
      } else {
        toast.error(result.error || "خطا در ایجاد گروه");
      }
    } catch (error) {
      toast.error("خطا در ایجاد گروه");
      console.error(error);
    }
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup || !formData.name.trim()) {
      toast.error("نام گروه را وارد کنید");
      return;
    }

    try {
      const result = await updateGroupAction(
        editingGroup.id,
        formData.name.trim(),
        formData.description.trim() || undefined
      );

      if (result.success) {
        toast.success("گروه با موفقیت بروزرسانی شد");
        setFormData({ name: "", description: "" });
        setEditingGroup(null);
        fetchGroups(page);
      } else {
        toast.error(result.error || "خطا در بروزرسانی گروه");
      }
    } catch (error) {
      toast.error("خطا در بروزرسانی گروه");
      console.error(error);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این گروه را حذف کنید؟")) return;

    try {
      const result = await deleteGroupAction(id);
      if (result.success) {
        toast.success("گروه با موفقیت حذف شد");
        fetchGroups(page);
      } else {
        toast.error(result.error || "خطا در حذف گروه");
      }
    } catch (error) {
      toast.error("خطا در حذف گروه");
      console.error(error);
    }
  };

  const openEditDialog = (group: Group) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description || "" });
  };

  const openMembersDialog = async (group: Group) => {
    try {
      const response = await fetch(`/api/admin/outreach/groups/${group.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedGroupMembers(data.members || []);
        setSelectedGroupName(group.name);
        setMembersDialogOpen(true);
      } else {
        toast.error("خطا در بارگذاری اعضا");
      }
    } catch (error) {
      toast.error("خطا در بارگذاری اعضا");
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت گروه‌ها</h1>
          <p className="text-muted-foreground">
            ایجاد و مدیریت گروه‌های کاربران برای ارسال پیام گروهی.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              گروه جدید
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ایجاد گروه جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  نام گروه
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام گروه را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  توضیحات (اختیاری)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="توضیحات گروه را وارد کنید"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateGroup} className="flex-1">
                  ایجاد گروه
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>گروه‌ها ({total} مورد)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : groups.length === 0 ? (
            <p>هیچ گروهی یافت نشد.</p>
          ) : (
            <>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نام گروه</TableHead>
                      <TableHead className="text-right">توضیحات</TableHead>
                      <TableHead className="text-right">تعداد اعضا</TableHead>
                      <TableHead className="text-right">تاریخ ایجاد</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="text-right font-medium">
                          {group.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {group.description || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {group._count?.members || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(group.createdAt).toLocaleString("fa-IR", {
                            timeZone: "Asia/Tehran",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openMembersDialog(group)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteGroup(group.id)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش گروه</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">نام گروه</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="نام گروه را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                توضیحات (اختیاری)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="توضیحات گروه را وارد کنید"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateGroup} className="flex-1">
                بروزرسانی گروه
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingGroup(null)}
                className="flex-1"
              >
                انصراف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle>اعضای گروه: {selectedGroupName}</DialogTitle>
          </DialogHeader>

          {selectedGroupMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              این گروه هیچ عضوی ندارد.
            </p>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نوع</TableHead>
                    <TableHead className="text-right">نام</TableHead>
                    <TableHead className="text-right">نام خانوادگی</TableHead>
                    <TableHead className="text-right">شماره تلفن</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">
                      تاریخ اضافه شدن
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedGroupMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {member.userType === "lead" ? "لید" : "مشتری"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {member.user?.firstName || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.user?.lastName || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.user?.phone || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.user?.status ? (
                          <Badge variant="secondary">
                            {member.user.status}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(member.createdAt).toLocaleString("fa-IR", {
                          timeZone: "Asia/Tehran",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setMembersDialogOpen(false)}>بستن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
