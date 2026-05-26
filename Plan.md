# create-t3-app-vg — Enhancement & Hardening Plan

## Goal

Running `npm create t3-app-vg@latest` produces a Next.js app that is:

- **Themed** — shadcn/ui components with a CSS-variable design system, no inline styles
- **Auth-first** — email/password login by default (no OAuth provider required)
- **Production-secure** — security headers, rate limiting, hardened session/cookie config, input validation
- **Opinionated but flexible** — sensible defaults, overridable via CLI flags

---

## Phase Overview

| Phase | Name | Focus |
|-------|------|-------|
| 1 | Foundation & Theming | globals.css, shadcn/ui installer, tweakcn theme picker, boilerplate cleanup |
| 2 | Auth Overhaul | Email/password for NextAuth & BetterAuth, Prisma schema, env cleanup |
| 3 | Security Hardening | Security headers, rate limiting, session hardening, input validation, DB hardening |
| 4 | Polish & Publish | CLI DX, --shadcn flag, testing, publish to npm |

---

---

# Phase 1 — Foundation & Theming

## 1.1 — Redesign `globals.css` with Full CSS Variable Theme

**File:** `cli/template/extras/src/styles/globals.css`

Replace the minimal `@theme` block with a full shadcn/ui-compatible CSS variable theme (light + dark):

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "Courier New", monospace;
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

The above is the **default/zinc** theme (applied when no tweakcn theme is selected). Theme selection in 1.2 will override the CSS variable block.

---

## 1.2 — tweakcn Theme Picker in CLI

### Theme Options

The CLI will prompt: **"Which UI theme would you like?"**

Present 6 popular options first, plus a "Show more" option that expands the full list. The "Show more" selection re-prompts with all themes.

#### Top 6 (shown by default)

| # | Display Name | tweakcn slug | Description |
|---|-------------|-------------|-------------|
| 1 | Default Zinc | `default-zinc` | Clean neutral zinc palette (shadcn default) |
| 2 | Catppuccin | `catppuccin` | Soothing, pastel dark-friendly palette |
| 3 | Claude | `claude` | Warm, professional — Anthropic Claude's palette |
| 4 | Vercel | `vercel` | Sharp, high-contrast — Vercel's brand aesthetic |
| 5 | Cyberpunk | `cyberpunk` | Vivid neon accents, high contrast |
| 6 | Default Rose | `default-rose` | Warm rose/pink primary accent |

**7th option:** `↓ Show all themes (45+)` — re-prompts with complete list

#### Full Theme List (shown on "Show more")

```
Default variants:       Preset named themes:
  default-blue            catppuccin
  default-gray            claude
  default-green           vercel
  default-neutral         cyberpunk
  default-orange          twitter
  default-red             basecamp
  default-rose            galactic-glitch
  default-slate           brutalist-concrete
  default-stone           google-modern
  default-violet          glassmorphism
  default-yellow          openai-tts
  default-zinc
```

### Implementation

**New file:** `cli/src/helpers/themeSelector.ts`

```ts
// Fetches theme CSS vars from tweakcn registry
// URL pattern: https://tweakcn.com/r/themes/[slug].json
// Returns { light: Record<string, string>, dark: Record<string, string> }
async function fetchTweakcnTheme(slug: string): Promise<ThemeVars>
```

**Logic:**
1. User selects a theme slug in CLI prompt
2. `fetchTweakcnTheme(slug)` hits `https://tweakcn.com/r/themes/{slug}.json`
3. Returned CSS variable values are injected into the `:root` and `.dark` blocks of `globals.css`
4. Falls back to the built-in `default-zinc` values if the network request fails

**CLI flag:** `--theme <slug>` — skip the prompt, use this theme directly

**New file:** `cli/src/consts/themes.ts` — hardcoded list of all known slugs + display names for the prompt

---

## 1.3 — Add shadcn/ui Installer

**New file:** `cli/src/installers/shadcn.ts`

Responsibilities:
- Add these dependencies to the generated project's `package.json`:
  - `class-variance-authority`, `clsx`, `tailwind-merge`
  - `lucide-react`
  - `@radix-ui/react-*` (all primitives used by shadcn components)
- Copy all component source files from `cli/template/extras/src/components/ui/` → `src/components/ui/`
- Copy `cli/template/extras/src/lib/utils.ts` → `src/lib/utils.ts`
- Copy `cli/template/extras/components.json` → project root

