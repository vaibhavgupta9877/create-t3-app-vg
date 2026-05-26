# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Turborepo monorepo** for `create-t3-app` — an interactive CLI that scaffolds full-stack typesafe Next.js apps. Two workspaces:
- `cli/` — the npm-published CLI tool (`create-t3-app`)
- `www/` — the documentation site (Astro)

## Commands

```bash
# Install dependencies (run from root)
pnpm install

# Development
pnpm dev:cli        # Build CLI in watch mode
pnpm dev:www        # Start docs dev server with HMR

# Build
pnpm build:cli      # Build CLI only
pnpm build:www      # Build docs only
pnpm build          # Build both

# Validation (run before committing)
pnpm check          # Runs lint + typecheck + format:check
pnpm lint           # Lint only
pnpm lint:fix       # Lint and auto-fix
pnpm format         # Format all files

# Run the built CLI manually
cd cli && pnpm start
# Or after build:
node cli/dist/index.js
```

## CLI Architecture

The CLI entry point is `cli/src/index.ts`. The flow is:

1. **`cli/src/cli/index.ts`** — Parses CLI args (via `commander`) and runs interactive prompts (via `@clack/prompts`). Returns a `CliResults` object with selected packages and flags.

2. **`cli/src/helpers/createProject.ts`** — Orchestrates project creation:
   - Calls `scaffoldProject` to copy the base template
   - Calls `installPackages` to run each selected package's installer
   - Selects the correct boilerplate files based on the package combination (e.g., `with-auth-trpc-tw.tsx`)

3. **`cli/src/installers/`** — Each package has its own installer (e.g., `prisma.ts`, `trpc.ts`, `nextAuth.ts`). Installers copy files from `cli/template/extras/` and add dependencies via `addPackageDependency`.

4. **`cli/template/`** — Contains the scaffolded output files:
   - `base/` — The minimal Next.js app that all projects start from
   - `extras/` — Variant files for each package combination. Files are named with suffixes like `with-auth-trpc-tw.tsx` indicating which packages they apply to. The correct variant is selected at scaffold time by `selectBoilerplate.ts`.

## Key Design Pattern: Template Variants

The template system uses **filename-based selection** rather than code generation. For example, page files exist in multiple variants:
- `src/app/page/base.tsx`
- `src/app/page/with-trpc-tw.tsx`
- `src/app/page/with-auth-trpc-tw.tsx`
- etc.

`selectBoilerplate.ts` picks the right file based on `packages.inUse` flags and copies it to the output project. When adding new package combinations, you must add the appropriate variant files.

## Mutual Exclusions

- `prisma` and `drizzle` are mutually exclusive (can't use both ORMs)
- `eslint` and `biome` are mutually exclusive (can't use both linters)
- `nextAuth` and `betterAuth` are mutually exclusive

## Changesets

User-facing changes require a changeset entry:
```bash
pnpm changeset
git add .changeset/*.md && git commit -m "chore: add changeset"
```

## Commit Convention

Follow [conventional commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, etc.
