# Radius — Plan Slicing Fitur

Dokumen ini mendefinisikan **urutan pengerjaan UI (slicing)** berdasarkan [README.md](./README.md). Setiap slice harus bisa di-review secara mandiri (route jalan, layout konsisten, state mock/API jelas).

**Legenda status:** `✅ selesai` · `🟡 sebagian` · `⬜ belum`

---

## Prinsip slicing

1. **Vertikal per alur pengguna** — satu slice = satu journey yang bisa diklik end-to-end (boleh pakai mock data dulu).
2. **Shell dulu, isi kemudian** — layout app (sidebar, header, workspace) sebelum fitur berat (board, sprint).
3. **Satu view utama per slice** — hindari membuka Board + Calendar + Timeline dalam slice yang sama.
4. **Design system reuse** — pakai token/theme/font yang sudah ada; komponen baru masuk `app/components/`.
5. **Backend boleh menyusul** — UI slice tetap jalan dengan composable + mock; integrasi API = sub-task di akhir slice.

---

## Progress saat ini

| Slice | Ringkasan | Status |
|-------|-----------|--------|
| S0 | Foundation & marketing | ✅ |
| S1 | Auth (form & halaman) | ✅ |
| S2 | App shell & navigasi | ✅ |
| S3 | Workspace (multi-tenant UI) | ✅ |
| S4 | Dashboard widgets | ✅ |
| S5–S16 | Fitur produk (MVP → lanjutan) | ⬜ |

**Sudah ada di repo:** landing (`/`), legal (`/privacy`, `/terms`), halaman auth (login/register/forgot), layout `auth` / `landing` / `default` / `app`, `AppShell` (sidebar + mobile slideover), `AppSidebar`, `AppPageHeader`, `app-nav`, halaman app (`/app` dashboard widgets, `/app/projects`, `/app/my-tasks`, `/app/settings`, `/app/workspaces`, `/app/workspaces/[id]/settings`), `WorkspaceSwitcher` di header, `useWorkspace` + store mock, `useDashboard` + dashboard widgets, komponen workspace (badge, invite, members), theme, token CSS, `useAuth` + middleware, `AuthPasswordStrength`, komponen landing S0, mobile nav marketing.

---

## Phase 0 — Foundation (pra-produk)

### S0 — Design system & halaman publik

**Tujuan:** Semua halaman marketing/legal konsisten; siap jadi template slice berikutnya.

| Item | Deliverable | Status |
|------|-------------|--------|
| Token warna, spacing, typography | `app/assets/css/tokens/*` | ✅ |
| Theme brand + font + dark mode | `useTheme`, `ThemeToggle`, `themes/*` | ✅ |
| Landing page | `/` + `layouts/landing.vue` | ✅ |
| Legal pages | `/privacy`, `/terms`, `LegalPageShell` | ✅ |
| Komponen layout marketing | `SiteHeader`, `SiteFooter`, `BrandLogo` | ✅ |
| Empty states / ilustrasi landing | `UiEmptyState`, SVG bento + `LandingKanbanMockup` | ✅ |

**Selesai slice ketika:** responsive OK, a11y dasar (focus, label), tidak ada regresi theme.

---

## Phase 1 — MVP (sesuai README *Phase 1*)

Urutan: **Auth → Workspace → Dashboard → Project → Task → Kanban → Comment → Notification**

---

### S1 — Authentication (UI + alur)

**Referensi README:** §1 Authentication & Workspace (bagian auth).

**Depends on:** S0

| Sub-slice | Route / surface | Komponen / file | Status |
|-----------|-----------------|-----------------|--------|
| S1a | `/auth/login` | Form validasi, error state, loading | ✅ |
| S1b | `/auth/register` | Terms checkbox, strength hint | ✅ |
| S1c | `/auth/forgot-password` | Success / email sent state | ✅ |
| S1d | OAuth placeholder | Tombol Google/GitHub (mock → `/app`) | ✅ |
| S1e | Post-login redirect | Middleware `auth` → `/app` | ✅ |

**Acceptance:** User bisa submit form (mock OK); pesan error jelas; setelah “login” masuk ke shell app.

---

### S2 — App shell & navigasi utama

**Tujuan:** Kerangka aplikasi setelah login (mirip Linear/Notion).

**Depends on:** S1e

| Item | Deliverable | Status |
|------|-------------|--------|
| Layout dashboard | `AppShell` + `layouts/app.vue` — sidebar, top bar, content | ✅ |
| Nav items | `app/config/app-nav.ts` — Dashboard, Projects, My Tasks, Settings | ✅ |
| Breadcrumb / page title | `AppPageHeader` + `PageMeta.appTitle` | ✅ |
| Mobile | `USlideover` + menu button (`lg:hidden`) | ✅ |
| Route group | `app/pages/app/**` | ✅ |

**Routes:**

- `/app` — dashboard (6 widgets, mock per workspace)
- `/app/projects`, `/app/my-tasks` — placeholder
- `/app/settings` — profil mock (nama/email dari sesi)

