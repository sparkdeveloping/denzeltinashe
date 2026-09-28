# Denzel Tinashe Portfolio — 2026 Audit

## Goal

The main domain should do one job exceptionally well: convince a person who needs an app or website that Denzel can own the product experience from idea through launch.

Media and ministry remain important parts of Denzel's work, but they should not compete with product development for attention on the main portfolio. They now exit cleanly to:

- `media.denzeltinashe.com`
- `ministry.denzeltinashe.com`

## Executive diagnosis

The previous site was visually expressive and technically competent, but it was positioning three separate practices as equal priorities: ministry, media, and web/mobile. That created an identity problem for a prospective product client. The work was strong, yet the page required the visitor to decide what kind of professional Denzel was before they could decide whether to hire him.

The redesign changes the hierarchy from **"three practices"** to **"one product partner with range."**

The new primary message is:

> Denzel designs and builds polished mobile apps, web apps, and websites from idea through launch.

## What was holding the old site back

### 1. The hero sold range before relevance

**Before:** “Ministry. Media. Web + mobile.”

That is memorable, but a founder, small business, startup, church, or organization looking for a developer has to interpret which part applies to them.

**Change:** The hero now leads with the outcome and service category: “I design & build apps people want to use.” The supporting copy makes the scope explicit: strategy, interface, motion, code, and launch.

### 2. Three equal practices diluted the commercial offer

The previous “Ministry / Media / Web-Mobile” cards gave equal visual weight to three businesses. That made the homepage feel more like a personal universe than a focused product portfolio.

**Change:** Product work is now the center of gravity. Media and ministry are still present, but only as two quiet outbound practice links near the About section.

### 3. The visual language was energetic but not sufficiently product-premium

The old lime/violet/coral palette, large moving blobs, marquee, irregular cards, and mixed illustration styles had personality, but the combined effect leaned creative-studio/editorial rather than high-end product designer/developer.

**Change:** The new system is deliberately monochrome with restrained glass, larger negative space, precise typography, elastic geometry, grayscale-to-color project imagery, and spring motion. The “wow” is meant to come from refinement and interaction quality instead of color volume.

### 4. Projects were numerous but insufficiently ranked

Nine projects appeared in one index with filters. That is good for completeness but weak for persuasion because the strongest work does not get enough narrative priority.

**Change:** Six projects are deliberately featured, with MealRecap and BeforeUScroll given the strongest visual presence. Additional work moves into a compact archive and GitHub entry point.

### 5. App work needed to look more like product work

The strongest differentiator is the ability to design and build actual software. The prior custom artwork was interesting, but sometimes read like campaign art rather than interface proof.

**Change:** MealRecap and BeforeUScroll now use product/device compositions that foreground the interface. Other projects use real screenshots. The visual direction makes apps feel like the premium objects on the page.

### 6. The site did not explicitly explain what a client can hire Denzel to build

Capabilities existed, but the user had to derive the offer from project categories and the About section.

**Change:** A dedicated “What I build” section defines three concrete engagements:

- Mobile apps
- Web apps
- Websites

Each includes the practical scope a client can expect.

### 7. The process was philosophically strong but commercially vague

The old principles (“clarity before decoration,” “motion with purpose,” “systems over one-offs”) were good design values but did not answer the buyer’s question: “What happens if I hire you?”

**Change:** The new operating model is four steps: Define → Design → Build → Polish + launch.

### 8. GitHub was only a footer link

For a developer portfolio, GitHub is proof. The public profile currently shows 40+ repositories, yet that body of work had almost no weight on the homepage.

**Change:** GitHub gets its own archive card plus selected historical code entries. Repositories named Alayna or Lexi are intentionally not surfaced.

### 9. The old About section competed with the buyer journey

Leading with ministry identity is authentic, but on the product homepage it can displace the immediate hiring question.

**Change:** Faith remains visible and direct (“Jesus above all”) but moves into the About narrative after product credibility has already been established.

### 10. The final CTA was too broad

**Before:** “Have a ministry, media, web, or app project?”

That repeated the positioning problem from the top of the page.

**Change:** “Have an app or website in mind? Let’s make it feel finished.” The close is now tied directly to the main commercial goal.

## Technical audit

### Preserved

- Next.js 16 app structure
- Existing `/clients` routes and client portal code
- Existing `/gabby` gallery route
- Existing API routes and portal logic
- Framer Motion dependency
- Resume file
- Existing work screenshots
- Responsive behavior and reduced-motion support

### Improved

- Homepage metadata is now focused on product design/development.
- Open Graph and Twitter metadata now use the new headshot.
- New portrait is extracted from the supplied Nikon NEF and optimized to WebP.
- Navigation and mobile menu remain keyboard-accessible.
- Motion respects `prefers-reduced-motion` via MotionConfig and CSS.
- Project images retain Next/Image optimization.
- Main page remains dependency-neutral: no new packages are required.

### Remaining engineering opportunities after launch

These are not blockers, but they are the next optimization pass:

1. Split the homepage into smaller server/client component boundaries to reduce the amount of JavaScript shipped for mostly-static content.
2. Add real product screenshots/video loops for MealRecap and BeforeUScroll once final assets are available.
3. Add a dedicated case-study route for the top two projects with problem, constraints, decisions, implementation, and outcome.
4. Add Web Analytics / Speed Insights after deployment and tune based on real Core Web Vitals.
5. Replace generic email-only conversion with a short project-intake flow if inbound volume becomes high enough to justify it.
6. Create a purpose-built 1200×630 social sharing image instead of reusing the portrait.

## Content strategy going forward

The homepage should stay selective. New work should only be promoted into the featured grid if it improves one of these signals:

- product strategy
- interface quality
- technical sophistication
- business/organizational outcome
- polish at launch

Everything else can live in GitHub, a case-study archive, the media subdomain, or the ministry subdomain.

## Repository exclusions

Per request, Alayna- and Lexi-related repositories are not promoted anywhere in the redesigned homepage content.
