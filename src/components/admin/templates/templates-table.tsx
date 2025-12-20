"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Star, ArrowUpDown } from "lucide-react";

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

interface TemplatesTableProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (templateId: number) => void;
  onSetDefault: (templateId: number) => void;
}

type SortField = "name" | "channel" | "product" | "isDefault" | "createdAt";
type SortDirection = "asc" | "desc";

const SortableHeader = ({
  field,
  children,
  onSort,
}: {
  field: SortField;
  children: React.ReactNode;
  onSort: (field: SortField) => void;
}) => (
  <TableHead
    className="text-right cursor-pointer hover:bg-gray-50"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {children}
      <ArrowUpDown className="h-4 w-4" />
    </div>
  </TableHead>
);

export default function TemplatesTable({
  templates,
  onEdit,
  onDelete,
  onSetDefault,
}: TemplatesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const uniqueChannels = useMemo(() => {
    const channels = [...new Set(templates.map((t) => t.channel))];
    return channels;
  }, [templates]);

  const uniqueProducts = useMemo(() => {
    const products = templates
      .filter((t) => t.product)
      .map((t) => t.product!)
      .filter(
        (p, index, arr) => arr.findIndex((p2) => p2.id === p.id) === index
      );
    return products;
  }, [templates]);

  const filteredAndSortedTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.templateText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChannel =
        channelFilter === "all" || template.channel === channelFilter;
      const matchesProduct =
        productFilter === "all" ||
        (productFilter === "global" && !template.productId) ||
        (template.productId &&
          template.product?.id.toString() === productFilter);

      return matchesSearch && matchesChannel && matchesProduct;
    });

    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "channel":
          aValue = a.channel;
          bValue = b.channel;
          break;
        case "product":
          aValue = a.product?.name || "عمومی";
          bValue = b.product?.name || "عمومی";
          break;
        case "isDefault":
          aValue = a.isDefault ? 1 : 0;
          bValue = b.isDefault ? 1 : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    templates,
    searchTerm,
    channelFilter,
    productFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="جستجو در نام و متن قالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="کانال" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه کانال‌ها</SelectItem>
            {uniqueChannels.map((channel) => (
              <SelectItem key={channel} value={channel}>
                {channel === "whatsapp"
                  ? "واتس‌اپ"
                  : channel === "sms"
                  ? "پیامک"
                  : channel === "email"
                  ? "ایمیل"
                  : channel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="محصول" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه محصولات</SelectItem>
            <SelectItem value="global">قالب‌های عمومی</SelectItem>
            {uniqueProducts.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name" onSort={handleSort}>
                نام قالب
              </SortableHeader>
              <SortableHeader field="channel" onSort={handleSort}>
                کانال
              </SortableHeader>
              <SortableHeader field="product" onSort={handleSort}>
                محصول
              </SortableHeader>
              <SortableHeader field="isDefault" onSort={handleSort}>
                وضعیت
              </SortableHeader>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTemplates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  هیچ قالبی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={template.name}>
                      {template.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.channel === "whatsapp"
                        ? "واتس‌اپ"
                        : template.channel === "sms"
                        ? "پیامک"
                        : template.channel === "email"
                        ? "ایمیل"
                        : template.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {template.product ? (
                      <Badge variant="secondary">{template.product.name}</Badge>
                    ) : (
                      <Badge variant="outline">عمومی</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {template.isDefault && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 ml-1" />
                        پیش‌فرض
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEdit(template)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!template.isDefault && (
                        <Button
                          onClick={() => onSetDefault(template.id)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="تنظیم به عنوان پیش‌فرض"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => onDelete(template.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
