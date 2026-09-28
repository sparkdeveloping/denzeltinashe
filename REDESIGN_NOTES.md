# Redesign Notes

## Visual direction

The new homepage uses a monochrome, high-precision product aesthetic: soft off-white backgrounds, deep black surfaces, large negative space, restrained glass, grayscale imagery, thin borders, elastic corner geometry, and spring interactions.

It is intentionally Apple-adjacent in product discipline rather than an Apple clone. The goal is to communicate taste, restraint, systems thinking, and build quality.

## Homepage architecture

1. Product-focused hero
2. Capability proof strip
3. Selected product / web work
4. Concrete service offers
5. Define → Design → Build → Polish + launch process
6. Work archive + GitHub
7. About
8. Separate media and ministry practice links
9. Focused app / website CTA

## Headshot

The supplied Nikon `.NEF` contained an embedded full-resolution preview. That preview was extracted and optimized to `public/portrait-2026.webp` without altering the source RAW file.

## Subdomains

The homepage links to:

- `https://media.denzeltinashe.com`
- `https://ministry.denzeltinashe.com`

DNS/deployment for those subdomains is outside this code package and still needs to point to the respective deployed sites.

## GitHub

Homepage code links to `https://github.com/sparkdeveloping` and surfaces a small curated archive. Alayna and Lexi repositories are not included.
