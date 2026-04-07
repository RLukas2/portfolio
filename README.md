# Portfolio Monorepo 🚀

Welcome to the open-source repository for the personal portfolio and digital playground. This project operates within a modern **Monorepo** architecture with pnpm workspaces, Tanstack Start, React 19, and TypeScript.

## ✨ Features

- **Dual Applications:** Isolated public web portfolio (`apps/web`) and a secure administrative dashboard (`apps/dashboard`) managed within a single Turborepo workspace.
- **Authentication Layer:** Secured via Better Auth, supporting seamless login sessions and role-based access.
- **Server Functions:** Utilizing TanStack Start's `server$` paradigm to securely handle sensitive backend operations without distinct API servers.
- **Custom Markdown Pipeline:** Dynamic rich-text and `.md` mapping implemented on top of `remark` and `rehype` for blog-like content delivery.
- **Serverless PostgreSQL Database:** Connected to a lightweight Neon database and managed entirely via Drizzle ORM schemas and migrations.
- **Error Tracking:** Deep Sentry integration to log and capture runtime exceptions across both the browser and the server.
- **Thematic Interface:** Component-based UI leveraging Tailwind CSS v4 alongside accessible Radix primitives (via shadcn/ui), supporting Dark/Light variations dynamically.

## 🛠 Tech Stack

Our foundation leans on leading state-of-the-art tooling:

- **Framework & Routing**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management & Fetching**: [TanStack Query](https://tanstack.com/query) & TanStack Store
- **Database Layer**: [Drizzle ORM](https://orm.drizzle.team/) interacting with Neon Database (Serverless)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Monorepo Tooling**: [Turborepo](https://turbo.build/) & [pnpm](https://pnpm.io/) workspaces
- **Optimization**: React Compiler
- **Code Quality**: [Biome](https://biomejs.dev/)

## 📂 Monorepo Structures

The repository heavily modularizes codes into robust standalone workspaces to ensure modularity and maximum code reuse:

```text
my-app/
├── apps/
│   ├── dashboard/   # The admin dashboard application built to manage content and infrastructure
│   └── web/         # The main public-facing portfolio website prioritizing SEO, performance, and UX
├── packages/
│   ├── api/         # Global API endpoints, services, and trpc bindings
│   ├── auth/        # Integrated authentication configured via Better Auth
│   ├── config/      # Shared environment validations, constants, and meta configs
│   ├── db/          # Database definitions, schemas, and migrations via Drizzle ORM
│   ├── md/          # Custom markdown processor utilizing remark and rehype pipelines
│   ├── shared/      # Shared business logic acting over multiple environments
│   ├── types/       # Strictly typed global TypeScript definitions
│   ├── ui/          # Radix UI and shadcn/ui based reusable React components
│   └── utils/       # Miscellaneous headless helper functions 
├── tooling/
│   ├── tailwind/    # Global Tailwind CSS configurations decoupled for universal usage
│   └── typescript/  # Base tsconfig logic for unified type-checking constraints
└── package.json     # Root package.json orchestrating Turbine and pnpm tasks
```

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `>= 22.0.0`
- **pnpm**: `>= 10.0.0`

### 2. Installation

Clone the repository and install all workspace dependencies comprehensively using pnpm:
```bash
git clone https://github.com/N0BODY-Tuan/portfolio.git
cd portfolio
pnpm install
```

### 3. Environment Variables

Create necessary environment configurations in the root directory. You can bootstrap your secrets from the provided base.
```bash
cp .env.example .env
```
*(Review and populate the `.env` file with appropriate Neon Database connection URLs and required API Keys)*

### 4. Database Setup

Push the Drizzle schema directly to your configured Neon Database to sync the structure:
```bash
pnpm db:push
```

### 5. Development Server

Spin up the entire development workflow locally. This builds and watches all packages alongside web and dashboard servers:
```bash
pnpm dev
```

## 📜 Scripts

You can execute the following global commands from the root directory leveraging `turbo` and `pnpm`:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Spins up local development environments across `apps/*` with Hot Module Replacement. |
| `pnpm build` | Initiates the comprehensive production build phase across all apps and internal dependencies. |
| `pnpm check` | Checks formatting and code conventions utilizing Biome. |
| `pnpm lint` | Runs Biome linting specifically across workspaces. |
| `pnpm format` | Runs Biome code formatter specifically across workspaces. |
| `pnpm check:fix` | Automatically formats and applies lint fixes throughout the entire codebase. |
| `pnpm typecheck` | Perform heavy standalone TypeScript analysis cross-platform. |
| `pnpm clean` | Rapid deep cleanup of `node_modules` via git clean. |
| `pnpm clean:workspaces` | Triggers turbo clean pipeline to clear out transient artifacts across apps and packages. |
| `pnpm deps` | Scans for outdated dependencies utilizing `taze` (`latest -Iwr`). |
| `pnpm db:push` | Pushes locally altered Drizzle schema directly onto the connected Postgres environment. |
| `pnpm db:generate` | Generates a new migration file based on local Drizzle schema changes. |
| `pnpm db:migrate` | Runs existing Drizzle database migrations. |
| `pnpm db:studio` | Launches Drizzle Studio interface to explore db records. |
| `pnpm ui-add` | Shortcut trigger for adding specific UI elements from packages to `@xbrk/ui`. |

## ⚠️ Issue Watchlist

Being on the bleeding edge of the ecosystem comes with some friction. We're actively tracking the progress of these ongoing upstream limitations and betas:

- **React Compiler**: [React Compiler Docs](https://react.dev/learn/react-compiler) & [Working Group Discussions](https://github.com/reactwg/react-compiler/discussions). *React Compiler is still in beta and might present unexpected optimization conflicts.*
- **TanStack Start Beta**: [TanStack/router#2863](https://github.com/TanStack/router/discussions/2863). *TanStack Start is currently in beta and may still undergo major breaking changes and architecture shifts.*
- **Tailwind v4 in shadcn/ui**: [shadcn-ui/ui#6714](https://github.com/shadcn-ui/ui/discussions/6714). *We're using the canary version of shadcn/ui for Tailwind v4 support and monitoring for absolute stability.*

## 📄 License

This project is open-sourced under the **[MIT](LICENSE)** license. 

Created by [Tuan Ngo-Hoang](mailto:nhtuan314@gmail.com). Let's build something awesome together!