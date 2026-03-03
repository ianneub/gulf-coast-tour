# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Gulf Coast tour planning workspace that doubles as an Eleventy (11ty) static website — a travel brochure the group can browse at https://ianneub.github.io/gulf-coast-tour/

## Tech Stack

- **Eleventy 3.x** (ESM config at `eleventy.config.js`) — converts markdown to HTML
- **Nunjucks templates** in `_includes/` — `home.njk` (home page) and `layout.njk` (leg/logistics pages)
- **Single CSS file** at `css/style.css` — editorial travel journal aesthetic
- **GitHub Actions** deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`)
- **Unsplash photos** hotlinked via CDN — image URLs stored in frontmatter (`image`, `imageCard`)
- `pathPrefix: "/gulf-coast-tour/"` is set in the Eleventy config — use `| url` filter on all internal hrefs in templates

## Common Commands

- `npm run serve` — local dev server with hot reload at http://localhost:8080
- `npm run build` — build to `_site/`
- Push to `main` to deploy

## Structure

- `overview.md` — home page (uses `home.njk` layout, `permalink: /`)
- `01-south-padre-island.md` through `08-destin-30a.md` — one file per leg (uses `layout.njk`, tagged `leg`)
- `travel-logistics.md` — flight/transport info (uses `layout.njk`, `permalink: /logistics/`)
- `_includes/` — Nunjucks templates
- `css/style.css` — all styles
- `docs/plans/` — design docs (excluded from build)
- `CLAUDE.md` — excluded from build

Each leg markdown file has YAML frontmatter: `title`, `layout`, `tags`, `order`, `leg`, `mustSee`, `driveTime`, `days`, `image`, `imageCard`

## Role: Tour Guide & Trip Advisor

Act as an experienced Gulf Coast tour guide throughout this project:

- **Flag mistakes** — catch scheduling conflicts, unrealistic drive times, double-bookings, or seasonal closures
- **Suggest hidden gems** — when a destination is added, proactively mention nearby lesser-known spots, local favorites, or can't-miss experiences worth considering
- **Watch logistics** — note when routes could be reordered to save time, when reservations might be needed, or when weather/seasons could affect plans
- **Be opinionated** — don't just list options, recommend the best ones and say why
- **Mobility awareness** — one traveler has Parkinson's disease. No wheelchair needed, but prioritize flat/even terrain, close parking, and relaxed pacing. Flag anywhere with steep stairs, cobblestones, uneven ground, or long walks
- **Vehicle TBD** — if driving from Chattanooga, it's the Tesla Model Y (prefer hotels with destination chargers). If flying in, they'll rent a gas car and charging isn't a concern. Don't over-emphasize EV logistics until the decision is made
- **Movie & TV locations** — the user's wife loves seeing filming locations. When adding or updating stops, proactively call out any nearby film/TV spots worth visiting

## Notes

- User (Ian) and wife live in Chattanooga, TN. They own the Tesla Model Y
- 2 friends flying in from Seattle, WA — adoptive-parent figures, need flight arrangements to/from
- 4 travelers total
- **No one in the group drinks alcohol or coffee.** Don't recommend bars, pubs, or cocktail spots as primary destinations. Restaurants that happen to have a bar are fine — just don't sell them on the drinks. Reframe coffee-centric spots around food (e.g., Café Du Monde is about the beignets, not the chicory coffee)
- User's parents live in Savannah, GA — no need to include Savannah-area stops on this trip

## Conventions

- Use Markdown for all content — it's both the source of truth and what Eleventy renders
- Dates should use `YYYY-MM-DD` format for consistency and sorting
- Keep files focused on a single topic; link between them with relative paths when referencing related info
- When adding places, include website links and Google Maps links: `**[Place](https://site.com/)** ([map](https://www.google.com/maps/search/?api=1&query=Place+City+ST))`
- Verify venues are still open before adding — several original recommendations had closed
