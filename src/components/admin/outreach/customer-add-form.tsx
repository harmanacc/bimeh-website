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

const customerSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: phoneNumberSchema,
  insuranceType: z.string().optional(),
  preferredChannel: z.enum([
    "whatsapp",
    "sms",
    "email",
    "telegram",
    "bale",
    "eita",
    "instagram",
  ]),
  status: z.enum(["new", "contacted", "target", "active", "deactivated"]),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerAddFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerAddForm({
  onSuccess,
  onCancel,
}: CustomerAddFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      insuranceType: "",
      preferredChannel: "whatsapp",
      status: "new",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        insuranceType: data.insuranceType || null,
      };

      const response = await fetch("/api/admin/outreach/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create customer");
      }

      toast.success("مشتری با موفقیت ایجاد شد");
      onSuccess();
    } catch (error) {
      toast.error((error as Error).message || "خطا در ایجاد مشتری");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>افزودن مشتری جدید</CardTitle>
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
                name="insuranceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع بیمه</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کانال ترجیحی *</FormLabel>
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
                        <SelectItem value="whatsapp">واتس‌اپ</SelectItem>
                        <SelectItem value="sms">پیامک</SelectItem>
                        <SelectItem value="email">ایمیل</SelectItem>
                        <SelectItem value="telegram">تلگرام</SelectItem>
                        <SelectItem value="bale">بله</SelectItem>
                        <SelectItem value="eita">ایتا</SelectItem>
                        <SelectItem value="instagram">اینستاگرام</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="new">جدید</SelectItem>
                        <SelectItem value="contacted">
                          تماس گرفته شده
                        </SelectItem>
                        <SelectItem value="target">هدف</SelectItem>
                        <SelectItem value="active">فعال</SelectItem>
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
