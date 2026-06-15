ALTER TABLE "audit_logs" ADD COLUMN "request_id" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "session_id" text;--> statement-breakpoint
CREATE INDEX "article_views_article_id_idx" ON "article_views" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_views_created_at_idx" ON "article_views" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_request_id_idx" ON "audit_logs" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "audit_logs_session_id_idx" ON "audit_logs" USING btree ("session_id");