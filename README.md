# Molaryx Frontend

A production-oriented full-stack SaaS project built from scratch, covering frontend, backend, database, authentication, real-time notifications, containerization and cloud deployment.

This repository is the **frontend**: a Next.js panel for specialty clinics. Patients, scheduling, appointments, clinical records, payments, procedures, treatments, team, and a platform admin for tenants. The UI is scoped per clinic, not built for a single client.

**Feature-Sliced Design** with Next.js 16, React 19, TypeScript, Redux Toolkit, and SignalR.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind, Radix / shadcn |
| State | Redux Toolkit (one slice per domain) |
| Forms | Zod, react-hook-form |
| Realtime | SignalR (`@microsoft/signalr`) |
| Calendar | `@dnd-kit` (day, week, month, resource views) |
| Charts | Recharts |
| Landing | GSAP |

The API lives in a separate repo (`molaryx-admin`): ASP.NET Core, PostgreSQL, JWT, permission policies. This app consumes that API. It does not decide what a role can do.

## Product

The panel covers the clinic workflow from patient intake to billing:

- **Patients:** profile, identification, history linked to appointments and treatments
- **Appointments:** calendar (day, week, month, by professional), lifecycle statuses
- **Clinical records:** reason, diagnosis, evolution; PDF export from the API
- **Procedures and treatments:** clinic catalogs, prices, duration, per-patient plans
- **Payments:** charges tied to care, outstanding balances, exportable reports
- **Team:** owner, professional, assistant; member management
- **Platform:** superadmin tenants, plans, and subscriptions
- **Notifications:** live updates in the header via SignalR

There are two shells: `/dashboard` for the clinic and `/platform` for superadmin. Each has its own layout, guard, and sidebar.

Public routes: landing, plans, sign-in, sign-up, forgot/reset password.

## Architecture (Feature-Sliced Design)

`app/` stays thin. Pages import a feature template. Business UI lives under `features/`.

```
src/
├── app/                              # Next.js App Router
│   ├── (landing)/                    # marketing and public plans
│   ├── (authentication)/             # sign-in, sign-up, forgot/reset password
│   ├── dashboard/                    # clinic panel (protected)
│   │   ├── layout.tsx                # header + sidebar
│   │   ├── page.tsx                  # home charts
│   │   ├── patients/, appointments/, clinical-records/
│   │   ├── payments/, procedures/, treatments/
│   │   ├── patient-treatments/, team/, account/
│   │   └── [...slug]/page.tsx
│   ├── platform/                     # superadmin
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── tenants/page.tsx
│   └── layout.tsx                    # Providers + AuthGuard
├── features/
│   ├── landing/
│   ├── authentication/
│   ├── dashboard/
│   │   ├── template/                 # shell + RouteGuard
│   │   ├── components/
│   │   ├── guards/
│   │   ├── utils/                    # permission checks, route access
│   │   └── modules/                  # one module per domain
│   ├── platform/modules/tenants/
│   ├── notifications/                # SignalR + UI
│   └── public-plans/
├── store/                            # Redux Toolkit
├── components/ui/                    # Radix + shadcn
├── guard/                            # AuthGuard
├── lib/api/                          # ApiClient + error handler
└── consts/                           # permissions, roles, sidebar
```

Dashboard module layout (only the folders the feature needs):

```
features/dashboard/modules/<feature>/
├── actions/           # Server Actions ('use server') calling the API
├── template/          # page orchestrator (list, modals, local state)
├── components/
├── schemas/           # Zod + react-hook-form
├── interfaces/
├── hooks/
├── consts/
└── index.ts
```

## State, permissions, and routes

On sign-in the API returns the user's permissions for that role. The frontend does not hardcode what each role can do. It reads that list and adapts the UI.

`hasRouteAccess`, `checkCanCreate`, and `checkCanUpdate` hide sidebar items, routes, and buttons. That is presentation only. The API still returns **403** if someone calls an endpoint without permission.

Redux holds domain slices: patients, appointments, payments, clinical records, notifications, and so on.

## Heavier UI

- **Appointment calendar:** day / week / month / resource views, drag and drop, context menu, create/edit modals, data loaded by date range
- **Dashboard home:** Recharts summaries (appointments by procedure, revenue by period)
- **Clinical records:** multi-field forms, detail modal, PDF from the API
- **Landing:** GSAP, hero video, product mockups

## Realtime

SignalR sits behind a reusable hook and a context provider. Notifications show up in the dashboard and platform headers. Users can mark one as viewed or mark all.

Hub methods on the API: `mark_as_viewed`, `mark_all_as_viewed`.

## Getting started

### Requirements

- Node.js 24.19.0+
- [pnpm](https://pnpm.io/) (this repo uses `pnpm-lock.yaml`)
- A running Molaryx API (default frontend port is **3001**)

### Configuration

```bash
cp .env.example .env
```

Fill `URL` / `URN` with the API origin, plus the path keys (`SIGN_IN`, `GET_PATIENTS`, `WEB_SOCKET_NOTIFICATION`, and the rest). Those keys map to `api/v1/...` routes on the backend.

### Run

```bash
pnpm install
pnpm dev
```

App: `http://localhost:3001`

```bash
pnpm lint
pnpm build
```

## CI/CD

Production deploys only on Git tags (`v*`) that point to a commit on `main`. A tag from another branch aborts.

```
push tag v* → verify main → vercel pull → vercel build → vercel deploy --prebuilt --prod
```

The build runs in GitHub Actions. Vercel gets a prebuilt bundle; it does not rebuild on its side. Backend and frontend can version independently. Same rule in both repos: a `v*` tag on `main` ships to production.

| | |
|---|---|
| Trigger | Tag `v*` on `main` |
| Build | GitHub Actions + Vercel CLI |
| Target | Vercel Production |
| Artifact | Prebuilt (`--prebuilt`) |

## License

**All Rights Reserved.**

This project is published for portfolio and technical review purposes only.
See the [LICENSE](LICENSE) file for the full terms.
