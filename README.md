<div align="center">

# 🚀 OneTool

### All Your Daily Tools, One Workspace

**A modular, authenticated developer workspace that unifies everyday utilities into a single scalable platform.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Documentation](docs/) • [Report Bug](issues) • [Request Feature](issues)

</div>

---

## 💡 Why OneTool?

Developers juggle dozens of utility tools daily — JSON formatters, API testers, image compressors, study timers. Each lives on a different website, requiring separate logins, losing history, and breaking workflow focus.

**OneTool solves this by providing:**
- ✅ **One authenticated workspace** for all utilities
- ✅ **Persistent history** across sessions  
- ✅ **Command palette search** (⌘K) for instant tool access
- ✅ **Modular architecture** that makes adding new tools trivial

---

## 🧠 Core Philosophy

OneTool is not just a collection of tools — it's a **tool platform powered by a registry-driven architecture**.

**Design Principles:**
- **Build once, reuse everywhere** — Tools plug into the system, not exist in isolation
- **Clear separation of concerns** — UI, logic, and data boundaries are explicit
- **Registry as single source of truth** — Navigation, routing, and search powered by one metadata source
- **Production-grade from day one** — Auth, security, and scalability built-in

---

## ⚙️ System Design Highlight

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Dashboard   │───▶│ Tool Search  │───▶│ Tool Component│  │
│  │   (⌘K)       │    │  (Registry)  │    │   (Isolated)  │  │
│  └──────────────┘    └──────────────┘    └───────┬────────┘  │
└────────────────────────────────────────────────────┼──────────┘
                                                     │
                                    ┌────────────────▼──────────────┐
                                    │   API Routes (/api/tools/*)   │
                                    │  • Auth Validation (JWT)      │
                                    │  • Tool Runner Resolution     │
                                    │  • Quota Management           │
                                    └────────────┬──────────────────┘
                                                 │
                                    ┌────────────▼──────────────────┐
                                    │   MongoDB (Persistent Layer)  │
                                    │  • User Sessions              │
                                    │  • Tool History               │
                                    │  • Usage Analytics            │
                                    └───────────────────────────────┘
```

**Key Innovation:** Tool Registry System
- Tools self-register via `tool.config.js`
- Registry builds navigation, routing, and search index automatically
- Adding a new tool = drop in folder + config (no routing changes needed)

---

## 🎯 Who It's For

- **Developers** — Quick access to JSON formatters, API testers, code utilities
- **Students** — Study timers, productivity tools, workflow management
- **Teams** — Shared workspace with persistent history and collaboration features (coming soon)
- **Anyone** tired of juggling multiple utility websites

---

## 🆚 OneTool vs Alternatives

| Feature | OneTool | Individual Tools | Other Platforms |
|---------|---------|------------------|-----------------|
| **Single Login** | ✅ One auth for all tools | ❌ Login per site | ⚠️ Limited tools |
| **Persistent History** | ✅ Saved per user | ❌ Lost on refresh | ⚠️ Paid feature |
| **Command Palette** | ✅ ⌘K instant search | ❌ Manual navigation | ❌ Not available |
| **Modular Architecture** | ✅ Registry-driven | ❌ Monolithic | ⚠️ Closed source |
| **Open Source** | ✅ MIT License | ⚠️ Varies | ❌ Proprietary |
| **Self-Hostable** | ✅ Full control | N/A | ❌ SaaS only |
| **Tool Extensibility** | ✅ Drop-in system | ❌ Not applicable | ❌ Vendor lock-in |

---

## ✨ Key Features

### 🛠️ Implemented Tools

<table>
<tr>
<td width="33%">

#### 💻 Developer Tools
- **JSON Formatter**  
  Parse, prettify, minify with Monaco editor
- **API Tester**  
  HTTP requests with history & quota tracking

</td>
<td width="33%">

#### 🎨 General Tools
- **Image Compressor**  
  Client-side compression (no uploads)
- **PDF Studio**  
  PDF generation & manipulation

</td>
<td width="33%">

#### � Student Tools
- **Study Timer**  
  Pomodoro-style focus sessions

</td>
</tr>
</table>

### 🚀 Platform Features

| Feature | Description |
|---------|-------------|
| **⌘K Command Palette** | Instant search and navigation to any tool |
| **📊 Persistent History** | API requests, tool usage, session data saved per user |
| **⚡ Quota Management** | Rate limiting and usage tracking for resource-intensive tools |
| **📱 Responsive Design** | Mobile-friendly sidebar navigation and tool interfaces |
| **🔐 Secure Auth** | JWT-based authentication with httpOnly cookies |
| **🎯 Tool Registry** | Self-registering tools with automatic routing |

---

## 🎬 How It Works

### Authentication Flow
```
User visits /auth/login
         ↓
Form submits to /api/auth/login
         ↓
Server validates credentials → MongoDB
         ↓
JWT tokens set as httpOnly cookies
         ↓
Zustand store updates client state
         ↓
Protected routes accessible (/dashboard, /tools)
```

### Tool Execution Flow
```
User presses ⌘K → Search modal opens
         ↓
Selects tool from registry
         ↓
Tool page loads: /tools/[category]/[tool]
         ↓
Tool component renders (isolated logic + UI)
         ↓
┌─────────────────┬─────────────────┐
│  Client-Side    │  Server-Side    │
│  (JSON, Images) │  (API calls)    │
└────────┬────────┴────────┬────────┘
         │                 │
         ↓                 ↓
    Results          /api/tools/[toolId]/execute
    displayed                ↓
                      Tool Runner executes
                             ↓
                      MongoDB saves history
```

---

## 🏗️ Architecture

OneTool follows a **registry-driven, modular architecture** with clear separation of concerns.

### 🎯 Architectural Highlights

**1. Tool Registry System** (Our Core Innovation)
```javascript
// Tools self-register via tool.config.js
export const metadata = {
  id: "json-formatter",
  name: "JSON Formatter",
  category: "developer",
  description: "Parse and format JSON",
  icon: "📝"
};
```
- Registry builds navigation, routing, and search index automatically
- Adding a tool = drop in folder + config (no routing changes)
- Single source of truth for all tool metadata

**2. Clear Boundaries**
```
┌─────────────────────────────────────────────────────┐
│  Routes (src/app/*)        → Thin wrappers only     │
│  Components (src/components/*) → Presentation only  │
│  Tools (src/tools/*)       → Self-contained logic   │
│  Core (src/core/*)         → Platform infrastructure│
│  Lib (src/lib/*)           → Server utilities       │
└─────────────────────────────────────────────────────┘
```

**3. Client/Server Split**
- **Client:** React components, Zustand stores, browser APIs
- **Server:** API routes, MongoDB models, JWT validation  
- **Shared:** Tool registry (read-only on client)

### 📁 Project Structure (Simplified)

```
src/
├── app/                    # Next.js routes (thin wrappers)
│   ├── api/               # API handlers
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard route
│   └── tools/             # Tool routes
├── components/            # Reusable UI
│   ├── common/           # Navbar, search, shared UI
│   ├── layout/           # Sidebar, header, shell
│   └── UI/               # LoadingSpinner, ErrorAlert
├── core/                  # Platform core ⭐
│   └── tool-system/      # Registry, loader, engine
├── tools/                 # Tool implementations ⭐
│   ├── api-tester/       # Self-contained tool
│   ├── json-formatter/   # Self-contained tool
│   └── .../              # More tools...
├── lib/                   # Server utilities
│   ├── auth/             # JWT, cookies, guards
│   └── db/               # MongoDB + models
├── hooks/                 # React hooks
├── services/              # Client API services
└── store/                 # Zustand state
```

### 📚 Deep Dive Documentation

For detailed architecture, see:
- [Architecture Overview](docs/architecture.md)
- [Tool System Design](docs/tool-system.md)
- [Development Workflow](docs/development.md)

---

## Tech Stack

**Framework & Runtime**
- Next.js 16.1.6 (App Router)
- React 18.x
- Node.js (runtime)

**State & Data**
- Zustand (client state)
- MongoDB + Mongoose (database)
- JWT (authentication)

**UI & Editors**
- Monaco Editor (code editing)
- Lucide React (icons)
- Custom CSS (styling)

**Security & Auth**
- bcryptjs (password hashing)
- jsonwebtoken + jose (JWT handling)
- httpOnly cookies (token storage)

**Utilities**
- pdf-lib (PDF generation)
- react-dropzone (file uploads)

---

## Routes Overview

### Web Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Landing page | Public |
| `/auth/login` | Login form | Public |
| `/auth/register` | Registration form | Public |
| `/dashboard` | Main workspace dashboard | Protected |
| `/tools` | Tool directory with search | Protected |
| `/tools/[category]` | Category listing | Protected |
| `/tools/[category]/[tool]` | Individual tool page | Protected |

### API Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/auth/register` | POST | Create user + set cookies | Public |
| `/api/auth/login` | POST | Login + set cookies | Public |
| `/api/auth/logout` | POST | Clear cookies | Public |
| `/api/auth/me` | GET | Get current user | Required |
| `/api/tools/[toolId]/execute` | POST | Execute tool server-side | Required |
| `/api/tools/api-tester/run` | POST | Run API test + save history | Required |
| `/api/tools/api-tester/history` | GET | Get API test history | Required |
| `/api/test-db` | GET | Database health check | Public |

**Route Protection:** Middleware in `src/proxy.js` protects `/dashboard` and `/tools` routes by validating JWT cookies.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/onetool.git
cd onetool

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Environment Variables

Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/onetool
JWT_SECRET=your-secret-key-min-32-chars
API_TESTER_DAILY_LIMIT=100
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | JWT signing key (min 32 chars) |
| `API_TESTER_DAILY_LIMIT` | ❌ | `100` | Max API requests per user/day |

---

## 🎯 Usage

### Getting Started
1. Register at `/auth/register`
2. Login at `/auth/login`
3. Access dashboard at `/dashboard`
4. Press `⌘K` (or `Ctrl+K`) to open command palette
5. Search for any tool and press Enter

### Adding a New Tool

**Step 1:** Create tool folder
```bash
mkdir -p src/tools/my-tool
```

**Step 2:** Create `tool.config.js`
```javascript
export const metadata = {
  id: "my-tool",
  name: "My Tool",
  category: "developer",
  description: "Tool description",
  icon: "🔧",
  comingSoon: false,
};

export default metadata;
```

**Step 3:** Create `component.jsx`
```javascript
export default function MyTool() {
  return (
    <div className="tool-container">
      <h1>My Tool</h1>
      {/* Your tool UI */}
    </div>
  );
}
```

**Step 4:** Create `page.jsx`
```javascript
import MyTool from "./component";

