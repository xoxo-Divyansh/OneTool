# OneTool Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BROWSER (Client Layer)                         │
│                                                                          │
│  ┌──────────────────┐      ┌──────────────────┐      ┌───────────────┐ │
│  │   Dashboard      │      │  Command Palette │      │  Tool Pages   │ │
│  │   /dashboard     │─────▶│      (⌘K)        │─────▶│  /tools/*     │ │
│  └──────────────────┘      └──────────────────┘      └───────┬───────┘ │
│                                     │                         │         │
│                                     ▼                         │         │
│                          ┌──────────────────┐                 │         │
│                          │  Tool Registry   │◀────────────────┘         │
│                          │  (Read-only)     │                           │
│                          └──────────────────┘                           │
│                                     │                                   │
└─────────────────────────────────────┼───────────────────────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │    Tool Component (Isolated)      │
                    │  • JSON Formatter                 │
                    │  • API Tester                     │
                    │  • Image Compressor               │
                    └─────────────┬─────────────────────┘
                                  │
                    ┌─────────────▼─────────────────┐
                    │   Execution Decision          │
                    │   Client-side or Server-side? │
                    └─────┬───────────────┬─────────┘
                          │               │
            ┌─────────────▼──┐       ┌───▼──────────────────┐
            │  Client-Side   │       │   Server-Side        │
            │  Processing    │       │   API Call           │
            │  (Browser)     │       │   /api/tools/*/exec  │
            └────────────────┘       └──────┬───────────────┘
                                            │
┌───────────────────────────────────────────▼───────────────────────────────┐
│                         SERVER (API Layer)                                 │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                      API Route Handler                                │ │
│  │  /api/tools/[toolId]/execute                                         │ │
│  │                                                                       │ │
│  │  1. Validate JWT (httpOnly cookie)                                   │ │
│  │  2. Check user quota                                                 │ │
│  │  3. Resolve tool runner                                              │ │
│  │  4. Execute tool logic                                               │ │
│  │  5. Save history to DB                                               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                     │                                      │
│                    ┌────────────────▼────────────────┐                    │
│                    │   Tool Runner Registry          │                    │
│                    │   • Resolves tool by ID         │                    │
│                    │   • Executes tool.run()         │                    │
│                    └────────────────┬────────────────┘                    │
│                                     │                                      │
└─────────────────────────────────────┼──────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼──────────────────────────────────────┐
│                      DATABASE (Persistence Layer)                          │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   Users          │  │  Tool History    │  │  Sessions        │       │
│  │  • credentials   │  │  • API requests  │  │  • JWT tokens    │       │
│  │  • preferences   │  │  • tool usage    │  │  • refresh       │       │
│  │  • quota limits  │  │  • timestamps    │  │  • expiry        │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
│                         MongoDB + Mongoose                                 │
└────────────────────────────────────────────────────────────────────────────┘
```

## Tool Registry Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tool Registration Flow                        │
└─────────────────────────────────────────────────────────────────┘

1. Tool Config Created
   src/tools/my-tool/tool.config.js
   ↓
   export const metadata = {
     id: "my-tool",
     name: "My Tool",
     category: "developer",
     ...
   }

2. Tool Loader Imports Config
   src/core/tool-system/tool-loader.js
   ↓
   import myToolConfig from "@/tools/my-tool/tool.config"

3. Registry Builds Metadata
   src/core/tool-system/tool-registry.js
   ↓
   • Normalizes tool metadata
   • Generates routes (/tools/[category]/[tool])
   • Builds search index
   • Creates navigation structure

4. UI Consumes Registry
   ↓
   ┌─────────────┬─────────────┬─────────────┐
   │  Dashboard  │   Search    │  Sidebar    │
   │  Tool Cards │   Results   │  Nav Links  │
   └─────────────┴─────────────┴─────────────┘
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                        │
└──────────────────────────────────────────────────────────────┘

User submits login form
         ↓
POST /api/auth/login
         ↓
┌────────────────────────────────┐
│  Server validates credentials  │
│  • Check email exists          │
│  • Verify password (bcryptjs)  │
│  • Query MongoDB               │
└────────┬───────────────────────┘
         ↓
┌────────────────────────────────┐
│  Generate JWT tokens           │
│  • Access token (15min)        │
│  • Refresh token (7 days)      │
│  • Sign with JWT_SECRET        │
└────────┬───────────────────────┘
         ↓
┌────────────────────────────────┐
│  Set httpOnly cookies          │
│  • Secure in production        │
│  • SameSite=Lax                │
│  • Path=/                      │
└────────┬───────────────────────┘
         ↓
┌────────────────────────────────┐
│  Client updates Zustand store  │
│  • user: { id, email, name }   │
│  • isAuthenticated: true       │
└────────┬───────────────────────┘
         ↓
Protected routes accessible
(/dashboard, /tools)
```

