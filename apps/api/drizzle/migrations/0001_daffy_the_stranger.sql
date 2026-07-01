ALTER TYPE "public"."order_status_enum" ADD VALUE 'delivered' BEFORE 'refunded';--> statement-breakpoint
ALTER TABLE "webhook_events" ALTER COLUMN "stripe_payment_intent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "stripe_event_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "processed_at" timestamp;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "payload" jsonb;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_stripe_event_id_unique" UNIQUE("stripe_event_id");