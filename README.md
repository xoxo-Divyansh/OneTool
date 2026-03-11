# OneTool

OneTool is a Next.js App Router workspace for authenticated utility tools.
It combines a single auth session, shared dashboard, and categorized tools (Developer, General, Student) under one product surface.

## 1. Product Scope

### Current goals
- Centralize daily utility workflows inside one authenticated app.
- Provide reusable architecture for adding tools without rewriting navigation/auth/layout.
- Keep client/server boundaries explicit for maintainability and production scaling.

### Current implemented tools
- JSON Formatter (`/tools/developer/json-formatter`)
- API Tester with persisted history and quota checks (`/tools/developer/api-tester`)
- Image Compressor (`/tools/general/image-compressor`)

### Scaffolded (coming soon)
- PDF Generator (`/tools/general/pdf-generator`)
- Study Timer (`/tools/student/study-timer`)

## 2. Tech Stack

- Framework: Next.js `16.1.6` (App Router)
- Runtime UI: React `18.x`
- State: Zustand
- Database: MongoDB + Mongoose
- Auth: JWT via `jsonwebtoken`, password hashing via `bcryptjs`
- Editors/UI libs: Monaco, Lucide icons
- Styling: global CSS + utility classes

## 3. High-Level Architecture

```text
Browser UI (App Router pages)
  -> Client hooks/store/services
  -> API route handlers (/api/*)
  -> DB/Auth libraries (lib/*)
  -> MongoDB
```

### Core production boundaries
- `src/app/*`: route entry points only (page/layout/route handlers)
- `src/modules/*`: feature-level business/UI composition (dashboard, tools)
- `src/components/*`: reusable presentation primitives
- `src/services/*`: client-side API calls
- `src/store/*`: global client state and hydration actions
- `src/lib/*`: server-side shared libraries (DB, auth, guards)

This split is the main separation-of-concerns strategy in this codebase.

### Tool system architecture
See `docs/tool-system.md` for tool registry contracts, execution flow, and boundaries.

## 4. Separation of Concerns (Detailed)

### Routing vs feature logic
- App routes under `src/app` are thin wrappers.
- Route pages import module pages (`src/modules/*`) instead of embedding logic inline.

### UI vs business logic
- Tool logic is isolated in `*.logic.jsx` files.
- Tool rendering/state UI is in `*.ui.jsx` files.
- Examples:
  - `src/modules/tools/jsonFormatter/json.logic.jsx`
  - `src/modules/tools/jsonFormatter/json.ui.jsx`
  - `src/modules/tools/apiTester/apiTester.logic.jsx`
  - `src/modules/tools/apiTester/apiTester.ui.jsx`

### Auth boundary
- HTTP auth API lives in `src/app/api/auth/*`.
- Cookie/token helpers are in `src/lib/auth/*`.
- Client auth state and calls are in:
  - `src/services/auth.service.js`
  - `src/store/auth.store.js`
  - `src/hooks/useAuth.js`

### Data boundary
- DB connection is centralized in `src/lib/db/models/connect.js`.
- Mongoose models are in `src/lib/db/models/*`.
- API routes call models through this shared connection layer.

### Navigation/source-of-truth boundary
- Tool/category metadata is centralized in `src/lib/tools/toolRegistry.js`.
- Sidebar, dashboard, and tool listings read from this registry.
- This avoids duplicate hardcoded route lists across UI surfaces.

## 5. Route Map

### Web routes

| Route | Purpose | Auth |
|---|---|---|
| `/` | Landing page, CTA to tools/dashboard | Public |
| `/auth/login` | Login form | Public |
| `/auth/register` | Register form | Public |
| `/dashboard` | Workspace dashboard | Protected |
| `/tools` | Tools directory/search by category | Protected |
| `/tools/developer` | Developer category listing | Protected |
| `/tools/general` | General category listing | Protected |
| `/tools/student` | Student category listing | Protected |
| `/tools/developer/json-formatter` | JSON formatter tool | Protected |
| `/tools/developer/api-tester` | API tester tool | Protected |
| `/tools/general/image-compressor` | Image compression tool | Protected |
| `/tools/general/pdf-generator` | PDF tool scaffold | Protected |
| `/tools/student/study-timer` | Study timer scaffold | Protected |

