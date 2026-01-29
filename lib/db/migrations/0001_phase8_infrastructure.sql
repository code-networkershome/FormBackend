CREATE TYPE "public"."webhook_status" AS ENUM('active', 'disabled');--> statement-breakpoint
ALTER TYPE "public"."form_status" ADD VALUE 'revoked';--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key_hash" text NOT NULL,
	"name" text NOT NULL,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"status" "webhook_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
DROP TABLE "gdpr_requests" CASCADE;--> statement-breakpoint
DROP TABLE "labels" CASCADE;--> statement-breakpoint
DROP TABLE "permissions" CASCADE;--> statement-breakpoint
DROP TABLE "submission_labels" CASCADE;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."gdpr_status";--> statement-breakpoint
DROP TYPE "public"."gdpr_type";--> statement-breakpoint
DROP TYPE "public"."role";