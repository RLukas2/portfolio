ALTER TABLE "project" ADD COLUMN "content_rendering" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "content_rendering_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "content_rendering" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "content_rendering_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "snippet" ADD COLUMN "content_rendering" text;--> statement-breakpoint
ALTER TABLE "snippet" ADD COLUMN "content_rendering_version" integer DEFAULT 1 NOT NULL;