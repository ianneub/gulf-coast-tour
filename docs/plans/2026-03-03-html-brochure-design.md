# HTML Travel Brochure — Design Doc

**Date:** 2026-03-03
**Status:** Approved

## Summary

Convert the Gulf Coast tour markdown files into a polished static website hosted on GitHub Pages. The site serves as a travel brochure for the 4-person trip group to browse and reference during planning and on the road.

## Approach

Static site generator (Eleventy/11ty) converting existing `.md` files into HTML pages with a shared layout template. Markdown remains the source of truth — edit `.md` files and the site regenerates.

## Aesthetic Direction

**Editorial Travel Journal** — warm, inviting, travel-magazine feel inspired by Condé Nast Traveler. Not corporate, not techy.

### Memorable Element

A visual route timeline connecting all 8 stops, giving a sense of journey progression. Horizontal on desktop, vertical on mobile. Appears as a full route overview on the home page and a progress indicator on leg pages.

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background | Warm cream | `#FDF6EC` |
| Primary text | Deep charcoal | `#2C2C2C` |
| Headlines | Midnight blue | `#1B3A4B` |
| Accent | Sunset coral | `#E07A5F` |
| Secondary | Sea foam | `#81B29A` |
| Card surfaces | White | `#FFFFFF` |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display/Headlines | Playfair Display (serif) | 700–900 |
| Body | Source Sans 3 (sans-serif) | 400, 600 |
| Labels/Nav | Source Sans 3 uppercase tracked | 600 |

Both are Google Fonts.

## Site Structure

### Pages

- **Home** (`overview.md` → `index.html`) — hero, route timeline, destination card grid, trip principles
- **8 leg pages** (`01-south-padre-island.md` through `08-destin-30a.md`) — destination detail with sections for things to do, food, lodging, accessibility
- **Logistics** (`travel-logistics.md`) — flight info, open questions

### Shared Elements

- Sticky nav bar with abbreviated stop names (SPI → SA → HOU → LAF → NOLA → MOB → PNS → 30A)
- Current page highlighted with coral underline
- Prev/Next navigation on leg pages
- Hamburger menu on mobile

### Content Callout Boxes

- **Must-See** — coral accent border
- **Tour Guide Warning** — sea foam accent
- **Hidden Gem** — gold/amber accent

## Technical Setup

### Eleventy Configuration

```
gulf_coast_tour/
├── .eleventy.js              # Config
├── package.json              # eleventy dependency
├── _includes/
│   └── layout.njk            # Shared Nunjucks layout
│   └── home.njk              # Home page layout
├── css/
│   └── style.css             # All styles, single file
├── overview.md               # → index.html
├── 01-south-padre-island.md  # → /01-south-padre-island/
├── ...
├── travel-logistics.md       # → /travel-logistics/
├── CLAUDE.md                 # Excluded from build
└── _site/                    # Generated output (gitignored)
```

### Frontmatter Addition

Each `.md` file gets YAML frontmatter:

```yaml
---
title: "South Padre Island, TX"
leg: 1
order: 1
mustSee: "SpaceX Starship launch"
layout: layout.njk
---
```

### Deployment

- GitHub repository with GitHub Actions workflow
- On push to `main`: run `npx eleventy`, deploy `_site/` to GitHub Pages
- Free hosting, shareable URL

### Responsive Breakpoints

- Desktop: >=1024px — generous margins, multi-column cards, horizontal timeline
- Tablet: 768–1023px — narrower margins, 2-column cards
- Mobile: <768px — single column, vertical timeline, collapsible nav

## Excluded from Build

- `CLAUDE.md` — internal guidance, not trip content
- `docs/` — design docs and plans
- `_site/` — generated output (gitignored)
