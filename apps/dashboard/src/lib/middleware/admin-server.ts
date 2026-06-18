import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from './db';
import { sentryMiddleware } from './sentry';

export const adminServerMiddleware = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware] as const;
