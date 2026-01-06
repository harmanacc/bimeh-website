"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import type { MessageTemplate } from "@/db/schema";

interface Product {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplatesModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function TemplatesModal({
  open,
  onClose,
  product,
}: TemplatesModalProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    templateText: "",
    channel: "whatsapp",
    isDefault: false,
  });

  const fetchTemplates = async () => {
    if (!product) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/products/${product.id}/templates`
      );
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      toast.error("خطا در بارگذاری قالب‌ها");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && product) {
      fetchTemplates();
    }
  }, [open, product]);

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      templateText: "",
      channel: "whatsapp",
      isDefault: false,
    });
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      templateText: template.templateText,
      channel: template.channel,
      isDefault: template.isDefault || false,
    });
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این قالب را حذف کنید؟")) return;

    try {
      const response = await fetch(
        `/api/admin/products/${product?.id}/templates?id=${templateId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete template");

      toast.success("قالب با موفقیت حذف شد");
      fetchTemplates();
    } catch (error) {
      toast.error("خطا در حذف قالب");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const url = editingTemplate
        ? `/api/admin/products/${product.id}/templates?id=${editingTemplate.id}`
        : `/api/admin/products/${product.id}/templates`;

      const method = editingTemplate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productId: product.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to save template");

      toast.success(editingTemplate ? "قالب ویرایش شد" : "قالب اضافه شد");
      setIsFormOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error("خطا در ذخیره قالب");
      console.error(error);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTemplate(null);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>مدیریت قالب‌های پیام - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">قالب‌های پیام</h3>
              <p className="text-sm text-muted-foreground">
                قالب‌های مخصوص محصول {product.name}
              </p>
            </div>
            <Button
              onClick={handleAddTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              قالب جدید
            </Button>
          </div>

          {loading ? (
            <div className="text-center">در حال بارگذاری...</div>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        {template.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 ml-1" />
                            پیش‌فرض
                          </Badge>
                        )}
                        <Badge variant="outline">{template.channel}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditTemplate(template)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                      {template.templateText}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {templates.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  هیچ قالبی برای این محصول تعریف نشده است
                </div>
              )}
            </div>
          )}

          {isFormOpen && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingTemplate ? "ویرایش قالب" : "قالب جدید"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">نام قالب</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="channel">کانال</Label>
                      <Select
                        value={formData.channel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, channel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">واتس‌اپ</SelectItem>
                          <SelectItem value="sms">پیامک</SelectItem>
                          <SelectItem value="email">ایمیل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="templateText">متن قالب</Label>
                    <Textarea
                      id="templateText"
                      value={formData.templateText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateText: e.target.value,
                        })
                      }
                      placeholder="متن قالب را وارد کنید..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="isDefault">
                      قالب پیش‌فرض برای این محصول و کانال
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingTemplate ? "ویرایش" : "افزودن"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
