ALTER TABLE "leads" RENAME COLUMN "insurance_type" TO "product_id";--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "product_id" SET DATA TYPE integer USING NULL;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_slug_unique";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "keywords" text;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "slug";