**New file:** `cli/template/extras/src/lib/utils.ts`

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**New file:** `cli/template/extras/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  }
}
```

**All 46 shadcn/ui components** to pre-populate under `cli/template/extras/src/components/ui/`:

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip

**Register** in `cli/src/installers/index.ts` — add `shadcn` to `AvailablePackages`

---

## 1.4 — Rewrite Boilerplate Pages to Use Theme Classes

Remove all inline styles from every page/layout variant and replace with Tailwind classes that resolve through `globals.css` CSS variables.

**Files to update:**

- `cli/template/extras/src/app/page/*.tsx` (all variants)
- `cli/template/extras/src/app/layout/*.tsx` (all variants)
- `cli/template/extras/src/pages/index/*.tsx` (all variants)
- `cli/template/extras/src/pages/_app/*.tsx` (all variants)

**Pattern:**

```tsx
// Before
<main style={{ display: "flex", flexDirection: "column", backgroundColor: "#15162c" }}>

// After
<main className="flex min-h-screen flex-col bg-background text-foreground">
```

Hardcoded hex colors `#2e026d`, `#15162c`, `hsl(280,100%,70%)` etc. → `bg-primary`, `text-muted-foreground`, `text-primary`, etc.

---

## Phase 1 — File Change Summary

### New Files
- `cli/src/helpers/themeSelector.ts`
- `cli/src/consts/themes.ts`
- `cli/src/installers/shadcn.ts`
- `cli/template/extras/src/lib/utils.ts`
- `cli/template/extras/components.json`
- `cli/template/extras/src/components/ui/*.tsx` (46 files)

### Modified Files
- `cli/template/extras/src/styles/globals.css`
- `cli/src/installers/index.ts`
- `cli/src/cli/index.ts` — add theme prompt + `--theme` flag + `--shadcn` flag
- `cli/src/helpers/createProject.ts` — call shadcn installer
- All page/layout template variants (inline style removal)

---

---

# Phase 2 — Auth Overhaul

## 2.1 — NextAuth: Discord → CredentialsProvider

Replace the Discord OAuth provider with email/password `CredentialsProvider` across all NextAuth config variants.

**Files to modify:**

| File | Change |
|------|--------|
| `cli/template/extras/src/server/auth/config/base.ts` | Remove `DiscordProvider`, add `CredentialsProvider` with bcrypt check |
| `cli/template/extras/src/server/auth/config/with-prisma.ts` | Same, query user from Prisma, compare `bcryptjs.compare` |
| `cli/template/extras/src/server/auth/config/with-drizzle.ts` | Same, query user from Drizzle |

**New shape of `base.ts`:**

```ts
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // DB lookup injected in with-prisma.ts / with-drizzle.ts variants
        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.sub },
    }),
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
```

**Add `bcryptjs` to NextAuth installer** (`cli/src/installers/nextAuth.ts`):
- Add `bcryptjs` and `@types/bcryptjs` to generated project dependencies

---

## 2.2 — BetterAuth: GitHub OAuth → emailAndPassword Plugin

**Files to modify:**

| File | Change |
|------|--------|
| `cli/template/extras/src/server/better-auth/config/base.ts` | Remove `github()`, add `emailAndPassword({ enabled: true })` |
| `cli/template/extras/src/server/better-auth/config/with-prisma.ts` | Same + remove hardcoded `localhost` redirectURI |
| `cli/template/extras/src/server/better-auth/config/with-drizzle.ts` | Same |

**New plugin config:**

```ts
import { betterAuth } from "better-auth";
import { emailAndPassword } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  plugins: [emailAndPassword()],
  // database adapter injected in with-prisma / with-drizzle variants
});
```

BetterAuth handles password hashing internally — no bcrypt needed on this path.

---

## 2.3 — Prisma Schema: Add `password` Field to User

**Files to modify:** All `*.prisma` files under `cli/template/extras/prisma/schema/`

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // hashed, nullable for future OAuth additions
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
}
```

---

## 2.4 — Auth Sign-In / Sign-Up Page Templates

Add minimal auth page boilerplate that uses shadcn/ui components and the CSS variable theme:

**New files:**
- `cli/template/extras/src/app/auth/signin/page.tsx` — email/password sign-in form using `<Input>`, `<Button>`, `<Card>`
- `cli/template/extras/src/app/auth/error/page.tsx` — error display page

---

## 2.5 — Environment Variable Cleanup

**`cli/src/installers/nextAuth.ts`:**
- Remove `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`
- Keep `NEXTAUTH_SECRET` (auto-generated 32-byte random)
- Add `NEXTAUTH_URL` with `http://localhost:3000` default

