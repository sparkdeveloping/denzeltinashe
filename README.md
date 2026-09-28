# Denzel Tinashe — Product Portfolio

A product-focused Next.js portfolio for Denzel Tinashe, centered on mobile apps, web apps, and websites.

## Positioning

The main domain is intentionally focused on product design and development. Media and ministry are routed to dedicated subdomains so the primary portfolio remains clear for people looking to hire Denzel to design and build software.

## Featured work

- MealRecap
- BeforeUScroll
- KDYM
- HACIA
- Aftershock
- GoCreate / Wichita State ITS

A compact archive links to additional work and the broader GitHub profile.

## Visual system

- monochrome product aesthetic
- responsive oversized typography
- elastic / rubber geometry
- spring-based interactions
- glass navigation
- grayscale-to-color project imagery
- device-based app compositions
- native scrolling
- reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Important files

- `app/page.js` — redesigned public homepage
- `app/globals.css` — visual system and responsive behavior
- `app/layout.js` — SEO and social metadata
- `public/portrait-2026.webp` — optimized headshot extracted from the supplied RAW file
- `PORTFOLIO_AUDIT_2026.md` — full audit and rationale
- `REDESIGN_NOTES.md` — implementation notes

## Existing routes preserved

The redesign does not remove the existing client portal, API routes, or gallery routes contained in this project.

## Subdomains

The main portfolio links out to:

- `media.denzeltinashe.com`
- `ministry.denzeltinashe.com`

Those subdomains must be configured at the hosting / DNS layer to resolve to their respective projects.
