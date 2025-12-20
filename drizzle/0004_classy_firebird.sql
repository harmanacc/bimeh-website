CREATE TYPE "public"."customer_status" AS ENUM('contacted', 'target', 'active');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('lead', 'contacted');--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "status" "customer_status" DEFAULT 'contacted';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "national_id" varchar(10);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "birth_certificate_number" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "birth_certificate_issuance_place" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "place_of_birth" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "telegram_id" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "whatsapp_id" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "eita_id" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "bale_id" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "gender" varchar(10);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "marital_status" varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "number_of_children" integer;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "military_service_status" varchar(50);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "occupation" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "landline_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "emergency_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "emergency_phone_relation" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "residential_address" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "work_address" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "residential_postal_code" varchar(10);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "status" "lead_status" DEFAULT 'lead';