**Acceptance:** Navigasi antar halaman placeholder tanpa reload patah; active state sidebar benar.

---

### S3 — Workspace (multi-tenant UI)

**Referensi README:** §1 — Multi workspace, invite, role.

**Depends on:** S2

| Sub-slice | Deliverable | Status |
|-----------|-------------|--------|
| S3a | Workspace switcher di header (list mock) | ✅ |
| S3b | `/app/workspaces` — daftar workspace | ✅ |
| S3c | Modal/dialog buat workspace | ✅ |
| S3d | `/app/workspaces/[id]/settings` — tab General, Members | ✅ |
| S3e | Invite member (email + role select) | ✅ |
| S3f | Role badge: Owner, Admin, Member, Viewer | ✅ |

**Acceptance:** Ganti workspace mengubah konteks (mock store); invite flow UI lengkap tanpa API.

---

### S4 — Dashboard

**Referensi README:** §2 Dashboard.

**Depends on:** S3

| Widget (mock) | Komponen | Status |
|---------------|----------|--------|
| Active projects | `DashboardActiveProjects` | ✅ |
| Task progress | `DashboardTaskProgress` | ✅ |
| Recent activity | `DashboardRecentActivity` | ✅ |
| Sprint progress | `DashboardSprintProgress` | ✅ |
| Assigned to me | `DashboardAssignedTasks` | ✅ |
| Team workload | `DashboardTeamWorkload` | ✅ |

**Route:** `/app`

**Data:** `useDashboard` + `app/data/dashboard-seed.ts` (per workspace; Design Lab = empty widgets)

**Acceptance:** Grid responsive 1/2/3 kolom; skeleton loading; empty state per widget.

---

### S5 — Project management (CRUD & daftar)

**Referensi README:** §3 Project Management.

**Depends on:** S4

| Sub-slice | Deliverable |
|-----------|-------------|
| S5a | `/app/projects` — grid/list project + filter (status, favorite) |
| S5b | Create project modal (nama, icon, cover, status) |
| S5c | Project detail shell `/app/projects/[projectId]` |
| S5d | Sidebar project: archive, favorite toggle |
| S5e | Project settings page (icon, cover, status, archive) |

**Acceptance:** Buka project → masuk shell dengan tab navigasi ke view (Board/List nanti).

---

### S6 — Task management (inti, tanpa board)

**Referensi README:** §4 Task Management.

**Depends on:** S5c

| Sub-slice | Deliverable |
|-----------|-------------|
| S6a | Task drawer/modal: create & edit |
| S6b | Field: title, description, priority, due date, labels, assignee |
| S6c | Subtasks + checklist (UI list, checkbox) |
| S6d | Attachments (upload UI, list file mock) |
| S6e | Status: Backlog, Todo, In Progress, Review, Done |
| S6f | Activity log panel (read-only list) |

**View pertama:** **List view** di `/app/projects/[id]/list`

**Acceptance:** CRUD task di list; filter status/assignee/label di toolbar.

---

### S7 — Kanban board

**Referensi README:** §5 Kanban Board (+ Board view §3).

**Depends on:** S6

| Item | Deliverable |
|------|-------------|
| Board layout | Kolom default + custom column UI |
| Drag & drop | Pindah task antar kolom (Vue DnD / sortable) |
| Quick create | Input di bawah kolom |
| WIP limit | Badge + warning saat melebihi limit |
| Filter & search | Toolbar board (assignee, label, teks) |

**Route:** `/app/projects/[id]/board`

**Acceptance:** Drag smooth; status task sinkron dengan kolom; filter mempersempit kartu.

---

### S8 — Komentar & kolaborasi dasar

**Referensi README:** §8 (mentions, comments) — subset MVP.

**Depends on:** S6a (task drawer)

| Item | Deliverable |
|------|-------------|
| Comment thread | Di task drawer |
| @mention | Autocomplete user mock |
| Rich text ringan | Markdown atau TipTap ringan (opsional fase 1) |

**Acceptance:** Tambah/edit/hapus komentar (mock); mention men-styling `@user`.

---

### S9 — Notification (in-app)

**Referensi README:** §12 — channel in-app dulu.

**Depends on:** S2, S8

| Item | Deliverable |
|------|-------------|
| Bell icon + badge count | Header `AppShell` |
| Panel/dropdown daftar notifikasi | Mark read, filter |
| Halaman `/app/notifications` | Full list + pagination mock |
| Link ke task/project | Deep link dari notifikasi |

**Acceptance:** Klik notifikasi membuka konteks yang benar; unread count konsisten (mock store).

---

### S10 — Penutup MVP Phase 1

**Depends on:** S1–S9

| Item | Deliverable |
|------|-------------|
| Integrasi API auth + workspace | Ganti mock → real endpoints |
| Error boundary & toast global | `UApp` + pola error |
| E2E smoke | Login → buat project → task di board → komentar → notifikasi |

**Definition of Done MVP:** README *Phase 1* ter-cover di UI + happy path terhubung backend (minimal).

---

## Phase 2 — Growth (sesuai README *Phase 2*)

