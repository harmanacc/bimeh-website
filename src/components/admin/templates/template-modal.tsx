"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

interface Template {
  id: number;
  name: string;
  templateText: string;
  channel: string;
  productId?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    name: string;
  };
}

interface Product {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  onSaved: () => void;
}

export default function TemplateModal({
  open,
  onClose,
  template,
  onSaved,
}: TemplateModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    templateText: "",
    channel: "whatsapp" as
      | "whatsapp"
      | "sms"
      | "email"
      | "telegram"
      | "bale"
      | "instgram",
    productId: "",
    isDefault: false,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        templateText: template.templateText,
        channel: template.channel as
          | "whatsapp"
          | "sms"
          | "email"
          | "telegram"
          | "bale"
          | "instgram",
        productId: template.productId ? template.productId.toString() : "none",
        isDefault: template.isDefault || false,
      });
    } else {
      setFormData({
        name: "",
        templateText: "",
        channel: "whatsapp",
        productId: "none",
        isDefault: false,
      });
    }
  }, [template, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = template
        ? `/api/admin/templates?id=${template.id}`
        : "/api/admin/templates";

      const method = template ? "PUT" : "POST";

      const payload = {
        ...formData,
        productId:
          formData.productId && formData.productId !== "none"
            ? parseInt(formData.productId)
            : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save template");

      toast.success(template ? "قالب ویرایش شد" : "قالب اضافه شد");
      onSaved();
      onClose();
    } catch (error) {
      toast.error("خطا در ذخیره قالب");
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>{template ? "ویرایش قالب" : "قالب جدید"}</DialogTitle>
        </DialogHeader>

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
                  setFormData({
                    ...formData,
                    channel: value as
                      | "whatsapp"
                      | "sms"
                      | "email"
                      | "telegram"
                      | "bale"
                      | "instgram",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">واتس‌اپ</SelectItem>
                  <SelectItem value="sms">پیامک</SelectItem>
                  <SelectItem value="email">ایمیل</SelectItem>
                  <SelectItem value="telegram">تلگرام</SelectItem>
                  <SelectItem value="bale">بله</SelectItem>
                  <SelectItem value="instgram">اینستاگرام</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="productId">محصول (اختیاری)</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) =>
                setFormData({ ...formData, productId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب محصول (برای قالب عمومی خالی بگذارید)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">قالب عمومی</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              rows={6}
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
              قالب پیش‌فرض برای این کانال و محصول
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{template ? "ویرایش" : "افزودن"}</Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              انصراف
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
