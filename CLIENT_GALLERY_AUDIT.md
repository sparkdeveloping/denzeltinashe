# DenzelTinashe.com audit + Gabby client gallery

## Current site audit

### What is already strong
- **Positioning is immediate.** “Ministry. Media. Web + mobile.” communicates the three-practice model in the first viewport.
- **The visual identity is recognizable.** Warm paper, ink, lime/violet/coral accents, oversized typography, elastic corner geometry, and purposeful motion give the portfolio a clear authored feel.
- **The work section has proof.** Project cards connect capabilities to shipped products and ministry/media work instead of relying on generic service claims.
- **Responsive and motion preferences are considered.** The existing CSS has dedicated tablet/mobile layouts, `prefers-reduced-motion`, and coarse-pointer handling.
- **Deployment health is clean.** The connected Vercel project currently reports no runtime errors in the last seven days.

### Highest-priority improvements to the main portfolio
1. **Reduce the client-side surface area.** `app/page.js` is a 679-line client component and the homepage is wrapped in Framer Motion. Static copy, project metadata, and most layout can be Server Components; only filters, magnetic interactions, and scroll animation need client islands. This is the largest architectural/performance opportunity.
2. **Split the monolith.** The homepage currently combines navigation, hero, artwork, filtering, about, and contact logic in one file, with a 1,204-line global stylesheet. Component-level files/CSS would make the visual system easier to evolve without regressions.
3. **Protect the hero hierarchy.** The current hero is strong but asks the visitor to process the three-line headline, portrait, two orbit labels, eyebrow, paragraph, two CTAs, and scroll cue at once. A future revision should preserve the headline and remove one or two secondary signals.
4. **Standardize portfolio art direction.** Real screenshots and custom illustrated product mockups currently use different visual vocabularies. A consistent framing system (crop rules, border treatment, labels, motion behavior) would make the work grid feel even more premium.
5. **Trim expensive decorative effects.** The moving 360px cursor aura, multiple fixed/blurred layers, backdrop blur, and continuous animations are visually useful but can be expensive on lower-power desktop GPUs. The mobile/coarse-pointer safeguards are good; desktop can still be simplified.
6. **Expand social/SEO metadata.** Basic metadata is present. Add a dedicated OG image, Twitter card metadata, canonical URL, and Person/ProfessionalService JSON-LD for a more complete public-facing setup.
7. **Keep client delivery distinct from the portfolio.** A photography delivery page should inherit brand DNA, not the portfolio’s full interaction density. The photographs need to dominate.

## Direction chosen for client.denzeltinashe.com/gabby

The gallery is designed as an **editorial client-delivery experience** rather than a generic proofing dashboard:
- same warm paper / dark ink / lime-accent brand DNA as the main portfolio
- calmer motion and almost no decorative UI over the photographs
- full-screen portrait-led cover
- oversized “Gabby.” typography
- responsive editorial photo grid that respects portrait and landscape orientation
- click-to-enlarge lightbox with keyboard navigation
- individual download controls on every image
- one-click ZIP for the entire delivered set
- `noindex`, `nofollow`, `noarchive`, and `noimageindex` directives so the gallery is not intended for search discovery

## Image delivery strategy

The supplied originals are approximately 280 MB total and include files as large as ~17 MB. Shipping those directly inside the main Next.js deployment would make deployments and client browsing unnecessarily heavy.

The implementation therefore creates:
- **1600px previews** for fast gallery browsing — about 3.6 MB total
- **3600px high-quality JPEG delivery files** — about 38 MB total
- **Gabby-Final-Gallery.zip** containing all 28 delivery files — about 38 MB

3600px is appropriate for high-quality digital delivery and substantial print sizes while keeping the gallery practical. Keep the supplied original archive as the archival master. If the client portal must deliver the original 4128×6192 / 6192×4128 Lightroom exports, move originals to object storage (Vercel Blob, Cloudflare R2, S3, etc.) rather than bundling them with the Next.js deployment.

## Files added
- `app/gabby/page.js`
- `app/gabby/GabbyGallery.js`
- `app/gabby/gabby.module.css`
- `public/client/gabby/preview/*` — 28 gallery previews
- `public/client/gabby/downloads/*` — 28 downloadable delivery files
- `public/client/gabby/Gabby-Final-Gallery.zip`
- `next.config.mjs` — gallery privacy/cache/download headers

## Deployment / subdomain setup

1. Deploy this code to the existing `denzeltinashe` Vercel project.
2. In Vercel → Project → Settings → Domains, add `client.denzeltinashe.com`.
3. If DNS is managed outside Vercel, create the CNAME value Vercel requests for `client`.
4. The gallery URL will be `https://client.denzeltinashe.com/gabby`.
5. Verify an individual image download and the ZIP download after production deployment.

### Optional privacy upgrade
`noindex` makes the gallery unlisted from search, not authenticated. If the gallery needs genuine access control, add a password/token gate before sharing the URL.
