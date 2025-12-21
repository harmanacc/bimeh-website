"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import CustomerEditForm from "@/components/admin/outreach/customer-edit-form";
import CustomerNotesPanel from "@/components/admin/outreach/customer-notes-panel";
import ActivityHistoryPanel from "@/components/admin/outreach/activity-history-panel";

interface Customer {
  id: number;
  leadId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  insuranceType?: string;
  preferredChannel: string;
  status: string;
  nationalId?: string;
  birthCertificateNumber?: string;
  birthCertificateIssuancePlace?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  telegramId?: string;
  whatsappId?: string;
  eitaId?: string;
  baleId?: string;
  email?: string;
  gender?: string;
  maritalStatus?: string;
  numberOfChildren?: number;
  militaryServiceStatus?: string;
  occupation?: string;
  landlinePhone?: string;
  emergencyPhone?: string;
  emergencyPhoneRelation?: string;
  residentialAddress?: string;
  workAddress?: string;
  residentialPostalCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/outreach/customers/${customerId}`
      );
      if (!response.ok) throw new Error("Failed to fetch customer");
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      toast.error("خطا در بارگذاری مشتری");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchCustomer();
  };

  const getChannelLabel = (channel: string) => {
    const labels: { [key: string]: string } = {
      whatsapp: "واتس‌اپ",
      sms: "پیامک",
      email: "ایمیل",
      telegram: "تلگرام",
      bale: "بله",
      eita: "ایتا",
      instagram: "اینستاگرام",
    };
    return labels[channel] || channel;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      new: "جدید",
      contacted: "تماس گرفته شده",
      target: "هدف",
      active: "فعال",
      deactivated: "غیرفعال",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6" dir="rtl">
        <p>مشتری یافت نشد.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          بازگشت
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          بازگشت
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-muted-foreground">جزئیات مشتری</p>
        </div>
      </div>

      {isEditing ? (
        <CustomerEditForm
          customer={customer}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              ویرایش
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات پایه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">نام</label>
                  <p>{customer.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">نام خانوادگی</label>
                  <p>{customer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">شماره تلفن</label>
                  <p>{customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">ایمیل</label>
                  <p>{customer.email || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">کد ملی</label>
                  <p>{customer.nationalId || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">جنسیت</label>
                  <p>{customer.gender || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">وضعیت تاهل</label>
                  <p>{customer.maritalStatus || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">تعداد فرزندان</label>
                  <p>{customer.numberOfChildren || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اطلاعات بیمه و وضعیت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">نوع بیمه</label>
                  <p>{customer.insuranceType || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">کانال ترجیحی</label>
                  <Badge variant="outline">
                    {getChannelLabel(customer.preferredChannel)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">وضعیت</label>
                  <Badge variant="secondary">
                    {getStatusLabel(customer.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">شغل</label>
                  <p>{customer.occupation || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    وضعیت خدمت سربازی
                  </label>
                  <p>{customer.militaryServiceStatus || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تولد و شناسنامه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">تاریخ تولد</label>
                  <p>
                    {customer.dateOfBirth
                      ? new Date(customer.dateOfBirth).toLocaleDateString(
                          "fa-IR"
                        )
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">محل تولد</label>
                  <p>{customer.placeOfBirth || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">شماره شناسنامه</label>
                  <p>{customer.birthCertificateNumber || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    محل صدور شناسنامه
                  </label>
                  <p>{customer.birthCertificateIssuancePlace || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تماس اضطراری</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">تلفن ثابت</label>
                  <p>{customer.landlinePhone || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">تلفن اضطراری</label>
                  <p>{customer.emergencyPhone || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    نسبت تلفن اضطراری
                  </label>
                  <p>{customer.emergencyPhoneRelation || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>آدرس‌ها</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">آدرس محل سکونت</label>
                  <p>{customer.residentialAddress || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    کد پستی محل سکونت
                  </label>
                  <p>{customer.residentialPostalCode || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">آدرس محل کار</label>
                  <p>{customer.workAddress || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>شناسه‌های اجتماعی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">تلگرام</label>
                  <p>{customer.telegramId || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">واتس‌اپ</label>
                  <p>{customer.whatsappId || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">ایتا</label>
                  <p>{customer.eitaId || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">بله</label>
                  <p>{customer.baleId || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تاریخچه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">تاریخ ایجاد</label>
                  <p>
                    {new Date(customer.createdAt).toLocaleString("fa-IR", {
                      timeZone: "Asia/Tehran",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">تاریخ بروزرسانی</label>
                  <p>
                    {new Date(customer.updatedAt).toLocaleString("fa-IR", {
                      timeZone: "Asia/Tehran",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes and Activity History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerNotesPanel customerId={parseInt(customerId)} />
            <ActivityHistoryPanel customerId={parseInt(customerId)} />
          </div>
        </>
      )}
    </div>
  );
}
