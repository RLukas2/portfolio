import type { Auth, Session } from './index';

export function getSessionFromRequest(auth: Auth, request: Request): Promise<Session | null> {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function tryGetSessionFromRequest(auth: Auth, request: Request): Promise<Session | null> {
  try {
    return await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    return null;
  }
}

export function requireAuth(auth: Auth, redirectTo = '/login') {
  return async (request: Request) => {
    const session = await getSessionFromRequest(auth, request);

    if (!session) {
      return Response.redirect(new URL(redirectTo, request.url));
    }

    return null;
  };
}

export function requireRole(auth: Auth, requiredRole: string) {
  return async (request: Request) => {
    const session = await getSessionFromRequest(auth, request);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (session.user.role !== requiredRole) {
      return new Response('Forbidden', { status: 403 });
    }

    return null;
  };
}

export const requireAdmin = (auth: Auth) => requireRole(auth, 'admin');
