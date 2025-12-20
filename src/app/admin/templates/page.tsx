"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, FileText } from "lucide-react";
import TemplatesTable from "@/components/admin/templates/templates-table";
import TemplateModal from "@/components/admin/templates/template-modal";

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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/templates");
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
    fetchTemplates();
  }, []);

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این قالب را حذف کنید؟")) return;

    try {
      const response = await fetch(`/api/admin/templates?id=${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      toast.success("قالب با موفقیت حذف شد");
      fetchTemplates();
    } catch (error) {
      toast.error("خطا در حذف قالب");
      console.error(error);
    }
  };

  const handleSetDefault = async (templateId: number) => {
    try {
      const response = await fetch(
        `/api/admin/templates?id=${templateId}&action=set-default`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) throw new Error("Failed to set default template");

      toast.success("قالب پیش‌فرض تنظیم شد");
      fetchTemplates();
    } catch (error) {
      toast.error("خطا در تنظیم قالب پیش‌فرض");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTemplate(null);
  };

  const handleTemplateSaved = () => {
    fetchTemplates();
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">مدیریت قالب‌ها</h1>
          <p className="text-muted-foreground">
            قالب‌های پیام را اضافه، ویرایش و حذف کنید.
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            لیست قالب‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TemplatesTable
            templates={templates}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onSetDefault={handleSetDefault}
          />
        </CardContent>
      </Card>

      <TemplateModal
        open={modalOpen}
        onClose={handleModalClose}
        template={editingTemplate}
        onSaved={handleTemplateSaved}
      />
    </div>
  );
}