**`cli/src/installers/betterAuth.ts`:**
- Remove `BETTER_AUTH_GITHUB_CLIENT_ID` and `BETTER_AUTH_GITHUB_CLIENT_SECRET`
- Remove hardcoded `localhost:3000` redirectURI from config templates
- Keep `BETTER_AUTH_SECRET` (auto-generated)
- Add `BETTER_AUTH_URL=http://localhost:3000`

**`cli/template/extras/src/env/` — all env schemas:**
- Remove Discord/GitHub OAuth variable declarations
- Add `NEXTAUTH_URL` / `BETTER_AUTH_URL` as optional server-side vars

---

## Phase 2 — File Change Summary

### New Files
- `cli/template/extras/src/app/auth/signin/page.tsx`
- `cli/template/extras/src/app/auth/error/page.tsx`

### Modified Files
- `cli/template/extras/src/server/auth/config/base.ts`
- `cli/template/extras/src/server/auth/config/with-prisma.ts`
- `cli/template/extras/src/server/auth/config/with-drizzle.ts`
- `cli/template/extras/src/server/better-auth/config/base.ts`
- `cli/template/extras/src/server/better-auth/config/with-prisma.ts`
- `cli/template/extras/src/server/better-auth/config/with-drizzle.ts`
- All `*.prisma` schema files (add `password` field)
- `cli/src/installers/nextAuth.ts`
- `cli/src/installers/betterAuth.ts`
- `cli/template/extras/src/env/*.js` (all env schemas)

---

---

# Phase 3 — Security Hardening

## Security Audit Summary

The generated templates use solid library choices (NextAuth, BetterAuth, Prisma, Drizzle, tRPC, Zod) but are **not production-ready** without the following hardening.

| Severity | Issue | Location |
|----------|-------|----------|
| CRITICAL | No security headers (CSP, HSTS, X-Frame-Options, etc.) | `next.config.js` |
| CRITICAL | Hardcoded `localhost` in BetterAuth redirect URIs | `with-prisma.ts`, `with-drizzle.ts` |
| HIGH | `console.log` timing info in all environments | tRPC router middleware |
| HIGH | No rate limiting on auth endpoints or API | No middleware exists |
| MEDIUM | Weak input validation (no max length, no pattern checks) | tRPC routers |
| MEDIUM | NextAuth session not hardened (no maxAge, no secure cookie config) | `auth/config/base.ts` |
| MEDIUM | Database connection missing SSL enforcement, no timeout | `server/db/db-prisma.ts` |
| MEDIUM | Incomplete env variable validation (no min length on secrets) | `src/env/*.js` |

---

## 3.1 — Security Headers in `next.config.js`

**Files to modify:**
- `cli/template/base/next.config.js`
- `cli/template/extras/config/next-config-appdir.js`

Add HTTP security headers that ship with every generated project:

```js
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // loosen for Next.js dev; tighten with nonce in prod
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const config = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
```

**Note:** CSP `unsafe-eval` and `unsafe-inline` for script-src are required for Next.js HMR in development. For production hardening, a nonce-based CSP should be used — add a comment in the generated file guiding the developer on this.

---

## 3.2 — Harden NextAuth Session & Cookie Config

**File:** `cli/template/extras/src/server/auth/config/base.ts`

Add explicit session and cookie hardening:

```ts
session: {
  strategy: "jwt",
  maxAge: 24 * 60 * 60, // 1 day
  updateAge: 60 * 60,   // refresh every hour
},
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
},
```

---

## 3.3 — Gate Console Logging to Development

**Files:** All tRPC router files that include timing middleware:
- `cli/template/extras/src/server/api/trpc-app.ts` (or similar)
- `cli/template/extras/src/pages/api/trpc/[trpc].ts`

```ts
// Before — logs in all environments
console.log(`[TRPC] ${path} took ${end - start}ms`);

// After — development only
if (process.env.NODE_ENV === "development") {
  console.log(`[TRPC] ${path} took ${end - start}ms`);
}
```

