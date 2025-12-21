import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CustomerNote } from "@/db/schema";

interface CustomerNotesPanelProps {
  customerId: number;
}

export default function CustomerNotesPanel({
  customerId,
}: CustomerNotesPanelProps) {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      console.log("Fetching notes for customerId:", customerId);
      const response = await fetch(
        `/api/admin/outreach/customers/${customerId}/notes`
      );
      console.log("Notes fetch response status:", response.status);
      if (!response.ok)
        throw new Error(
          `Failed to fetch notes: ${response.status} ${response.statusText}`
        );
      const data = await response.json();
      console.log("Fetched notes data:", data);
      setNotes(data);
    } catch (error) {
      toast.error("خطا در بارگذاری یادداشت‌ها");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [customerId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("متن یادداشت نمی‌تواند خالی باشد");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/outreach/customers/${customerId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: newNote }),
        }
      );

      if (!response.ok) throw new Error("Failed to add note");

      const newNoteData = await response.json();
      setNotes([newNoteData, ...notes]);
      setNewNote("");
      toast.success("یادداشت با موفقیت اضافه شد");
    } catch (error) {
      toast.error("خطا در اضافه کردن یادداشت");
      console.error(error);
    }
  };

  const handleEditNote = (note: CustomerNote) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.note);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteText.trim()) {
      toast.error("متن یادداشت نمی‌تواند خالی باشد");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/outreach/customers/${customerId}/notes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteId: editingNoteId,
            note: editingNoteText,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update note");

      const updatedNote = await response.json();
      setNotes(notes.map((n) => (n.id === editingNoteId ? updatedNote : n)));
      setEditingNoteId(null);
      setEditingNoteText("");
      toast.success("یادداشت با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش یادداشت");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(
        `/api/admin/outreach/customers/${customerId}/notes?noteId=${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("یادداشت با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف یادداشت");
      console.error(error);
    }
  };

  const getRelativeTime = (date: string | Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffMs = now.getTime() - noteDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "همین حالا";
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    return `${diffDays} روز پیش`;
  };

  return (
    <Card dir="rtl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>یادداشت‌ها</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setNewNote("")} variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              افزودن یادداشت
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new note */}
        {newNote !== undefined && (
          <div className="space-y-2">
            <Textarea
              placeholder="متن یادداشت را وارد کنید..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                <Plus className="h-4 w-4 ml-2" />
                افزودن
              </Button>
              <Button onClick={() => setNewNote("")} variant="outline">
                <X className="h-4 w-4 ml-2" />
                لغو
              </Button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {loading ? (
          <p>در حال بارگذاری یادداشت‌ها...</p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground">یادداشتی وجود ندارد</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-3 space-y-2">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={!editingNoteText.trim()}
                      >
                        <Save className="h-4 w-4 ml-2" />
                        ذخیره
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline">
                        <X className="h-4 w-4 ml-2" />
                        لغو
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {getRelativeTime(note.createdAt)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap">{note.note}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
