DROP INDEX "article_likes_article_id_visitor_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "comment_reactions_comment_id_user_id_idx" ON "comment_reactions" USING btree ("comment_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "article_likes_article_id_visitor_id_idx" ON "article_likes" USING btree ("article_id","visitor_id");