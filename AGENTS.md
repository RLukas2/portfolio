# Agent Guidance

This repo is a personal portfolio monorepo. Treat it as a product codebase first and a monorepo second.

## Architecture Posture

- Do not extract a new package just because two files look similar.
- Prefer small, local fixes when duplication is tiny, stable, app-entry-specific, or easier to understand in place.
- Extract shared code only when it represents a real policy, repeated behavior with drift risk, or logic that must stay consistent across apps.
- Before proposing a new package, explain the concrete bug, maintenance cost, or cross-app contract it solves.
- Avoid broad cleanup and architecture churn during targeted audits. Keep changes close to the requested scope.

Good reasons to share code:

- A duplicated behavior already drifted and caused or could cause a bug.
- The same policy must be enforced across apps, such as query cache defaults, CRUD query key shape, middleware composition rules, or router defaults.
- A change would otherwise need to be repeated in several places and forgetting one would be risky.
- The shared abstraction can live in an existing package without creating an awkward dependency direction.

Weak reasons to share code:

- Two app entry files are nearly identical but only a few lines long.
- Two deployable apps use similar Vite, Vitest, server, or router boilerplate.
- A helper would save a small amount of text but make the boot path harder to follow.
- The shared code would need a new package with no clear owner besides "infra".

## App Boundaries

- `apps/web` and `apps/dashboard` are separate deployable apps. It is acceptable for them to keep local app entry files, env schemas, base URL logic, route tree wiring, and deployment-specific configuration.
- App-level auth and server boundaries should remain primarily in the app/server layer. Shared packages may provide primitives, but apps decide how to enforce public, authenticated, and admin-only access.
- Keep feature folders out of infra refactors unless the user explicitly asks for feature-level changes.
- If code would behave differently outside a monorepo, do not assume the monorepo requires abstraction. Local app ownership is often clearer.

## Preferred Dependency Direction

- Apps may depend on packages.
- Packages should not depend on apps.
- Shared packages should provide focused primitives, not app-specific orchestration.
- Prefer existing packages before introducing new ones:
  - `@xbrk/ui` for reusable UI and router UI defaults.
  - `@xbrk/utils` for small pure utilities.
  - `@xbrk/auth` for Better Auth primitives.
  - `@xbrk/api` for domain/data service APIs.
  - `@xbrk/config` for stable shared portfolio configuration.
- Be cautious about creating packages such as `@xbrk/infra`, `@xbrk/vite-config`, `@xbrk/vitest-config`, or `@xbrk/query-keys`. Propose them only after showing the extraction is worth the extra package surface.

## Shared Infra Heuristics

- Router setup: Extract only stable defaults if they start drifting, such as QueryClient defaults, default error/not-found components, or SSR query integration. Keep each app's `router.tsx` local because it owns the generated route tree and app-specific instrumentation.
- Server entry: Keep tiny `server.ts` entry files local unless the server bootstrap grows meaningful policy.
- Env handling: Keep app env schemas local. Shared env packages may expose package requirements, but each app owns which public URLs, deployment vars, and app-specific settings it accepts.
- Auth: Keep auth enforcement explicit in app middleware and server functions. Admin checks should be visible in the dashboard path.
- Middleware: Prefer single-responsibility middleware. For example, `dbMiddleware` should inject DB only; route stacks should explicitly compose Sentry, DB, auth, and admin middleware.
- Query keys: A small shared factory for repeated CRUD key shape is reasonable. Do not merge all app query keys into one global file if web-only and dashboard-only keys have different ownership.
- Sentry: Shared sampling defaults can be useful, but app domains, trace propagation targets, and privacy choices should remain explicit.
- Vite/Vitest: Shared config bases are low priority. Keep app configs local unless repeated config edits become a real maintenance problem.

## Review Style

When asked for an architecture audit, answer the requested lenses directly:

- Explain likely responsibility.
- Identify overlaps.
- Suggest merges or splits.
- Suggest dependency direction.
- Suggest improvements.
- Find bugs or unusual logic.

Lead with behavior and risk. Mention duplication, but do not treat duplication as a bug by itself.

## Validation

- Verify package names from `apps/*/package.json` before running filtered commands.
- The app packages are `@portfolio/web` and `@portfolio/dashboard`.
- Use `pnpm --filter @portfolio/web typecheck` and `pnpm --filter @portfolio/dashboard typecheck` for app infra changes when practical.
- `pnpm check` is the repo-wide Biome gate. Use `pnpm check:fix` to auto-fix.
- `pnpm format:fix` formats all files with Biome.
- `pnpm db:push` / `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` — Drizzle DB operations in `@xbrk/db`.
- `pnpm auth:generate` — generates Better Auth schema in `@xbrk/auth`.
- `pnpm lint:ws` — runs sherif to lint workspace config (runs automatically via `postinstall`).
- `pnpm deps` — checks outdated dependencies via `taze`.
- `pnpm clean:workspaces` — turbo clean pipeline across all packages.
- Tests use Vitest + happy-dom, setup at `src/test/setup.ts` in each app.
- `turbo run test` depends on `^build` (builds upstream first). For fast single-package tests: `pnpm --filter <package> test`.
- CI pipeline order: `pnpm check && pnpm typecheck && pnpm test && pnpm build`.
- If `pnpm test` or `pnpm build` fails with a Corepack `EPERM` under `AppData\Local\node\corepack`, treat it as a likely local environment issue before assuming a repo regression.

## Commit Conventions

- Conventional commits via `@commitlint/config-conventional` (enforced by husky `commit-msg` hook).
- Pre-commit runs `lint-staged` — Biome check on staged `*.{js,jsx,ts,tsx,json,css,scss}` files.

## Environment

- Root `.env` is loaded by app vite configs via `dotenv.config({ path: '../../.env' })` at build/dev time.
- `@xbrk/db` has a `with-env` script shortcut (`dotenv -e ../../.env --`) for ad-hoc env loading.

## Generated Code

- `src/routeTree.gen.ts` is auto-generated by TanStack Router. Do not edit manually. It is excluded from Biome checks and typecheck inputs.

## App Entrypoints

- Both apps follow the same TanStack Start pattern: `start.tsx` (client entry) + `server.ts` (server entry), both in `src/`.
- Both apps use `tsconfig` path alias `@/` → `./src/`.

## Working Tree

- The worktree may contain user changes. Do not revert unrelated files.
- Before recommending merge readiness, call out any unrelated `git status` noise.
- Avoid mass formatting or broad mechanical edits unless they are required for the requested change.
