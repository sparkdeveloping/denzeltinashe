# Denzel Tinashe — Portfolio

A focused portfolio for ministry, media, and web/mobile product development.

## Direction

The redesign uses an editorial, high-contrast visual system with elastic shapes, spring-based interactions, layered parallax, oversized typography, and custom project artwork. Motion is intentionally scroll-native rather than scroll-hijacked, and the experience respects the user's reduced-motion preference.

The work index includes:

- MealRecap
- BeforeUScroll
- KDYM
- FPC Wichita
- Jesus Revealed Podcast
- Aftershock Ministries
- GoCreate / Wichita State ITS
- Hacia
- PosCloud

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main files

- `app/page.js` — content, projects, interactions, and page structure
- `app/globals.css` — visual system, responsive behavior, and motion styling
- `app/layout.js` — metadata and fonts
- `public/work/` — optimized WebP project images plus original source images

## Deployment

The project is ready for a standard Vercel deployment. Update project copy and links in the `projects` and `practices` arrays near the top of `app/page.js`.