---

## 3.4 — Rate Limiting Middleware Template

Add a commented-out but ready-to-use rate limiting setup to every generated project.

**New file in template:** `cli/template/extras/src/lib/ratelimit.ts`

```ts
// Uncomment and configure to enable rate limiting on your API routes.
// Requires: @upstash/ratelimit and @upstash/redis (npm install @upstash/ratelimit @upstash/redis)
// Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
//
// export const authRatelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "60 s"),
//   analytics: true,
//   prefix: "ratelimit:auth",
// });
//
// export const apiRatelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(100, "60 s"),
//   analytics: true,
//   prefix: "ratelimit:api",
// });
```

Add usage example as a comment in the tRPC `protectedProcedure` middleware.

---

## 3.5 — Strengthen Input Validation in tRPC Routers

**Files:** All router template files under `cli/template/extras/src/server/api/routers/`

Add length limits, pattern constraints, and payload size guidance:

```ts
// Before
.input(z.object({ name: z.string().min(1) }))

// After
.input(z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(255, "Name must be under 255 characters")
    .trim(),
}))
```

Also add a `bodyParser` size limit comment in `next.config.js`:
```js
// api: { bodyParser: { sizeLimit: "1mb" } }  // uncomment to restrict API body size
```

---

## 3.6 — Database Connection Hardening

**Files:** `cli/template/extras/src/server/db/db-prisma.ts` (and Drizzle variant)

```ts
const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Remove "query" from dev logs to avoid leaking user data in development logs
  });
```