Urutan disarankan: **Sprint → Calendar/Timeline → Search → Issue tracking → Productivity → Analytics → Email push**

---

### S11 — Sprint system

**Referensi README:** §6 Sprint System.

**Depends on:** S7, S6

| Sub-slice | Deliverable |
|-----------|-------------|
| S11a | Daftar sprint per project |
| S11b | Sprint planning view (backlog → sprint) |
| S11c | Sprint goal, durasi, active sprint banner |
| S11d | Burndown chart (mock data) |
| S11e | Velocity widget (dashboard + sprint page) |

**Routes:** `/app/projects/[id]/sprints`, `/app/projects/[id]/sprints/[sprintId]`

---

### S12 — Project views tambahan

**Referensi README:** §3 Project View — Calendar, Timeline.

**Depends on:** S6

| View | Route | Catatan |
|------|-------|---------|
| Calendar | `.../calendar` | Task by due date |
| Timeline | `.../timeline` | Gantt ringan / bar horizontal |

**Slice terpisah:** S12a Calendar, S12b Timeline (jangan digabung).

---

### S13 — Issue tracking

**Referensi README:** §7 Issue Tracking.

**Depends on:** S6

| Item | Deliverable |
|------|-------------|
| Issue type | Bug, Feature, Improvement, Research |
| Field khusus | Severity, repro steps, environment |
| Linked issues | Relasi antar task |

**UI:** Tab atau filter di task drawer + badge di board/list.

---

### S14 — Search global

**Referensi README:** §10 Search System.

**Depends on:** S5, S6, S11

| Item | Deliverable |
|------|-------------|
| Command palette / `Cmd+K` | Modal search |
| Filter | project, assignee, status, label, sprint |
| Hasil grouped | Tasks, projects, people |

**Route opsional:** `/app/search?q=`

---

### S15 — Productivity tools

**Referensi README:** §9 Productivity Tools.

**Depends on:** S6, S4

| Halaman | Fitur |
|---------|--------|
| `/app/my-tasks` | Semua task assignee = saya |
| `/app/planner` | Daily planner (mock) |
| Focus mode | Toggle UI minimal distraction |
| Workload | Extend widget dashboard S4 |

---

### S16 — Analytics & notifikasi lanjutan

**Referensi README:** §11 Analytics, §12 Email/Push.

**Depends on:** S11, S9

| Sub-slice | Deliverable |
|-----------|-------------|
| S16a | `/app/analytics` — charts: completed tasks, velocity, team performance |
| S16b | Time tracking UI (entry manual / timer) |
| S16c | Notification settings — email & push toggle |
| S16d | Productivity report export (PDF/CSV placeholder) |

---

## Phase 3 — Future (sesuai README *Phase 3*)

| Slice | Referensi | Catatan |
|-------|-----------|---------|
| S17 | §13 AI Feature | Summarize, sprint summary, breakdown, standup |
| S18 | Automation | Rules, triggers (setelah task/event stabil) |
| S19 | Integrations | GitHub, Slack, webhook |
| S20 | Mobile app | PWA dulu atau native terpisah |
| S21 | Monetization UI | Pricing, plan limit (Free/Pro/Enterprise) |
| S22 | Enterprise | SSO, audit log, custom branding |

**Jangan mulai Phase 3 sebelum Phase 2 stabil di production.**

---

## Ringkasan urutan (cheat sheet)

```
S0  Foundation          ✅
S1  Auth                 ✅
S2  App shell            ✅
S3  Workspace            ✅
S4  Dashboard            ✅
S5  Projects             ⬜
S6  Tasks (list)        ⬜
S7  Kanban board         ⬜
S8  Comments             ⬜
S9  Notifications        ⬜
S10 MVP hardening        ⬜
─── Phase 2 ───
S11 Sprint
S12 Calendar / Timeline
S13 Issue tracking
S14 Global search
S15 Productivity
S16 Analytics + notif lanjutan
─── Phase 3 ───
S17–S22 AI, automation, integrations, mobile, billing, enterprise
```

---

## Template checklist per slice (copy ke PR)

- [ ] Route & layout terdaftar, meta title OK
- [ ] Responsive (sm / md / lg)
- [ ] Dark mode + minimal 1 brand/font preset dicek
- [ ] Empty, loading, error state
- [ ] Mock data / types di `app/types` atau composable
- [ ] Tidak ada hardcode warna di luar semantic tokens
- [ ] Update baris status di tabel **Progress** dokumen ini

---

## Catatan teknis (stack proyek)

- **UI:** Nuxt 4 + `@nuxt/ui` v4, Tailwind v4, semantic colors
- **Form auth:** `useAuthForm`, `auth-form-ui.ts`, validasi (Zod jika dipakai)
- **Theme:** `~/config/theme.ts`, `~/config/fonts.ts`, cookie `theme-brand` / `theme-font`
- **Layout:** `landing` (marketing), `auth` (login flow), `default` + `AppShell` (app)

---

*Terakhir diselaraskan dengan README.md — Development Roadmap Phase 1–3. Phase 0 (S0) selesai — Mei 2026.*
