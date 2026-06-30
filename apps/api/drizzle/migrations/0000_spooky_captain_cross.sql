CREATE TYPE "public"."delivery_method_enum" AS ENUM('ekont-office', 'ekont-delivery', 'speedy-delivery', 'speedy-office');--> statement-breakpoint
CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'confirmed', 'shipped', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method_enum" AS ENUM('bank', 'cash', 'stripe');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"name" varchar NOT NULL,
	"variant_name" varchar,
	"quantity" integer NOT NULL,
	"unit_price" numeric NOT NULL,
	"subtotal" numeric NOT NULL,
	"weight" numeric NOT NULL,
	"personalization" jsonb
);
--> statement-breakpoint
CREATE TABLE "order_shipping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"country" varchar NOT NULL,
	"city" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"street" varchar,
	"street_number" varchar,
	"block_no" varchar,
	"entrance_no" varchar,
	"floor_no" varchar,
	"apartment_no" varchar,
	"office_code" varchar,
	"additional_info" text,
	CONSTRAINT "order_shipping_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "order_status_enum" NOT NULL,
	"total_amount" numeric NOT NULL,
	"subtotal" numeric NOT NULL,
	"delivery_cost" numeric NOT NULL,
	"delivery_method" "delivery_method_enum" NOT NULL,
	"payment_method" "payment_method_enum" NOT NULL,
	"shipment_number" varchar,
	"stripe_payment_intent_id" varchar,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_sku" varchar NOT NULL,
	"parent_id" uuid NOT NULL,
	"variant_name" varchar NOT NULL,
	"price" numeric NOT NULL,
	"current_stock" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "product_variants_variant_sku_unique" UNIQUE("variant_sku")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar NOT NULL,
	"name" varchar NOT NULL,
	"price" numeric NOT NULL,
	"discount" numeric,
	"weight" numeric,
	"width" numeric,
	"height" numeric,
	"length" numeric,
	"depth" numeric,
	"current_stock" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_payment_intent" varchar NOT NULL,
	"order_number" varchar,
	"order_id" uuid,
	"event_type" varchar NOT NULL,
	"status" varchar NOT NULL,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_shipping" ADD CONSTRAINT "order_shipping_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;