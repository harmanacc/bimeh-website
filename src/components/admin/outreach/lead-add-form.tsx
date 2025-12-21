"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { phoneNumberSchema } from "@/lib/phone-validation";

const leadSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: phoneNumberSchema,
  productId: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["lead", "contacted", "deactivated"]),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadAddFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  products: { id: number; name: string }[];
}

export default function LeadAddForm({
  onSuccess,
  onCancel,
  products,
}: LeadAddFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      productId: undefined,
      source: "",
      status: "lead",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      // Convert undefined to null for database compatibility
      const submitData = Object.fromEntries(
        Object.entries({
          ...data,
          productId: data.productId ? parseInt(data.productId) : null,
        }).map(([key, value]) => [key, value === undefined ? null : value])
      );

      const response = await fetch("/api/admin/outreach/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create lead");
      }

      toast.success("لید با موفقیت ایجاد شد");
      onSuccess();
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error instanceof Error ? error.message : "خطا در ایجاد لید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>افزودن لید جدید</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام خانوادگی *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تلفن *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>محصول</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب محصول" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>منبع</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وضعیت *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">لید</SelectItem>
                        <SelectItem value="contacted">
                          تماس گرفته شده
                        </SelectItem>
                        <SelectItem value="deactivated">غیرفعال</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
