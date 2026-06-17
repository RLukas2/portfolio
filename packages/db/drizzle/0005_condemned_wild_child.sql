-- Backfill any null updated_at values before making the column not null
UPDATE "articles" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "experience" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "project" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "service" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "snippet" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "experience" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "snippet" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "snippet" ALTER COLUMN "updated_at" SET NOT NULL;