### API routes

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/auth/register` | `POST` | Create user + set auth cookies | Public |
| `/api/auth/login` | `POST` | Login + set auth cookies | Public |
| `/api/auth/logout` | `POST` | Clear auth cookies | Public |
| `/api/auth/me` | `GET` | Return current authenticated user | Required |
| `/api/test-db` | `GET` | DB connectivity/health check | Public |
| `/api/tools/api-tester/run` | `POST` | Execute HTTP request + persist run history + quota | Required |
| `/api/tools/api-tester/history` | `GET` | Paginated API tester history | Required |

### Route protection
- `src/proxy.js` protects `/dashboard/:path*` and `/tools/:path*`.
- Access token is checked from cookies; unauthenticated users are redirected to `/auth/login`.

## 6. Feature Flow (Step-by-Step)

### A) Authentication flow
1. User submits login/register form.
2. Client calls `auth.service` (`/api/auth/*`).
3. API route validates payload, connects DB, checks/creates user.
4. JWT access/refresh cookies are set (`httpOnly`, `sameSite=lax`, `secure` in production).
5. Zustand auth store updates `user` state.
6. Protected pages are allowed via `proxy.js` cookie check.

### B) API Tester flow
1. User configures method/url/headers/body in UI.
2. `apiTester.logic.jsx` validates URL/body and posts to `/api/tools/api-tester/run`.
3. API route enforces auth and daily quota.
4. Server fetches upstream URL, normalizes response payload, stores `ToolHistory`.
5. Client renders response panel and updates history state.
6. History tab fetches paginated records via `/api/tools/api-tester/history`.

### C) JSON Formatter flow
1. User enters JSON text.
2. `json.logic.jsx` parses and computes line/column on parse failures.
3. UI supports prettify/minify and tree/formatting helpers.

## 7. Directory Structure (Current)

```text
src/
  app/
    api/
      auth/{login,register,logout,me}/route.js
      tools/api-tester/{run,history}/route.js
      test-db/route.js
    auth/{layout.jsx,login/page.jsx,register/page.jsx,auth.css}
    dashboard/{layout.jsx,page.jsx}
    tools/
      layout.jsx
      page.jsx
      developer/{page.jsx,api-tester/page.jsx,json-formatter/page.jsx}
      general/{page.jsx,image-compressor/page.jsx,pdf-generator/page.jsx}
      student/{page.jsx,study-timer/page.jsx}
    globals.css
    layout.jsx
    page.jsx
  components/
    auth/{LoginForm.jsx,RegisterForm.jsx}
    common/Navbar.jsx
    layout/{LayoutShell.jsx,Sidebar.jsx,Header.jsx,navItems.js}
    tools/{ToolCard.jsx,ToolLayout.jsx}
    ToolCard.jsx
  hooks/useAuth.js
  lib/
    auth/{cookies.js,jwt.js,requireAuth.js}
    db/models/{connect.js,user.model.js,toolHistory.model.js,...}
    tools/toolRegistry.js
  modules/
    dashboard/{dashboard.logic.jsx,dashboard.ui.jsx,dashboard.page.jsx}
    tools/
      apiTester/{apiTester.logic.jsx,apiTester.ui.jsx,apiTester.page.jsx,...}
      jsonFormatter/{json.logic.jsx,json.ui.jsx,json.page.jsx,tree/*}
  services/auth.service.js
  store/{auth.store.js,index.js,StoreProvider.jsx,app.context.jsx}
  proxy.js
```

## 8. Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
API_TESTER_DAILY_LIMIT=100
```

Notes:
- `API_TESTER_DAILY_LIMIT` is optional. Default is `100` requests per user in a rolling 24h window.

## 9. Local Development

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Open app:
```text
http://localhost:3000
```

4. Optional DB health check:
```text
GET http://localhost:3000/api/test-db
```

## 10. NPM Scripts

- `npm run dev` -> Next dev server on port `3000` with Turbopack
- `npm run build` -> Production build
- `npm run start` -> Start production server on port `3000`

## 11. Production-Grade Practices Already Applied

- Shared DB connection cache for server handlers.
- Cookie-based auth with `httpOnly` cookies.
- Protected route gate at edge/proxy layer for `/dashboard` and `/tools`.
- API input normalization for auth (trim/lowercase email, password checks).
- Tool metadata registry driving navigation to reduce route drift.
- Feature modularization (`page -> module -> logic/ui`).
- API Tester safeguards:
  - HTTP/HTTPS validation
  - blocked sensitive headers (`host`, `content-length`, `cookie`)
  - per-user quota enforcement
  - persisted request/response history

## 12. Current Gaps / Next Hardening Steps

- Add request schema validation layer (e.g. Zod) for all API payloads.
- Add refresh token rotation/revocation strategy and session model enforcement.
- Convert `session/subscription/payment` files from schema notes to real Mongoose models.
- Add automated tests (unit + API integration + auth E2E).
- Add lint/test scripts in `package.json` CI pipeline.
- Add observability (structured logs + error tracking + metrics).

## 13. Contribution Guidance

When adding a new tool, follow this flow:
1. Add tool metadata to `src/lib/tools/toolRegistry.js`.
2. Create route under `src/app/tools/<category>/<tool>/page.jsx`.
3. Implement module logic/UI under `src/modules/tools/<tool>/`.
4. Add API handlers (if needed) under `src/app/api/tools/<tool>/`.
5. Keep UI reusable components under `src/components/tools/`.
6. Update README route table and feature matrix.

This keeps feature growth structured, traceable, and production-aligned.
