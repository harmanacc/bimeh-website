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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, MessageSquare, Eye, ExternalLink, X, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  sendWhatsAppMessage,
  logActivity,
  getMessagePreview,
  changeUserGroupAction,
} from "@/app/admin/outreach/actions";
import { replaceTemplateVariables } from "@/lib/template-utils";
import { toast } from "sonner";
import {
  useMessagingStore,
  type MessagingRecipient,
} from "@/lib/stores/messaging-store";
import type {
  MessageTemplate,
  Customer,
  Lead,
  CustomerStatus,
  LeadStatus,
  MessageChannel,
} from "@/db/schema";
import type {
  CustomerRecipient,
  LeadRecipient,
} from "@/app/admin/outreach/actions";

type Recipient = CustomerRecipient | LeadRecipient;

interface MessagesPanelProps {
  templates: MessageTemplate[];
  recipients: Recipient[];
}

export function MessagesPanel({ templates, recipients }: MessagesPanelProps) {
  const {
    selectedGroup,
    removeFromGroup,
    groups,
    selectedGroupId,
    loadGroups,
    selectGroup,
    getSelectedGroupMembers,
    clearGroup,
    addToGroup,
  } = useMessagingStore();
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<
    MessagingRecipient[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [messageText, setMessageText] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [changeGroupDialogOpen, setChangeGroupDialogOpen] = useState(false);
  const [userToChangeGroup, setUserToChangeGroup] =
    useState<MessagingRecipient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Show all templates - users can select any template regardless of recipient
  const availableTemplates = templates;

  // Filter recipients based on search term
  const filteredRecipients = recipients.filter((recipient) => {
    const term = searchTerm.toLowerCase();
    return (
      recipient.firstName?.toLowerCase().includes(term) ||
      false ||
      recipient.lastName?.toLowerCase().includes(term) ||
      false ||
      recipient.phone.includes(term)
    );
  });

  // Load groups on component mount
  useEffect(() => {
    const loadGroupsData = async () => {
      try {
        const response = await fetch("/api/admin/outreach/groups?limit=100");
        if (response.ok) {
          const data = await response.json();
          loadGroups(data.groups);
        }
      } catch (error) {
        console.error("Error loading groups:", error);
      }
    };
    loadGroupsData();
  }, [loadGroups]);

  // Load group members when selectedGroupId changes
  useEffect(() => {
    const loadGroupMembers = async () => {
      if (selectedGroupId) {
        try {
          const members = await getSelectedGroupMembers();
          // Clear temporary group and set persistent group members
          clearGroup();
          members.forEach((member) => addToGroup(member));
        } catch (error) {
          console.error("Error loading group members:", error);
        }
      } else {
        // Clear group when no group selected
        clearGroup();
      }
    };
    loadGroupMembers();
  }, [selectedGroupId, getSelectedGroupMembers, clearGroup, addToGroup]);

  // Load selected group members when group changes
  useEffect(() => {
    const loadSelectedGroupMembers = async () => {
      if (selectedGroupId) {
        try {
          const members = await getSelectedGroupMembers();
          setSelectedGroupMembers(members);
        } catch (error) {
          console.error("Error loading group members:", error);
          setSelectedGroupMembers([]);
        }
      } else {
        setSelectedGroupMembers([]);
      }
    };
    loadSelectedGroupMembers();
  }, [selectedGroupId, getSelectedGroupMembers]);

  const handleSelectFromGroup = (groupRecipient: MessagingRecipient) => {
    // Find the full recipient data from the recipients prop
    const fullRecipient = recipients.find((r) => r.id === groupRecipient.id);
    if (fullRecipient) {
      setSelectedRecipient(fullRecipient);
    }
  };

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

  const handleSendMessage = async (removeAfterSend = false) => {
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

        // Remove from group if requested
        if (removeAfterSend) {
          removeFromGroup(selectedRecipient.id);
          setSelectedRecipient(null);
        }
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
    <div className="space-y-6">
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
              <label className="block text-sm font-medium mb-2">
                قالب پیام
              </label>
              <Select
                value={selectedTemplate?.id.toString() || ""}
                onValueChange={(value) => {
                  const template = availableTemplates.find(
                    (t) => t.id.toString() === value
                  );
                  setSelectedTemplate(template || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب قالب..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name} ({template.channel}){" "}
                      {template.productId ? "(محصول خاص)" : "(عمومی)"}
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

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                انتخاب گروه
              </label>
              <Select
                value={selectedGroupId?.toString() || "none"}
                onValueChange={(value) =>
                  selectGroup(value === "none" ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب گروه..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون گروه</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">گیرنده</label>
              <Input
                type="text"
                placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره تلفن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
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
                  {filteredRecipients.map((recipient) => (
                    <SelectItem
                      key={`${recipient.type}-${recipient.id}`}
                      value={recipient.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {recipient.fullName ||
                            `${recipient.firstName} ${recipient.lastName}`}
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

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleSendMessage(false)}
                disabled={
                  isLoading || !selectedRecipient || !messageText.trim()
                }
                className="flex-1 min-w-[120px]"
              >
                <Send className="h-4 w-4 mr-2" />
                ارسال واتس‌اپ
              </Button>
              {selectedGroup.some((r) => r.id === selectedRecipient?.id) && (
                <Button
                  onClick={() => handleSendMessage(true)}
                  disabled={
                    isLoading || !selectedRecipient || !messageText.trim()
                  }
                  variant="secondary"
                  className="flex-1 min-w-[120px]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  ارسال و حذف از گروه
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogActivity}
                disabled={
                  isLoading || !selectedRecipient || !messageText.trim()
                }
                className="flex-1 min-w-[120px]"
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
                  گیرنده:{" "}
                  {selectedRecipient.fullName ||
                    `${selectedRecipient.firstName} ${selectedRecipient.lastName}`}{" "}
                  - {selectedRecipient.phone}
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
              <label className="block text-sm font-medium mb-2">
                متن نهایی
              </label>
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
      {/* Selected Group Table */}
      {selectedGroupMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              گروه انتخاب شده ({selectedGroupMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام و نام خانوادگی</TableHead>
                  <TableHead>شماره تلفن</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedGroupMembers.map((recipient) => (
                  <TableRow
                    key={recipient.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectFromGroup(recipient)}
                  >
                    <TableCell>
                      {recipient.fullName ||
                        `${recipient.firstName} ${recipient.lastName}`}
                    </TableCell>
                    <TableCell>{recipient.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          recipient.type === "customer"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {recipient.type === "customer" ? "مشتری" : "لید"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromGroup(recipient.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="حذف از گروه"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToChangeGroup(recipient);
                            setChangeGroupDialogOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="تغییر گروه"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Change Group Dialog */}
      <Dialog
        open={changeGroupDialogOpen}
        onOpenChange={setChangeGroupDialogOpen}
      >
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تغییر گروه برای{" "}
              {userToChangeGroup?.fullName ||
                `${userToChangeGroup?.firstName} ${userToChangeGroup?.lastName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                انتخاب گروه جدید
              </label>
              <Select
                value=""
                onValueChange={(value) => {
                  // TODO: Implement group change logic
                  toast.info("تغییر گروه - در حال پیاده‌سازی");
                  setChangeGroupDialogOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب گروه..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeGroupDialogOpen(false)}
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
