# Design direction: Elastic conviction

## Positioning

The portfolio now leads with three practices:

1. Ministry
2. Media
3. Web / mobile app development

The central message is not “I can do many things.” It is: **I build digital work that serves people, carries conviction, and feels impossible to ignore.**

## Visual system

The visual language combines:

- oversized editorial typography
- irregular “rubber” corner geometry
- morphing portrait and footer shapes
- spring-based magnetic links and hover states
- layered, scroll-linked parallax
- a high-contrast ink / warm-paper palette
- lime, violet, and coral practice colors
- custom product artwork for MealRecap, BeforeUScroll, KDYM, Jesus Revealed Podcast, and PosCloud

The result is intentionally unusual without becoming difficult to navigate.

## Interaction rules

- Native scrolling is preserved; the page does not hijack the wheel.
- Parallax is layered around content rather than used as a substitute for content.
- Most motion relies on transforms and opacity.
- Reduced-motion preferences are respected through MotionConfig and CSS.
- Mobile removes cursor effects and rearranges all major layouts into one column.

## Portfolio architecture

### Hero
Immediate positioning around ministry, media, and web/mobile products.

### Three practices
Large elastic panels explain the value and show recognizable proof.

### Selected work
A filterable project index featuring all existing work plus the newer products:

- MealRecap
- BeforeUScroll
- KDYM
- FPC Wichita
- Jesus Revealed Podcast
- Aftershock Ministries
- GoCreate / Wichita State ITS
- Hacia
- PosCloud

### About / approach
Faith, process, capabilities, and execution principles.

### Contact
A high-impact close with a direct email action and social links.

## Research references

- Awwwards animation gallery: https://www.awwwards.com/websites/animation/
- Awwwards scrolling gallery: https://www.awwwards.com/websites/scrolling/
- Awwwards typography collection: https://www.awwwards.com/awwwards/collections/typography-in-web-design/
- Motion performance guidance: https://motion.dev/docs/performance
- Motion scroll animation guidance: https://motion.dev/docs/react-scroll-animations
- W3C guidance on animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
