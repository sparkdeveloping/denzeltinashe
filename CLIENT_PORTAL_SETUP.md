# Denzel Tinashe Client Portal

This build adds a private client/work operating system to the existing `denzeltinashe.com` Next.js project.

## What is included

- `clients.denzeltinashe.com` host routing through Next.js Proxy.
- Private sign-in with signed, HTTP-only session cookies.
- Owner and read-only client roles.
- Multi-client dashboard.
- New-client workspace creation.
- Quarter Athletic workspace at `/qa`.
- Quarter Athletic original meeting-note image stored behind an authenticated API route.
- Overview, Discovery, Meetings, Requirements, MVP, Tasks, Documents, Activity and owner-only Financials sections.
- Confirmed vs proposed requirements.
- Internal vs client-visible records.
- Editable requirements and task statuses.
- Quick-add forms for meetings, requirements, tasks, documents and activity.
- Local JSON persistence for development.
- Optional Upstash Redis persistence for Vercel/production without adding another npm package.

## URLs

When opened on your primary domain:

- `https://denzeltinashe.com/clients`
- `https://denzeltinashe.com/clients/qa`

After adding `clients.denzeltinashe.com` to the same Vercel project:

- `https://clients.denzeltinashe.com`
- `https://clients.denzeltinashe.com/qa`
- `https://clients.denzeltinashe.com/qa/discovery`
- `https://clients.denzeltinashe.com/qa/requirements`
- `https://clients.denzeltinashe.com/qa/tasks`

`proxy.js` rewrites the clean subdomain paths internally to `/clients/...`, so the public portfolio remains unchanged.

## 1. Environment variables

Copy `.env.example` to `.env.local`.

Set a long random session secret:

```env
PORTAL_SESSION_SECRET=replace-this-with-a-long-random-secret
```

Define portal users with server-only JSON:

```env
PORTAL_USERS_JSON=[{"email":"your-email@example.com","password":"use-a-strong-password","name":"Denzel","role":"owner"},{"email":"client@example.com","password":"another-strong-password","name":"Quarter Athletic","role":"client","clientSlug":"quarter-athletic"}]
```

Rules:

- `role: "owner"` can see every client, internal records and financials, and can edit portal data.
- `role: "client"` is read-only and only has access to the workspace identified by `clientSlug`.
- Do not prefix these values with `NEXT_PUBLIC_`.
- Do not commit `.env.local`.

If `PORTAL_USERS_JSON` is omitted in local development only, the fallback login is:

- Email: `admin@local.dev`
- Password: `portal-dev-only`

There is no fallback production login.

## 2. Persistent production data

Locally, the portal reads/writes:

```text
data/portal.json
```

That is intentionally convenient for development, but a Vercel function filesystem is not a persistent database.

For production edits, connect an Upstash Redis database and set:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

The portal will automatically seed Redis from `data/portal.json` the first time the key is missing. After that, the Redis copy is the source of truth.

If neither Upstash variable is configured in production on Vercel, read access still works from the seed file, but edit requests intentionally fail with a configuration error rather than pretending data was permanently saved.

## 3. Add the clients subdomain in Vercel

In the Vercel project that currently serves `denzeltinashe.com`:

1. Open Project Settings.
2. Open Domains.
3. Add `clients.denzeltinashe.com`.
4. Configure the DNS record Vercel requests.
5. Keep the existing `denzeltinashe.com` domain on the same project.

No separate deployment is required for the portal unless you later decide to split it into its own app.

## 4. Quarter Athletic workspace

The initial workspace is seeded from the discovery work already completed.

Core route:

```text
/qa
```

Sections:

```text
/qa
/qa/discovery
/qa/meetings
/qa/requirements
/qa/mvp
/qa/tasks
/qa/documents
/qa/activity
/qa/financials   # owner only
```

The original handwritten note is not stored in `public/`. It lives at:

```text
data/files/quarter-athletic/original-meeting-notes.png
```

and is served through:

```text
/api/portal/file/quarter-athletic/original-meeting-notes.png
```

The file API requires a valid portal session and checks that client-role users are authorized for that client.

## 5. Data structure

The current portal seed lives in `data/portal.json` and is intentionally human-readable.

Each client can contain:

```text
client identity
project metadata
facts
objective
principles
workflow
progress
next actions
original meeting source
confirmed statements
interpretation
uncertain notes
deep-dive questions
meetings
requirements
MVP scope
tasks
documents
financial working notes
activity history
```

Items such as tasks, documents, requirements, meetings and activity can use:

```json
{ "visibility": "client" }
```

or:

```json
{ "visibility": "internal" }
```

Internal records are filtered out for client-role sessions.

## 6. What the current editor supports

Owner accounts can currently:

- Create a client workspace.
- Add meetings.
- Add requirements.
- Change requirement status.
- Delete requirements.
- Add tasks.
- Move tasks between statuses.
- Delete tasks.
- Add document links.
- Delete document links.
- Add activity entries.

The portal is intentionally not a full CMS yet. The goal of this version is to make the Quarter Athletic engagement usable immediately without building an entire admin platform before the actual client product starts.

## 7. Recommended next portal upgrades

After the Quarter Athletic discovery workflow is stable, the best next upgrades are:

1. Auth provider or database-backed user management.
2. Object storage uploads for documents and images.
3. Rich meeting notes and decision records.
4. Client approvals / sign-off records.
5. Milestone and invoice management.
6. GitHub/Vercel deployment links per project.
7. Time tracking.
8. Project templates so a new client starts with the right structure automatically.
9. Email notifications when something is waiting on a client.
10. Search across all client work.

## 8. Important separation

This portal manages **your relationship and work with Quarter Athletic**.

It should not become Quarter Athletic's eventual 52-person production ERP.

A clean long-term structure is:

```text
clients.denzeltinashe.com/qa
    Your discovery, requirements, meetings, scope, tasks, commercial history and deliverables.

app.quarterathletic.com
    Quarter Athletic's actual operations platform for projects, teams, quotes, invoices, production, QA and shipping.
```

That separation protects ownership, permissions, deployment and company data boundaries.

## 9. Run locally

Use the existing project commands:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000/clients
```

The existing project currently declares Next.js `16.1.1`. Before a production launch, update Next.js and related packages to a currently supported patched release and test the project after the upgrade.

## Files added for the portal

```text
app/clients/
app/api/portal/
components/portal/
lib/portal/
data/portal.json
data/files/quarter-athletic/original-meeting-notes.png
proxy.js
.env.example
CLIENT_PORTAL_SETUP.md
```

`next.config.mjs` was also updated to add private/no-index portal headers while retaining the existing Gabby gallery headers.
