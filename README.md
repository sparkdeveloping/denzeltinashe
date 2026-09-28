# Denzel Tinashe Portfolio — V2.4

Proof-first product design + engineering portfolio built with Next.js.

## Main routes

- `/` — portfolio homepage
- `/work/mealrecap`
- `/work/spotly`
- `/work/gocreate-insights`
- `/work/beforeuscroll`
- `/start` — structured project inquiry
- `/clients` — preserved client portal
- `/gabby` — preserved client gallery

## Run

```bash
npm ci
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Inquiry delivery

The `/start` form uses `/api/inquiry`. Configure `RESEND_API_KEY` and preferably a verified `PROJECT_INQUIRY_FROM` sender in Vercel. `PROJECT_INQUIRY_TO` defaults to `denzelnyatsanza@gmail.com`.

If Resend is not configured, the interface provides a pre-filled email fallback rather than reporting false success.

## SEO / discovery

V2.4 includes metadata, canonical URLs, JSON-LD, `robots.txt`, `sitemap.xml`, web manifest, and dedicated Open Graph images for the homepage and featured case studies.

## Preserved private/client functionality

Client portal APIs, client workspace components, Gabby gallery routes, and client asset behavior were preserved. Client/Gabby routes remain excluded from indexing.

See `V2.4_TRANSFORMATION_AUDIT.md` for the applied audit and remaining release QA.
