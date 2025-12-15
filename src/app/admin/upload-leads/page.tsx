"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";
import LeadPreviewTable from "../../../../components/admin/outreach/lead-preview-table";

interface LeadData {
  [key: string]: string;
}

export default function UploadLeadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<LeadData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/outreach/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse file");
      }

      const data = await response.json();
      setPreviewData(data.leads);
      setColumns(data.columns);
      toast.success("فایل با موفقیت بارگذاری و تجزیه شد");
    } catch (error) {
      toast.error("خطا در بارگذاری فایل");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const response = await fetch("/api/admin/outreach/import", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: previewData }),
      });

      if (!response.ok) {
        throw new Error("Failed to insert leads");
      }

      const data = await response.json();
      if (data.inserted > 0) {
        toast.success(`${data.inserted} لید با موفقیت اضافه شد`);
        setPreviewData([]);
        setColumns([]);
        setFile(null);
      } else {
        toast.error(`هیچ لیدی اضافه نشد. خطاها: ${data.errors}`);
        console.error("Insertion errors:", data.errorDetails);
      }
    } catch (error) {
      toast.error("خطا در اضافه کردن لیدها");
      console.error(error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDataChange = (newData: LeadData[]) => {
    setPreviewData(newData);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">بارگذاری لیدها</h1>
        <p className="text-muted-foreground">
          فایل Excel را انتخاب کنید تا لیدها را بارگذاری و پیش‌نمایش کنید.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            انتخاب فایل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
          {isUploading && <p>در حال بارگذاری...</p>}
        </CardContent>
      </Card>

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>پیش‌نمایش داده‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadPreviewTable
              data={previewData}
              columns={columns}
              onDataChange={handleDataChange}
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConfirming ? "در حال اضافه کردن..." : "تأیید و اضافه کردن"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
