# Cognote

> Enterprise Knowledge Intelligence & Desktop Workspace

Cognote is an enterprise desktop intelligence application built with **Tauri 2**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Turborepo**. It connects your organization's scattered documents and files into a unified, secure, local-first knowledge engine.

---

## 🚀 Architecture & Monorepo Layout

- **`packages/types`**: Domain TypeScript interfaces for authentication, permissions, sync, search, streaming chat, knowledge graphs, and insights.
- **`packages/api-client`**: Strongly-typed client library with full mock data and simulation suites for offline and local testing.
- **`packages/ui`**: Shared design tokens, enterprise color palettes, and component utilities.
- **`apps/desktop`**: Complete Tauri 2 + Vite desktop application frontend featuring 10 views:
  - **Login / SSO**: Enterprise authentication and session storage.
  - **Executive Home**: Knowledge telemetry (documents, indexed chunks, entities, relations) and audit feed.
  - **Ask Cognote**: Interactive AI chat assistant with token streaming and cited source cards.
  - **Search**: Sub-200ms semantic and full-text document discovery with snippet highlights.
  - **Knowledge**: Knowledge graph entity explorer and relational map.
  - **Insights Hub**: Digital waste analysis (exact/near/semantic duplicates, outdated files), decision lineage, and knowledge health scores.
  - **Sync Center**: Real-time folder synchronization monitoring, error telemetry, and process queues.
  - **Permissions**: Granular directory access authorizations and audit logging.
  - **Settings**: AI processing policy controls (Company Server vs. Local AI), privacy limits, and organizational rules.
  - **Onboarding Wizard**: 8-step first-run interactive setup and mock filesystem scan.

---

## 🛠️ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`corepack enable pnpm` or `npm install -g pnpm`)
- *(Optional for native desktop builds)* [Rust](https://www.rust-lang.org/) & Tauri CLI prerequisites

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run the Development Server
```bash
# Start the desktop web UI
pnpm dev

# Or directly from the desktop package
cd apps/desktop
pnpm dev
```
The application will be available at `http://localhost:1420/`.

### 3. Build Desktop Application (with Tauri)
```bash
cd apps/desktop
pnpm tauri dev
```