Add a comment in generated `.env.example`:
```
# For production PostgreSQL, add ?sslmode=require to DATABASE_URL:
# DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## 3.7 — Strengthen env Variable Validation

**Files:** All `cli/template/extras/src/env/*.js` schemas

```js
// Add minimum entropy check to secrets
AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

// Warn about localhost in production
DATABASE_URL: z.string().url().refine(
  (url) => process.env.NODE_ENV !== "production" || !url.includes("localhost"),
  "DATABASE_URL should not point to localhost in production"
),
```

---

## Phase 3 — File Change Summary

### New Files
- `cli/template/extras/src/lib/ratelimit.ts`

### Modified Files
- `cli/template/base/next.config.js`
- `cli/template/extras/config/next-config-appdir.js`
- `cli/template/extras/src/server/auth/config/base.ts` (session/cookie hardening)
- All tRPC router/handler files (gate console.log)
- All tRPC router input schemas (add .max() and .trim())
- `cli/template/extras/src/server/db/db-prisma.ts`
- `cli/template/extras/src/server/db/db-drizzle.ts` (similar hardening)
- All `cli/template/extras/src/env/*.js` (stronger Zod validation)
- Generated `.env.example` (SSL note, localhost warning)

---

---

# Phase 4 — Polish & Publish

## 4.1 — CLI Prompt Additions

**File:** `cli/src/cli/index.ts`

Add two new prompts in the interactive flow:

1. **Theme picker** — "Which UI theme would you like?" (6 options + show more)
   - Flag: `--theme <slug>` (e.g., `--theme catppuccin`)
   - Default: `default-zinc`

2. **shadcn/ui** — "Include all shadcn/ui components?" (yes/no)
   - Flag: `--shadcn` / `--no-shadcn`
   - Default: `true`

**File:** `cli/src/helpers/createProject.ts`
- Wire in `shadcnInstaller` when `packages.shadcn.inUse`
- Wire in `themeSelector` to inject correct theme CSS vars into `globals.css` post-copy

---

## 4.2 — Verify Package Name and Bin

**File:** `cli/package.json`

Verify:
```json
{
  "name": "create-t3-app-vg",
  "bin": {
    "create-t3-app-vg": "./dist/index.js"
  }
}
```

This ensures `npm create t3-app-vg@latest` resolves to `create-t3-app-vg` and runs `./dist/index.js`.

---

## 4.3 — Local Testing Checklist

Before publishing:

- [ ] `pnpm build` — no TypeScript errors
- [ ] `node dist/index.js my-test-app` — interactive prompts work
- [ ] `node dist/index.js my-app --default` — defaults work (zinc theme, shadcn on, email/password auth)
- [ ] `node dist/index.js my-app --theme catppuccin --shadcn` — theme fetch + shadcn install
- [ ] `node dist/index.js my-app --theme catppuccin --no-shadcn` — skip shadcn
- [ ] `node dist/index.js my-app --nextAuth --prisma` — CredentialsProvider + Prisma schema has `password` field
- [ ] `node dist/index.js my-app --betterAuth --drizzle` — emailAndPassword plugin, no OAuth env vars
- [ ] Generated app: `npm run dev` — no runtime errors
- [ ] Generated app: security headers visible in DevTools → Network tab
- [ ] Generated app: no hardcoded localhost in BetterAuth config
- [ ] Generated app: `globals.css` CSS variables render correctly in dark/light mode
- [ ] Generated app: all shadcn components importable from `~/components/ui`
- [ ] Offline fallback: theme fetch fails → falls back to `default-zinc` cleanly

---

## 4.4 — Publish

```bash
pnpm build
npm publish --access public   # or pnpm publish
```

Verify: `npm create t3-app-vg@latest` triggers the CLI from npm.

---

## Phase 4 — File Change Summary

### Modified Files
- `cli/src/cli/index.ts` — new prompts + flags
- `cli/src/helpers/createProject.ts` — wire theme + shadcn
- `cli/package.json` — verify name/bin

---

---

# Full File Inventory

## New Files

| File | Phase |
|------|-------|
| `cli/src/helpers/themeSelector.ts` | 1 |
| `cli/src/consts/themes.ts` | 1 |
| `cli/src/installers/shadcn.ts` | 1 |
| `cli/template/extras/src/lib/utils.ts` | 1 |
| `cli/template/extras/components.json` | 1 |
| `cli/template/extras/src/components/ui/*.tsx` (46 files) | 1 |
| `cli/template/extras/src/app/auth/signin/page.tsx` | 2 |
| `cli/template/extras/src/app/auth/error/page.tsx` | 2 |
| `cli/template/extras/src/lib/ratelimit.ts` | 3 |

## Modified Files

| File | Phase | Change |
|------|-------|--------|
| `cli/template/extras/src/styles/globals.css` | 1 | Full CSS variable theme |
| `cli/src/installers/index.ts` | 1 | Register shadcn |
| `cli/template/extras/src/app/page/*.tsx` | 1 | Remove inline styles |
| `cli/template/extras/src/app/layout/*.tsx` | 1 | Remove inline styles |
| `cli/template/extras/src/pages/index/*.tsx` | 1 | Remove inline styles |
| `cli/template/extras/src/pages/_app/*.tsx` | 1 | Remove inline styles |
| `cli/template/extras/src/server/auth/config/base.ts` | 2 | CredentialsProvider |
| `cli/template/extras/src/server/auth/config/with-prisma.ts` | 2 | CredentialsProvider + DB query |
| `cli/template/extras/src/server/auth/config/with-drizzle.ts` | 2 | CredentialsProvider + DB query |
| `cli/template/extras/src/server/better-auth/config/base.ts` | 2 | emailAndPassword plugin |
| `cli/template/extras/src/server/better-auth/config/with-prisma.ts` | 2 | emailAndPassword, remove localhost |
| `cli/template/extras/src/server/better-auth/config/with-drizzle.ts` | 2 | emailAndPassword, remove localhost |
| All `*.prisma` schema files | 2 | Add `password String?` to User |
| `cli/src/installers/nextAuth.ts` | 2 | Remove Discord, add bcryptjs |
| `cli/src/installers/betterAuth.ts` | 2 | Remove GitHub OAuth env vars |
| `cli/template/extras/src/env/*.js` | 2+3 | Remove OAuth vars, add URL vars, stronger Zod |
| `cli/template/base/next.config.js` | 3 | Security headers |
| `cli/template/extras/config/next-config-appdir.js` | 3 | Security headers |
| All tRPC router/handler files | 3 | Gate console.log, strengthen input validation |
| `cli/template/extras/src/server/db/db-prisma.ts` | 3 | Remove query log |
| `cli/template/extras/src/server/db/db-drizzle.ts` | 3 | Similar hardening |
| `cli/src/cli/index.ts` | 1+4 | Theme prompt, shadcn prompt, flags |
| `cli/src/helpers/createProject.ts` | 1+4 | Wire shadcn + theme |
| `cli/package.json` | 4 | Verify name/bin |
