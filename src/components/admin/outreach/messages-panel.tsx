"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Eye, ExternalLink } from "lucide-react";
import {
  sendWhatsAppMessage,
  logActivity,
  getMessagePreview,
} from "@/app/admin/outreach/actions";
import { replaceTemplateVariables } from "@/lib/template-utils";
import { toast } from "sonner";
import type { MessageTemplate, Customer, Lead } from "@/db/schema";

type Recipient = (Customer | Lead) & { type: "customer" | "lead" };

interface MessagesPanelProps {
  templates: MessageTemplate[];
  recipients: Recipient[];
}

export function MessagesPanel({ templates, recipients }: MessagesPanelProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [messageText, setMessageText] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update message text when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setMessageText(selectedTemplate.templateText);
    }
  }, [selectedTemplate]);

  // Update preview when message or recipient changes
  useEffect(() => {
    if (messageText && selectedRecipient) {
      const preview = replaceTemplateVariables(messageText, selectedRecipient);
      setPreviewMessage(preview);
    } else {
      setPreviewMessage(messageText);
    }
  }, [messageText, selectedRecipient]);

  const handleSendMessage = async () => {
    if (!selectedRecipient || !messageText.trim()) {
      toast.error("لطفاً گیرنده و متن پیام را انتخاب کنید");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendWhatsAppMessage(
        selectedRecipient,
        messageText,
        selectedTemplate?.name,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success("پیام با موفقیت ارسال شد");
        // Open WhatsApp link in new tab
        window.open(result.whatsappUrl, "_blank");
      } else {
        toast.error(result.error || "خطا در ارسال پیام");
      }
    } catch (error) {
      toast.error("خطا در ارسال پیام");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogActivity = async () => {
    if (!selectedRecipient || !messageText.trim()) {
      toast.error("لطفاً گیرنده و متن پیام را انتخاب کنید");
      return;
    }

    setIsLoading(true);
    try {
      const result = await logActivity(
        selectedRecipient,
        messageText,
        "whatsapp",
        selectedTemplate?.name,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success("فعالیت با موفقیت ثبت شد");
      } else {
        toast.error(result.error || "خطا در ثبت فعالیت");
      }
    } catch (error) {
      toast.error("خطا در ثبت فعالیت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Message Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            تنظیمات پیام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">قالب پیام</label>
            <Select
              value={selectedTemplate?.id.toString() || ""}
              onValueChange={(value) => {
                const template = templates.find(
                  (t) => t.id.toString() === value
                );
                setSelectedTemplate(template || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب قالب..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name} ({template.channel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">گیرنده</label>
            <Select
              value={selectedRecipient?.id.toString() || ""}
              onValueChange={(value) => {
                const recipient = recipients.find(
                  (r) => r.id.toString() === value
                );
                setSelectedRecipient(recipient || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب گیرنده..." />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem
                    key={`${recipient.type}-${recipient.id}`}
                    value={recipient.id.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {recipient.firstName} {recipient.lastName}
                      </span>
                      <Badge
                        variant={
                          recipient.type === "customer"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {recipient.type === "customer" ? "مشتری" : "لید"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {recipient.phone}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-sm font-medium mb-2">متن پیام</label>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="متن پیام را وارد کنید..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !selectedRecipient || !messageText.trim()}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              ارسال واتس‌اپ
            </Button>
            <Button
              variant="outline"
              onClick={handleLogActivity}
              disabled={isLoading || !selectedRecipient || !messageText.trim()}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              ثبت فعالیت
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            پیش‌نمایش پیام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedRecipient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                گیرنده: {selectedRecipient.firstName}{" "}
                {selectedRecipient.lastName} - {selectedRecipient.phone}
                <Badge
                  variant={
                    selectedRecipient.type === "customer"
                      ? "default"
                      : "secondary"
                  }
                  className="mr-2"
                >
                  {selectedRecipient.type === "customer" ? "مشتری" : "لید"}
                </Badge>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">متن نهایی</label>
            <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px] whitespace-pre-wrap font-mono text-sm">
              {previewMessage || "پیش‌نمایشی موجود نیست"}
            </div>
          </div>

          {selectedRecipient && messageText && (
            <div className="text-sm text-gray-600">
              <p>متغیرهای جایگزین شده:</p>
              <ul className="list-disc list-inside mt-1">
                <li>firstName: {selectedRecipient.firstName}</li>
                <li>lastName: {selectedRecipient.lastName}</li>
                <li>phone: {selectedRecipient.phone}</li>
                {/* Add more fields as needed */}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
