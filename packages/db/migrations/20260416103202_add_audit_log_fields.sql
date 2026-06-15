-- Add requestId and sessionId columns to audit_logs table
ALTER TABLE "audit_logs" ADD COLUMN "request_id" text;
ALTER TABLE "audit_logs" ADD COLUMN "session_id" text;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" ("action");
CREATE INDEX IF NOT EXISTS "audit_logs_request_id_idx" ON "audit_logs" ("request_id");
CREATE INDEX IF NOT EXISTS "audit_logs_session_id_idx" ON "audit_logs" ("session_id");

-- Add comment to the table
COMMENT ON COLUMN "audit_logs"."request_id" IS 'Unique identifier for correlating related operations';
COMMENT ON COLUMN "audit_logs"."session_id" IS 'Session identifier for tracking actions within the same session';
