## 🧠 OneTool SaaS — Full Production Architecture

- `Think of OneTool like this:`

                INTERNET
                    │
                    ▼
             Next.js Frontend
                    │
                    ▼
            API Layer (Next.js API)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Auth System   Tool Engine   Billing System
        │           │           │
        ▼           ▼           ▼
       DB        Tool Services  Payment Gateway
        │
        ▼
   Analytics + History
_________________________________________________________________________________________
## 🧠 Ultimate OneTool SaaS Folder Structure
         src
         
         │
         ├── app
         │   │   layout.jsx
         │   │   page.jsx
         │   │   globals.css
         │   │   providers.jsx
         │   │
         │   ├── (auth)
         │   │   ├── login
         │   │   │     page.jsx
         │   │   ├── register
         │   │   │     page.jsx
         │   │   └── layout.jsx
         │   │
         │   ├── (dashboard)
         │   │   ├── dashboard
         │   │   │     page.jsx
         │   │   │
         │   │   ├── tools
         │   │   │   ├── api-tester
         │   │   │   │      page.jsx
         │   │   │   │
         │   │   │   ├── json-formatter
         │   │   │   │      page.jsx
         │   │   │   │
         │   │   │   └── jwt-decoder
         │   │   │          page.jsx
         │   │   │
         │   │   └── layout.jsx
         │   │
         │   └── api
         │       ├── auth
         │       │   ├── login
         │       │   │     route.js
         │       │   ├── register
         │       │   │     route.js
         │       │   ├── logout
         │       │   │     route.js
         │       │   └── me
         │       │         route.js
         │       │
         │       ├── tools
         │       │   ├── api-tester
         │       │   │      route.js
         │       │   │
         │       │   ├── json-formatter
         │       │   │      route.js
         │       │   │
         │       │   └── jwt-decoder
         │       │          route.js
         │       │
         │       └── billing
         │           ├── checkout
         │           │     route.js
         │           └── webhook
         │                 route.js
         │
         │
         ├── modules
         │
         │   ├── auth
         │   │   ├── auth.logic.js
         │   │   ├── auth.service.js
         │   │   └── auth.schema.js
         │   │
         │   ├── dashboard
         │   │   ├── dashboard.logic.js
         │   │   ├── dashboard.service.js
         │   │   └── dashboard.ui.jsx
         │   │
         │   ├── tools
         │   │
         │   │   ├── apiTester
         │   │   │   ├── apiTester.logic.js
         │   │   │   ├── apiTester.service.js
         │   │   │   ├── apiTester.ui.jsx
         │   │   │   └── apiTester.types.js
         │   │   │
         │   │   ├── jsonFormatter
         │   │   │   ├── json.logic.js
         │   │   │   ├── json.service.js
         │   │   │   ├── json.ui.jsx
         │   │   │   └── tree
         │   │   │       ├── TreeNode.jsx
         │   │   │       └── tree.utils.js
         │   │   │
         │   │   └── jwtDecoder
         │   │       ├── jwt.logic.js
         │   │       ├── jwt.service.js
         │   │       └── jwt.ui.jsx
         │   │
         │   └── billing
         │       ├── billing.logic.js
         │       ├── billing.service.js
         │       └── billing.ui.jsx
         │
         │
         ├── components
         │
         │   ├── ui
         │   │   ├── Button.jsx
         │   │   ├── Input.jsx
         │   │   ├── Card.jsx
         │   │   └── Modal.jsx
         │   │
         │   ├── layout
         │   │   ├── Navbar.jsx
         │   │   ├── Sidebar.jsx
         │   │   ├── Header.jsx
         │   │   └── LayoutShell.jsx
         │   │
         │   └── common
         │       ├── ToolCard.jsx
         │       └── Loader.jsx
         │
         │
         ├── services
         │
         │   ├── apiClient.js
         │   ├── auth.service.js
         │   └── toolHistory.service.js
         │
         │
         ├── lib
         │
         │   ├── db
         │   │   ├── connect.js
         │   │   └── models
         │   │       ├── user.model.js
         │   │       ├── session.model.js
         │   │       ├── subscription.model.js
         │   │       ├── payment.model.js
         │   │       └── toolHistory.model.js
         │   │
         │   ├── auth
         │   │   ├── jwt.js
         │   │   ├── cookies.js
         │   │   └── requireAuth.js
         │   │
         │   └── validators
         │       ├── auth.validator.js
         │       └── tool.validator.js
         │
         │
         ├── store
         │
         │   ├── index.js
         │   ├── StoreProvider.jsx
         │   │
         │   ├── auth
         │   │   └── auth.store.js
         │   │
         │   └── app
         │       └── app.store.js
         │
         │
         ├── hooks
         │   ├── useAuth.js
         │   └── useToolHistory.js
         │
         │
         ├── middlewares
         │   ├── auth.middleware.js
         │   ├── subscription.middleware.js
         │   └── rateLimit.middleware.js
         │
         │
         ├── utils
         │   ├── formatters.js
         │   ├── helpers.js
         │   └── constants.js
         │
         │
         └── styles
             └── theme.css