## Data Flow Example: API Tester

```
┌──────────────────────────────────────────────────────────────┐
│              API Tester Tool - Complete Flow                  │
└──────────────────────────────────────────────────────────────┘

1. User configures request
   • Method: POST
   • URL: https://api.example.com/data
   • Headers: { "Content-Type": "application/json" }
   • Body: { "key": "value" }

2. Click "Send Request"
   ↓
   Component validates input
   ↓
   POST /api/tools/api-tester/run
   {
     method: "POST",
     url: "https://api.example.com/data",
     headers: {...},
     body: {...}
   }

3. Server-side processing
   ↓
   ┌─────────────────────────────┐
   │  Validate JWT               │
   │  Check user quota (100/day) │
   └─────────┬───────────────────┘
             ↓
   ┌─────────────────────────────┐
   │  Execute HTTP request       │
   │  • Fetch upstream API       │
   │  • Capture response         │
   │  • Measure timing           │
   └─────────┬───────────────────┘
             ↓
   ┌─────────────────────────────┐
   │  Save to ToolHistory        │
   │  • userId                   │
   │  • toolId: "api-tester"     │
   │  • request data             │
   │  • response data            │
   │  • timestamp                │
   └─────────┬───────────────────┘
             ↓
   Return response to client

4. Client renders response
   ↓
   • Status code badge
   • Response time
   • Headers table
   • Body (formatted JSON)
   • Add to history list

5. User views history
   ↓
   GET /api/tools/api-tester/history?page=1&limit=10
   ↓
   Paginated history displayed
```

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Route Protection (Middleware)
   src/proxy.js
   • Checks JWT cookie on /dashboard and /tools routes
   • Redirects to /auth/login if invalid

Layer 2: API Authentication
   src/lib/auth/requireAuth.js
   • Validates JWT on every API call
   • Returns 401 if token expired/invalid

Layer 3: Input Validation
   API route handlers
   • Sanitize user input
   • Validate request schemas
   • Prevent injection attacks

Layer 4: Database Security
   • Mongoose schema validation
   • Indexed queries (prevent full scans)
   • Connection pooling (prevent exhaustion)

Layer 5: Cookie Security
   • httpOnly (no JS access)
   • Secure flag (HTTPS only in prod)
   • SameSite=Lax (CSRF protection)
```

## Scalability Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                  Scalability Architecture                    │
└─────────────────────────────────────────────────────────────┘

1. Horizontal Scaling
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Next.js  │  │ Next.js  │  │ Next.js  │
   │ Instance │  │ Instance │  │ Instance │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        └─────────────┼─────────────┘
                      ↓
              Load Balancer
                      ↓
              MongoDB Cluster

2. Caching Strategy
   • Tool registry cached in memory
   • MongoDB connection pooled
   • Static assets CDN-ready

3. Database Optimization
   • Indexed queries on userId, toolId
   • Pagination for history
   • Aggregation pipelines for analytics

4. Client-side Optimization
   • Code splitting per tool
   • Lazy loading components
   • Service worker (future)
```

---

## How to Use This Diagram

1. **For Developers:** Understand system boundaries and data flow
2. **For Recruiters:** See production-grade architecture thinking
3. **For Contributors:** Know where to add features
4. **For Interviews:** Explain design decisions confidently

---

**Note:** This is a living document. Update as architecture evolves.
