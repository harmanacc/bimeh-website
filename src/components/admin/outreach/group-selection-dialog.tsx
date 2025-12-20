"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addUsersToGroupAction } from "@/app/admin/outreach/actions";

interface Group {
  id: number;
  name: string;
  description?: string;
}

interface GroupSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: number[];
  userType: "lead" | "customer";
  onSuccess?: () => void;
}

export default function GroupSelectionDialog({
  isOpen,
  onClose,
  userIds,
  userType,
  onSuccess,
}: GroupSelectionDialogProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingGroups, setFetchingGroups] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    setFetchingGroups(true);
    try {
      const response = await fetch("/api/admin/outreach/groups?limit=100");
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      } else {
        toast.error("خطا در بارگذاری گروه‌ها");
      }
    } catch (error) {
      toast.error("خطا در بارگذاری گروه‌ها");
      console.error(error);
    } finally {
      setFetchingGroups(false);
    }
  };

  const handleAddToGroup = async () => {
    if (!selectedGroupId) {
      toast.error("لطفا یک گروه انتخاب کنید");
      return;
    }

    const groupId = parseInt(selectedGroupId);
    if (isNaN(groupId)) {
      toast.error("گروه انتخاب شده نامعتبر است");
      return;
    }

    setLoading(true);
    try {
      const result = await addUsersToGroupAction(
        groupId,
        userIds,
        userType,
        "admin" // TODO: Get actual admin ID
      );

      if (result.success) {
        toast.success(
          `${userIds.length} ${
            userType === "lead" ? "لید" : "مشتری"
          } به گروه اضافه شد`
        );
        setSelectedGroupId("");
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "خطا در اضافه کردن به گروه");
      }
    } catch (error) {
      toast.error("خطا در اضافه کردن به گروه");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGroupId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            افزودن {userIds.length} {userType === "lead" ? "لید" : "مشتری"} به
            گروه
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              انتخاب گروه
            </label>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              disabled={fetchingGroups}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    fetchingGroups ? "در حال بارگذاری..." : "انتخاب گروه"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                    {group.description && ` - ${group.description}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {groups.length === 0 && !fetchingGroups && (
            <p className="text-sm text-muted-foreground">
              هیچ گروهی یافت نشد. ابتدا یک گروه ایجاد کنید.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            انصراف
          </Button>
          <Button
            onClick={handleAddToGroup}
            disabled={loading || !selectedGroupId || groups.length === 0}
          >
            {loading ? "در حال اضافه کردن..." : "افزودن به گروه"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