export default function MyToolPage() {
  return <MyTool />;
}
```

**Step 5:** Register in `src/core/tool-system/tool-loader.js`
```javascript
import myToolConfig from "@/tools/my-tool/tool.config";

// Add to configs array
```

**Done!** Tool automatically appears in dashboard, search, and navigation.

📖 See [docs/development.md](docs/development.md) for detailed workflow.

---

## 🛡️ Production Practices

OneTool implements production-grade patterns from day one:

| Category | Implementation |
|----------|----------------|
| **🔐 Security** | • httpOnly JWT cookies<br>• bcryptjs password hashing<br>• Protected route middleware<br>• Input validation & sanitization |
| **⚡ Performance** | • MongoDB connection pooling<br>• Client-side tool execution<br>• Lazy component loading<br>• Optimized bundle splitting |
| **📈 Scalability** | • Registry-driven architecture<br>• Modular tool system<br>• Clear separation of concerns<br>• Database query indexing |
| **🧑‍💻 Developer Experience** | • Automated workflow scripts<br>• Conventional commit helpers<br>• PR templates & guidelines<br>• Comprehensive documentation |

---

## 🗺️ Roadmap

### Phase 1: Core Hardening (Q2 2024)
- [ ] Zod schema validation for all API payloads
- [ ] Refresh token rotation strategy
- [ ] Comprehensive test suite (unit + integration + E2E)
- [ ] CI/CD pipeline with automated tests

### Phase 2: Feature Expansion (Q3 2024)
- [ ] User preferences and settings
- [ ] Tool favorites and pinning
- [ ] Advanced search with filters
- [ ] Usage analytics dashboard

### Phase 3: Platform Evolution (Q4 2024)
- [ ] Plugin system for third-party tools
- [ ] Tool marketplace
- [ ] Collaborative features (shared workspaces)
- [ ] AI-powered tool suggestions

### Phase 4: Enterprise Features (2025)
- [ ] Team workspaces
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] SSO integration (OAuth, SAML)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Quick Contribution Guide

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with conventional commits**
   ```bash
   npm run workflow:commit
   ```
5. **Push and create PR**
   ```bash
   npm run workflow:pr
   ```

### Code Standards
- ✅ Use conventional commits (`feat:`, `fix:`, `docs:`)
- ✅ Follow existing code patterns
- ✅ Add JSDoc comments for public APIs
- ✅ Update documentation as needed

### Adding a Tool
1. Follow tool structure in `src/tools/`
2. Register in `src/core/tool-system/tool-loader.js`
3. Add tests for tool logic
4. Update README with tool details

📖 See [docs/development.md](docs/development.md) for detailed workflow.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run workflow:commit` | Generate conventional commit |
| `npm run workflow:pr` | Generate PR description |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with modern tools and best practices:
- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editing
- [Lucide](https://lucide.dev/) - Icons

---

## 📞 Support & Community

- 📖 **Documentation:** [docs/](docs/)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/onetool/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/onetool/discussions)
- 🔒 **Security:** See [SECURITY.md](SECURITY.md) for responsible disclosure

---

<div align="center">

**Built with ❤️ for developers who value their workflow**

[⭐ Star this repo](https://github.com/yourusername/onetool) • [🐦 Follow on Twitter](#) • [💼 LinkedIn](#)

</div>
