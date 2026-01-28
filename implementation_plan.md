# Implementation Plan - FormVibe (Form Workflow SaaS)

This document outlines the 8-phase implementation plan for building **FormVibe**, a production-ready form backend platform.

---

## Phase 1: Product Foundation
**Goal**: Define the core identity and scope of the platform.

### Product Overview
**FormVibe** is a SaaS platform providing a robust backend for any web form. Developers point their form's `action` to a FormVibe endpoint to receive submissions with built-in spam protection, email notifications, and a polished dashboard.

### Feature List (MVP)
- **Spam Control**: Honeypot, Rate limiting, Basic spam scoring (IP + heuristics), and Test mode.
- **Dashboard**: View, search, export (CSV/JSON), status management (read/spam), and basic filters.
- **GDPR (MVP)**: Manual export + delete (admin-triggered).

---

## Phase 2: System Architecture
**Goal**: Define the technical blueprint and data flow.

### Technical Stack
- **Next.js 14+** (App Router), **Tailwind CSS**, **Drizzle ORM** (PostgreSQL).
- **Auth.js** (Session-based), **Upstash Redis** (Rate limiting).

### Hybrid Runtime Flow
- **Edge Route** (`/api/f/[formId]`): Fast pre-checks (honeypot, rate limiting).
- **Serverless Internal** (`/api/internal/submit`): Secure DB writes and background job triggering.
- **Middleware**: Centralized session validation for dashboard APIs.

---

## Phase 3: Database Design
**Goal**: Normalized PostgreSQL schema optimized for speed and flexibility.

### Core Tables
- `forms`: Metadata, status, and owner.
- `submissions`: `JSONB` payload, metadata, and status.
- `permissions`: RBAC (Owner, Admin, Viewer) with `UNIQUE (form_id, user_id)`.
- `labels`: Organization tags with `UNIQUE (form_id, name)`.
- `gdpr_requests`: Audit log for export/delete requests.

### Indexing
- Submissions indexed by `(form_id, created_at DESC)` and `(form_id, status)`.

---

## Phase 4: Backend API (Vercel Compatible)
**Goal**: Secure, scalable API endpoints.

### Key Routes
- **Public Submit**: Hybrid Edge/Serverless flow with shared secret protection.
- **Dashboard APIs**: Paginated (cursor-based) submission listing and RBAC-enforced CRUD operations.
- **Analytics**: MVP counts (total, unread, spam, 7-day trend).

---

## Phase 5: Frontend Dashboard (UI First)
**Goal**: Premium, high-end user experience.

### Design System
- **Aesthetics**: Deep navy dark mode with glassmorphism and `Outfit`/`Inter` typography.
- **Components**: High-density submission tables, sliding drawers for details, and optimistic UI updates.
- **Accessibility**: Keyboard-first navigation and WCAG-AA contrast compliance.

---

## Phase 6: Form SDKs
**Goal**: Developer tools for easy integration.

### SDK Offerings
- **React SDK**: `useFormVibe` hook and `<Form />` component.
- **Vanilla JS SDK**: Lightweight script to auto-wire HTML forms.
- **Standard HTML**: Zero-JS support via standard POST actions.

---

## Phase 7: Security and Compliance
**Goal**: Legal compliance and data safety.

- **GDPR Tools**: Manual CSV/JSON exports and bulk deletion tools.
- **RBAC**: Strict role enforcement for Owners, Admins, and Viewers.
- **Data Retention**: Soft-deletion with automated 30-day purge cycles.

---

## Phase 8: Polish and Deployment
**Goal**: Performance tuning and Vercel launch.

### Optimizations
- **Dynamic Rendering**: Bypassing static cache for real-time dashboard data.
- **Monitoring**: Integration with Sentry (errors) and PostHog (analytics).
- **Vercel Setup**: Environment variables for DB, Redis, Auth, and Resend.

---

## Final Review Required
Please review the complete plan. Once you are satisfied with all 8 phases, we can begin the **EXECUTION** phase!