_________________________________________________________________________________________


# OneTool

OneTool is a single workspace for everyday dev/productivity utilities, starting with JSON formatting and API testing, with user auth and usage tracking foundations already in place.
## Problem It Solves

Developers and teams lose time switching between many small utility websites (JSON, API test, history, auth state, future billing limits).  
OneTool reduces context switching by bringing these workflows into one product with shared identity and a consistent dashboard.

## Core Product Idea

- One account, one dashboard, multiple tools
- Fast utility actions without changing tabs/platforms
- Expandable architecture for usage tracking, plans, and payments

## Current Working Flow (Implemented)

1. User opens landing page (`/`) and sees product positioning + tool entry points.
2. User can access dashboard (`/dashboard`) with tool cards.
3. User opens tool routes:
   - `/tools/json`
   - `/tools/api-tester`
4. User auth API is available:
   - `POST /auth/register`
   - `POST /auth/login`
   - `POST /auth/logout`
5. On register/login:
   - user is persisted in MongoDB
   - password is hashed using `bcryptjs`
   - access + refresh JWT cookies are set (`httpOnly`)
6. DB connectivity can be validated using:
   - `GET /api/test-db` (connect + `User.countDocuments()`)

## Features Available Right Now

- Next.js App Router project setup
- MongoDB integration via Mongoose with connection caching
- User model and auth lifecycle (register, login, logout)
- JWT-based cookie session pattern
- Dashboard module and reusable layout shell
- JSON Formatter tool screen scaffold
- API Tester tool screen scaffold
- Tool-centric UI components (cards, sidebar, header)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Tailwind CSS 4

## Architecture Snapshot

- `src/app/*`: routing + route handlers
- `src/modules/*`: feature modules (dashboard/tools)
- `src/lib/db/*`: DB connection + models
- `src/lib/auth/*`: JWT and cookie utilities
- `src/components/*`: shared UI/layout
- `src/store/*`: app-level state provider

## Main Build Concerns (Product + Engineering)

1. **Security baseline**
   - Move real secrets out of repo history and rotate exposed DB credentials.
   - Add request validation/sanitization for auth payloads.
   - Add token refresh/rotation flow and session invalidation strategy.

2. **Data model correctness**
   - `User` schema has typos (`emum`, `avtar`) that should be corrected.
   - `subscription`, `session`, `payment` files are currently schema notes, not executable Mongoose models.

3. **Auth boundaries**
   - Protected routes/middleware are not enforced yet.
   - No role-based authorization checks yet for admin-only capabilities.

4. **Tool execution depth**
   - JSON and API Tester are UI scaffolds; full request/response and formatter engines need implementation.
   - Tool history persistence exists conceptually (`ToolHistory` model) but is not connected to tool actions.

5. **State and API integration**
   - `auth.service.js` and `auth.store.js` are currently empty.
   - Client-side auth/session hydration flow is not completed.

6. **Launch readiness**
   - Missing automated tests (unit + API integration + auth flow tests).
   - Missing observability (request logs, error tracking, metrics).
   - Missing API docs/versioning strategy for scale.

## What Makes OneTool Interesting

- Single interface for repeated daily utility tasks
- Shared user identity across all tools
- Extensible model for usage analytics and subscription plans
- Modular feature structure for quickly adding new tools

## Current Status (Honest Snapshot)

- **Production-ready foundation:** partial
- **Auth basics:** working
- **Database connectivity:** working
- **Core tools depth:** early-stage
- **Billing/subscription:** planned structure, not implemented

## Suggested Near-Term Feature Additions

1. Complete JSON Formatter:
   - parse, pretty/minify, validation errors, copy/download
2. Complete API Tester:
   - method/url/headers/body editor, response time/status/body panel
3. Add tool history logging:
   - persist each run to `ToolHistory`, show recent runs in dashboard
4. Add auth guard middleware:
   - protect dashboard/tool routes for authenticated users
5. Add plan limits:
   - free/pro usage caps tied to tool runs
6. Add team-ready polish:
   - profile settings, API keys, export/import sessions

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start dev server:

```bash
npm run dev
```

4. Verify DB:

```bash
GET http://localhost:3000/api/test-db
```

## API Endpoints (Current)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /api/test-db`

## Product Pitch (Short)

OneTool is a focused utility workspace that removes tab-switching overhead for developers.  
It combines authentication, dashboard access, and multi-tool workflows in one platform, starting with JSON and API utilities and expanding toward history, plans, and team-scale productivity features.

export const toolCategories = [
  {
    id: "developer",
    label: "Developer Tools",
    tools: [
      { id: "api-tester", label: "API Tester", description: "...", route: "/tools/developer/api-tester" },
      { id: "json-formatter", label: "JSON Formatter", ... },
    ],
  },
  {
    id: "image",
    label: "Image Tools",
    tools: [ ... ],
  },
  // ...
];


