ALTER TABLE "audit_logs" ALTER COLUMN "actor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "user_agent" text;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_resource_id_idx" ON "audit_logs" USING btree ("resource","resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "article_likes_article_id_idx" ON "article_likes" USING btree ("article_id");--> statement-breakpoint
CREATE UNIQUE INDEX "article_likes_article_visitor_idx" ON "article_likes" USING btree ("article_id","visitor_id");--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_author_id_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_is_draft_idx" ON "articles" USING btree ("is_draft");--> statement-breakpoint
CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "articles_is_draft_created_at_idx" ON "articles" USING btree ("is_draft","created_at");--> statement-breakpoint
CREATE INDEX "comment_reactions_comment_id_idx" ON "comment_reactions" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "comment_reactions_user_id_idx" ON "comment_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comment_reactions_comment_user_idx" ON "comment_reactions" USING btree ("comment_id","user_id");--> statement-breakpoint
CREATE INDEX "comments_article_id_idx" ON "comments" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "comments_user_id_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "comments_article_id_created_at_idx" ON "comments" USING btree ("article_id","created_at");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "experience_type_idx" ON "experience" USING btree ("type");--> statement-breakpoint
CREATE INDEX "experience_is_draft_idx" ON "experience" USING btree ("is_draft");--> statement-breakpoint
CREATE INDEX "experience_start_date_idx" ON "experience" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "experience_type_is_draft_idx" ON "experience" USING btree ("type","is_draft");--> statement-breakpoint
CREATE INDEX "guestbook_user_id_idx" ON "guestbook" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "guestbook_created_at_idx" ON "guestbook" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "project_slug_idx" ON "project" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "project_is_draft_idx" ON "project" USING btree ("is_draft");--> statement-breakpoint
CREATE INDEX "project_is_featured_idx" ON "project" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "project_created_at_idx" ON "project" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "project_is_draft_is_featured_idx" ON "project" USING btree ("is_draft","is_featured");--> statement-breakpoint
CREATE INDEX "service_slug_idx" ON "service" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "service_is_draft_idx" ON "service" USING btree ("is_draft");--> statement-breakpoint
CREATE INDEX "service_created_at_idx" ON "service" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "snippet_slug_idx" ON "snippet" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "snippet_category_idx" ON "snippet" USING btree ("category");--> statement-breakpoint
CREATE INDEX "snippet_is_draft_idx" ON "snippet" USING btree ("is_draft");--> statement-breakpoint
CREATE INDEX "snippet_created_at_idx" ON "snippet" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "snippet_category_is_draft_idx" ON "snippet" USING btree ("category","is_draft");