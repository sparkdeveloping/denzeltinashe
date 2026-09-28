# V2 Implementation Notes

## Primary changes

- Rebuilt homepage around product proof rather than a generic project grid.
- Added four dedicated case-study routes:
  - `/work/mealrecap`
  - `/work/spotly`
  - `/work/gocreate-insights`
  - `/work/beforeuscroll`
- Added product-specific art direction and interaction states.
- Separated websites from app/platform case studies.
- Expanded the deployed website proof to include FPC Wichita, St. Mark Cathedral COGIC, POM Church, Oil City Church, Calvary Apostolic Church, KDYM, HACIA, and Aftershock.
- Added explicit **Live** and **Source** actions to website cards so deployed work and public repositories are both visible.
- Moved the portrait to About so product work leads the first impression.
- Added explicit ownership and technical proof beside featured work.
- Added a five-step client/product process.
- Kept Media and Ministry as small outbound destinations:
  - `media.denzeltinashe.com`
  - `ministry.denzeltinashe.com`
- Preserved existing client portal and gallery route trees.
- Explicitly excluded Alayna and Lexi from the portfolio.

## Files added / changed

- `app/page.js` — complete V2 homepage.
- `app/home.module.css` — scoped V2 visual system.
- `app/layout.js` — revised metadata + system typography.
- `app/work/[slug]/page.js` — case-study route.
- `app/work/[slug]/work.module.css` — case-study visual system.
- `data/portfolio.js` — featured work, capability, process data.
- `COMPETITIVE_AUDIT_2026.md` — external + GitHub benchmark.

## Design intent

This is deliberately not an Apple.com clone. It uses the more durable parts of Apple's design logic: content hierarchy, restraint, physical feedback, negative space, attention to small details, and simple controls. The product stories are allowed to carry more visual identity than the surrounding shell.

## Replaceable visual surfaces

The art-directed product interfaces on the homepage are intentionally component/CSS representations. When final current screenshots are available for MealRecap, Spotly, GoCreate Insights, and BeforeUScroll, those can be dropped into the large product stages without changing the underlying page architecture.

## Contact

The current CTA uses `denzelnyatsanza@gmail.com` because that was already present in the supplied project. Change it globally if a dedicated business email is preferred.
