# Monorepo Architecture & Refactoring Plan

This document outlines the current state and proposed architectural refactoring for the `@xbrk` monorepo. The goal is to improve clarity, maintainability, reduce coupling, simplify abstractions, and prepare the repository for an open-source release.

This guide is primarily written for maintainers to execute the refactoring but is also structured to help new open-source contributors understand the design philosophy.

## High-Level Dependency Direction

To maintain a healthy monorepo without circular dependencies, the dependency graph should strictly flow from left to right (Apps depend on Features, Features depend on Core):

`Apps (web, dashboard)` → `Features (api, auth, shared, md)` → `Domain (db, config, ui)` → `Core (utils, errors)`

---

## Apps

### `apps/web`
- **Responsibility:** The main public-facing portfolio/website. Handles public routes, blog rendering, and guestbook.
- **Dependency Direction:** Consumes `@xbrk/api`, `@xbrk/auth`, `@xbrk/ui`, `@xbrk/shared`, `@xbrk/md`.
- **Suggested Improvements:** Keep route loaders thin by delegating heavy business logic to `@xbrk/api`. Ensure UI components specific *only* to the web app stay here rather than leaking into `@xbrk/shared`.

### `apps/dashboard`
- **Responsibility:** The admin dashboard for managing content, viewing stats, and configuring the site.
- **Dependency Direction:** Consumes `@xbrk/api`, `@xbrk/auth`, `@xbrk/ui`, `@xbrk/shared`.
- **Suggested Improvements:** Ensure that admin-specific mutations and data-fetching are encapsulated in the `api` package rather than written directly in the route loaders.

---

## Packages

### `@xbrk/ui`
- **Responsibility:** A collection of generic, reusable, "dumb" presentation components (primarily shadcn/ui components).
- **Overlaps:** Sometimes overlaps with `@xbrk/shared` when components gain too much business logic.
- **Dependency Direction:** Should only depend on React, standard DOM utilities, and `@xbrk/errors`. It should *never* depend on app state, `config`, `auth`, or `api`.
- **Suggested Improvements:** Keep this package strictly for generic UI elements (buttons, inputs, dialogs). Ensure all components here are easily copy-pasteable or standard shadcn/ui implementations.

### `@xbrk/shared`
- **Responsibility:** App-specific components and logic that are shared between `web` and `dashboard`. Examples include `theme-provider.tsx`, `router.tsx`, `logo.tsx`, and `signin.tsx`.
- **Overlaps:** Can easily become a dumping ground for anything used in more than one place. Overlaps with `ui`.
- **Suggested Merges/Splits:** Keep `shared` distinct from `ui`. `ui` is for *design system* components; `shared` is for *app-level* cross-cutting concerns (context providers, TanStack setup).
- **Suggested Improvements:** Audit the components. If a component is purely visual (e.g., a specific card layout), consider moving it to `ui`. If it requires `api` or `auth` context, it belongs in `shared`.

### `@xbrk/md`
- **Responsibility:** Handles converting Markdown to HTML AST (HAST) using Unified/Shiki, and rendering it via React components.
- **Overlaps:** Combines heavy Node-based processing logic with client-side React rendering logic.
- **Suggested Merges/Splits:** **Split this package into two parts** (or two well-defined modules inside the package).
  - **Core Processor:** The unified/shiki pipeline (`processor.ts`) which should run strictly on the server/build-step.
  - **React Renderer:** The `Markdown` component and custom `md-components.tsx` that run on the client.
- **Dependency Direction:** Depends on `ui` for rendering and `utils`.
- **Suggested Improvements:** Isolate the server-side processor so client bundles never accidentally import heavy packages like `shiki` or `unified`.

### `@xbrk/api`
- **Responsibility:** Centralized business logic, services, and data access layers. Exposes functions consumed by app route loaders/actions.
- **Overlaps:** Sometimes DB queries leak into the apps directly instead of going through `api`.
- **Dependency Direction:** Consumes `db`, `auth`, `errors`, `md`, `utils`.
- **Suggested Improvements:** Standardize the service pattern. Ensure all external API calls, DB mutations, and heavy logic are wrapped in service functions here. Define standard input/output types (Zod schemas) alongside the services.

### `@xbrk/auth`
- **Responsibility:** Configuration and middleware for `better-auth`.
- **Overlaps:** Contains some validation logic that might overlap with `config`.
- **Dependency Direction:** Consumes `db`.
- **Suggested Improvements:** Keep strictly scoped to authentication and session management. Ensure environment variables required for auth are validated explicitly here.

### `@xbrk/config`
- **Responsibility:** Static site configuration (social links, site metadata, navigation structure).
- **Overlaps:** Constants often get redefined in the apps.
- **Dependency Direction:** Minimal dependencies. Forms the base of the app.
- **Suggested Improvements:** Ensure this package is pure JavaScript/TypeScript constants. Avoid React or heavy libraries.

### `@xbrk/db`
- **Responsibility:** Database schema definition (Drizzle), database client initialization, and migration scripts.
- **Overlaps:** Sometimes types are defined here and duplicated elsewhere.
- **Dependency Direction:** Should be a leaf node (depends on almost nothing internally).
- **Suggested Improvements:** Since the `types` package is being dissolved, ensure that DB-inferred types (e.g., `typeof schema.users.$inferSelect`) are exported directly from here so other packages can consume the domain types.

### `@xbrk/errors`
- **Responsibility:** Centralized error classes (`AppError`, `ValidationError`, `NotFoundError`).
- **Overlaps:** Sometimes apps or the `api` throw generic `Error` instances instead of these.
- **Dependency Direction:** Base leaf node. Depends on nothing.
- **Suggested Improvements:** Ensure standard HTTP status codes are mapped correctly. Enforce usage of these errors across the `api` and `auth` packages so apps can catch and handle them uniformly.

### `@xbrk/utils`
- **Responsibility:** Pure, generic utility functions (date formatting, text stripping, slug generation).
- **Overlaps:** Often overlaps with domain-specific helpers.
- **Dependency Direction:** Base leaf node.
- **Suggested Improvements:** Keep utilities pure. If a utility depends on a domain model (e.g., `formatUserAvatar`), it should live in the `api` or a specific feature folder, not in general `utils`.

### `@xbrk/types` (To Be Dissolved)
- **Responsibility:** Previously a central repository for all TypeScript types.
- **Suggested Merges/Splits:** As planned, dissolve this package.
  - Move DB types to `@xbrk/db`.
  - Move config/site types to `@xbrk/config`.
  - Move generic utility types to `@xbrk/utils`.
- **Suggested Improvements:** Co-locate types with the domain code that defines them. This prevents the `types` package from becoming a bottleneck and reduces circular dependency risks.

---

## Summary of Action Items for Execution

1. **Dissolve `@xbrk/types`:** Move `GitHubUser` types near the API that fetches them, `SiteConfig` types to `@xbrk/config`, and legacy DB types to `@xbrk/db`. Update all imports across the workspace.
2. **Refactor `@xbrk/md`:** Separate the unified/rehype processor logic from the React components. Consider creating `packages/md/src/server.ts` and `packages/md/src/client.ts` or entirely separate packages to enforce strict boundaries and prevent bundling server code to the client.
3. **Audit `@xbrk/shared` vs `@xbrk/ui`:** Move any purely presentational elements from `shared` to `ui`. Ensure `ui` only imports from `react`, `radix-ui`, and `lucide-react`.
4. **Enforce Dependency Graph:** Run a dependency analysis tool (or Biome rules) to prevent `utils` or `db` from importing higher-level packages like `api`.
