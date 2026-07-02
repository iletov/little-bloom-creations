ALTER TYPE "public"."order_status_enum" ADD VALUE IF NOT EXISTS 'failed' BEFORE 'shipped';--> statement-breakpoint
ALTER TABLE "webhook_events" ALTER COLUMN "stripe_event_id" DROP NOT NULL;