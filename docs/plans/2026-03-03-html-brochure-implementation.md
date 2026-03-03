# HTML Travel Brochure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert Gulf Coast tour markdown files into a polished Eleventy static site with an editorial travel magazine aesthetic, deployed to GitHub Pages.

**Architecture:** Eleventy (11ty) converts existing `.md` files into HTML using a shared Nunjucks layout. A single CSS file handles all styling. GitHub Actions builds and deploys to GitHub Pages on push to `main`.

**Tech Stack:** Eleventy 3.x, Nunjucks templates, vanilla CSS (no framework), Google Fonts (Playfair Display + Source Sans 3), GitHub Actions for CI/CD.

---

### Task 1: Initialize Node.js project and Eleventy

**Files:**
- Create: `.tool-versions`
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.gitignore`

**Step 1: Set Node.js version**

```bash
cd /Users/ianneub/Downloads/gulf_coast_tour
asdf set nodejs 22.12.0
```

Using Node 22 LTS for stability with Eleventy 3.x.

**Step 2: Initialize npm and install Eleventy**

```bash
npm init -y
npm install @11ty/eleventy
```

**Step 3: Create `.eleventy.js` config**

```js
module.exports = function(eleventyConfig) {
  // Pass through CSS
  eleventyConfig.addPassthroughCopy("css");

  // Exclude non-content files from build
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add("node_modules/**");

  // Collections: legs sorted by order
  eleventyConfig.addCollection("legs", function(collectionApi) {
    return collectionApi.getFilteredByTag("leg").sort((a, b) => {
      return (a.data.order || 0) - (b.data.order || 0);
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    markdownTemplateEngine: "njk"
  };
};
```

**Step 4: Create `.gitignore`**

```
node_modules/
_site/
.DS_Store
```

**Step 5: Add build scripts to `package.json`**

Add to the `"scripts"` section:

```json
{
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  }
}
```

**Step 6: Verify Eleventy runs**

Run: `npm run build`
Expected: Build succeeds, `_site/` directory created with HTML files.

**Step 7: Commit**

```bash
git init
git add .tool-versions package.json package-lock.json .eleventy.js .gitignore
git commit -m "chore: initialize Eleventy project"
```

---

### Task 2: Add frontmatter to all markdown files

**Files:**
- Modify: `overview.md` (add frontmatter)
- Modify: `01-south-padre-island.md` (add frontmatter)
- Modify: `02-san-antonio.md` (add frontmatter)
- Modify: `03-houston.md` (add frontmatter)
- Modify: `04-cajun-country.md` (add frontmatter)
- Modify: `05-new-orleans.md` (add frontmatter)
- Modify: `06-mississippi-mobile.md` (add frontmatter)
- Modify: `07-pensacola.md` (add frontmatter)
- Modify: `08-destin-30a.md` (add frontmatter)
- Modify: `travel-logistics.md` (add frontmatter)

**Step 1: Add frontmatter to `overview.md`**

Prepend to file:

```yaml
---
title: "Gulf Coast Tour"
layout: home.njk
permalink: /
---
```

**Step 2: Add frontmatter to each leg file**

Prepend YAML frontmatter to each file. Example for `01-south-padre-island.md`:

```yaml
---
title: "South Padre Island, TX"
layout: layout.njk
tags: leg
order: 1
leg: 1
mustSee: "SpaceX Starship launch (if timing works)"
driveTime: "Starting point"
days: "0–1"
---
```

Repeat for all 8 legs with correct values:

| File | title | order | leg | mustSee | driveTime | days |
|------|-------|-------|-----|---------|-----------|------|
| 01 | South Padre Island, TX | 1 | 1 | SpaceX Starship launch (if timing works) | Starting point | 0–1 |
| 02 | San Antonio, TX | 2 | 2 | The Alamo & San Antonio Missions (UNESCO) | ~4.5 hrs from SPI | 2–3 |
| 03 | Houston, TX | 3 | 3 | Space Center Houston | ~3 hrs from SA | 3–4 |
| 04 | Lafayette / Cajun Country, LA | 4 | 4 | Boudin Trail & Vermilionville | ~3.5 hrs from Houston | 5 |
| 05 | New Orleans, LA | 5 | 5 | National WWII Museum & Commander's Palace | ~2.5 hrs from Lafayette | 6–7 |
| 06 | Gulf Coast MS & Mobile, AL | 6 | 6 | Ocean Springs art walk & Mobile Carnival Museum | ~2.5 hrs from NOLA | 8 |
| 07 | Pensacola, FL | 7 | 7 | National Naval Aviation Museum (free!) | ~1 hr from Mobile | 9 |
| 08 | Destin / 30A, FL | 8 | 8 | Seaside (The Truman Show filming location) | ~1 hr from Pensacola | 10 |

**Step 3: Add frontmatter to `travel-logistics.md`**

```yaml
---
title: "Travel Logistics"
layout: layout.njk
permalink: /logistics/
---
```

**Step 4: Verify build still works**

Run: `npm run build`
Expected: Build succeeds with all pages generated.

**Step 5: Commit**

```bash
git add overview.md 0*.md travel-logistics.md
git commit -m "content: add frontmatter to all markdown files"
```

---

### Task 3: Create the shared layout template

**Files:**
- Create: `_includes/layout.njk`

**Step 1: Create `_includes/` directory**

```bash
mkdir -p _includes
```

**Step 2: Create `_includes/layout.njk`**

This is the shared template for all leg pages and the logistics page. Includes Google Fonts, sticky nav, route progress bar, prev/next navigation, and footer.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} — Gulf Coast Tour</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="/" class="nav-brand">Gulf Coast Tour</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        {%- for leg in collections.legs %}
        <li><a href="{{ leg.url }}" {% if leg.url == page.url %}class="active"{% endif %}>{{ leg.data.title | replace(", TX", "") | replace(", LA", "") | replace(", FL", "") | replace(", AL", "") | replace("Gulf Coast MS & Mobile", "MS & Mobile") | replace("Lafayette / Cajun Country", "Cajun Country") | replace("Destin / 30A", "30A") }}</a></li>
        {%- endfor %}
        <li><a href="/logistics/" {% if page.url == "/logistics/" %}class="active"{% endif %}>Logistics</a></li>
      </ul>
    </div>
  </nav>

  {% if tags and tags.includes("leg") %}
  <div class="route-progress">
    <div class="route-progress-inner">
      {%- for stop in collections.legs %}
      <div class="route-stop {% if stop.data.order == order %}current{% elif stop.data.order < order %}visited{% endif %}">
        <div class="route-dot"></div>
        <span class="route-label">{{ stop.data.order }}</span>
      </div>
      {%- if not loop.last %}<div class="route-line {% if stop.data.order < order %}visited{% endif %}"></div>{% endif %}
      {%- endfor %}
    </div>
  </div>
  {% endif %}

  <main class="content">
    <header class="page-header">
      <h1>{{ title }}</h1>
      {% if days %}<p class="page-meta">Days {{ days }} · {{ driveTime }}</p>{% endif %}
      {% if mustSee %}<div class="callout callout-must-see"><strong>Must-See:</strong> {{ mustSee }}</div>{% endif %}
    </header>

    <article class="page-body">
      {{ content | safe }}
    </article>

    {% if tags and tags.includes("leg") %}
    <nav class="prev-next">
      {%- set prevLeg = collections.legs | selectattr("data.order", "equalto", order - 1) | first %}
      {%- set nextLeg = collections.legs | selectattr("data.order", "equalto", order + 1) | first %}
      {% if prevLeg %}<a href="{{ prevLeg.url }}" class="prev-next-link prev">&larr; {{ prevLeg.data.title }}</a>{% endif %}
      {% if nextLeg %}<a href="{{ nextLeg.url }}" class="prev-next-link next">{{ nextLeg.data.title }} &rarr;</a>{% endif %}
    </nav>
    {% endif %}
  </main>

  <footer class="footer">
    <p>Gulf Coast Tour — South Padre Island to the Emerald Coast</p>
  </footer>

  <script>
    document.getElementById('nav-toggle').addEventListener('click', function() {
      document.getElementById('nav-links').classList.toggle('open');
    });
  </script>
</body>
</html>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Leg pages render with the layout.

**Step 4: Commit**

```bash
git add _includes/layout.njk
git commit -m "feat: add shared layout template with nav and route progress"
```

---

### Task 4: Create the home page layout

**Files:**
- Create: `_includes/home.njk`

**Step 1: Create `_includes/home.njk`**

The home page has a hero section, route timeline with destination cards, and the remaining overview content.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gulf Coast Tour</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="home">
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="/" class="nav-brand">Gulf Coast Tour</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        {%- for leg in collections.legs %}
        <li><a href="{{ leg.url }}">{{ leg.data.title | replace(", TX", "") | replace(", LA", "") | replace(", FL", "") | replace(", AL", "") | replace("Gulf Coast MS & Mobile", "MS & Mobile") | replace("Lafayette / Cajun Country", "Cajun Country") | replace("Destin / 30A", "30A") }}</a></li>
        {%- endfor %}
        <li><a href="/logistics/">Logistics</a></li>
      </ul>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-inner">
      <p class="hero-label">A Gulf Coast Driving Tour</p>
      <h1 class="hero-title">South Padre Island<br><span class="hero-to">to the</span><br>Emerald Coast</h1>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-value">10</span>
          <span class="hero-stat-label">Days</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">1,400</span>
          <span class="hero-stat-label">Miles</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">8</span>
          <span class="hero-stat-label">Stops</span>
        </div>
      </div>
    </div>
  </header>

  <section class="destinations">
    <h2 class="section-title">The Route</h2>
    <div class="destination-grid">
      {%- for leg in collections.legs %}
      <a href="{{ leg.url }}" class="destination-card">
        <div class="destination-card-number">{{ leg.data.order }}</div>
        <h3 class="destination-card-title">{{ leg.data.title }}</h3>
        <p class="destination-card-days">Days {{ leg.data.days }}</p>
        <p class="destination-card-must-see">{{ leg.data.mustSee }}</p>
        <span class="destination-card-drive">{{ leg.data.driveTime }}</span>
      </a>
      {%- endfor %}
    </div>
  </section>

  <section class="overview-content">
    {{ content | safe }}
  </section>

  <footer class="footer">
    <p>Gulf Coast Tour — South Padre Island to the Emerald Coast</p>
  </footer>

  <script>
    document.getElementById('nav-toggle').addEventListener('click', function() {
      document.getElementById('nav-links').classList.toggle('open');
    });
  </script>
</body>
</html>
```

**Step 2: Trim `overview.md` content**

Since the hero and destination cards now render the route table from frontmatter, remove the duplicate route table from `overview.md` body content. Keep "Trip Principles" and "Seasonal Notes" sections — those render in `<section class="overview-content">`.

**Step 3: Verify build**

Run: `npm run serve`
Expected: Home page renders with hero, destination cards, and overview content at `http://localhost:8080`.

**Step 4: Commit**

```bash
git add _includes/home.njk overview.md
git commit -m "feat: add home page layout with hero and destination cards"
```

---

### Task 5: Create the CSS stylesheet

**Files:**
- Create: `css/style.css`

**Step 1: Create `css/` directory**

```bash
mkdir -p css
```

**Step 2: Create `css/style.css`**

Build the full stylesheet following the elevation protocol passes:

1. **CSS variables** — color palette, spacing scale, typography
2. **Reset & base** — box-sizing, body defaults, typography
3. **Navigation** — sticky nav, mobile hamburger, active states
4. **Hero** — home page hero with stats
5. **Destination cards** — grid layout, hover effects
6. **Route progress** — dot-and-line progress bar for leg pages
7. **Page content** — article typography, heading styles, tables, lists
8. **Callout boxes** — must-see (coral), tour guide warning (sea foam), hidden gem (amber)
9. **Prev/next navigation** — bottom nav for leg pages
10. **Footer** — simple footer
11. **Responsive** — tablet and mobile breakpoints

Key design values from the approved design doc:

```css
:root {
  --color-bg: #FDF6EC;
  --color-text: #2C2C2C;
  --color-headline: #1B3A4B;
  --color-accent: #E07A5F;
  --color-secondary: #81B29A;
  --color-card: #FFFFFF;
  --color-text-muted: #6B7280;
  --color-amber: #D4A853;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Source Sans 3', 'Source Sans Pro', sans-serif;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  --radius: 8px;
}
```

The stylesheet should be comprehensive — all styling in one file, no framework. Use CSS grid for the destination card layout (4 columns desktop, 2 tablet, 1 mobile). Subtle transitions on card hovers (200ms ease-out lift with shadow). The route progress bar uses flexbox with dots and connecting lines.

**Step 3: Verify visually**

Run: `npm run serve`
Open `http://localhost:8080` — check home page hero, cards, navigation, a few leg pages, mobile responsive view.

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat: add complete stylesheet with editorial travel aesthetic"
```

---

### Task 6: Refine markdown content for web rendering

**Files:**
- Modify: All leg `.md` files

**Step 1: Remove redundant H1 headings**

Since the layout template renders `{{ title }}` as the page `<h1>`, remove the first `# Leg N: ...` line from each markdown file to avoid duplicate headings. Also remove the `**Days:**` and `**Drive from previous:**` lines since those now come from frontmatter via the template.

**Step 2: Add CSS classes for callout boxes**

Wrap "Tour Guide" warnings and "Hidden Gem" notes in HTML divs that the CSS can target:

```html
<div class="callout callout-warning">
<strong>Tour Guide Warning:</strong> Houston sprawls massively...
</div>
```

```html
<div class="callout callout-gem">
<strong>Hidden Gem:</strong> Lafayette is the heart of Cajun culture...
</div>
```

Do this for each leg file where these callouts exist.

**Step 3: Verify all pages render correctly**

Run: `npm run serve`
Walk through every page. Check that callouts render with correct styling, tables look right, no broken formatting.

**Step 4: Commit**

```bash
git add *.md
git commit -m "content: refine markdown for web rendering, add callout markup"
```

---

### Task 7: Design elevation — polish and refinement

**Files:**
- Modify: `css/style.css`
- Modify: `_includes/layout.njk` (if needed)
- Modify: `_includes/home.njk` (if needed)

**Step 1: Typography pass**

- Verify heading hierarchy is visually clear (H1 >> H2 >> H3)
- Tighten letter-spacing on large headings
- Check line-height on body text (1.5–1.6)
- Ensure line length is 45–75 characters

**Step 2: Color pass**

- Verify contrast ratios meet 4.5:1 for all text
- Check accent colors are used sparingly
- Ensure callout boxes have clear visual distinction

**Step 3: Spacing pass**

- Generous margins (use spacing scale consistently)
- Breathing room around sections
- Consistent padding on cards and callouts

**Step 4: Detail pass**

- Card hover transitions smooth (200ms ease-out)
- Nav active state coral underline
- Consistent border-radius throughout
- Subtle shadows on cards (layered, not heavy)
- Smooth scroll behavior for anchor links

**Step 5: Responsive check**

- Test at 1440px, 1024px, 768px, 375px widths
- Nav collapses to hamburger at tablet
- Cards reflow: 4 → 2 → 1 columns
- Route progress switches horizontal → vertical
- Hero text scales down gracefully

**Step 6: Commit**

```bash
git add css/style.css _includes/
git commit -m "style: design elevation polish pass"
```

---

### Task 8: GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create workflow directory**

```bash
mkdir -p .github/workflows
```

**Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for Pages deployment"
```

---

### Task 9: Initialize git repo and push to GitHub

**Step 1: Create GitHub repository**

```bash
gh repo create gulf-coast-tour --public --source=. --push
```

**Step 2: Enable GitHub Pages**

```bash
gh api repos/{owner}/gulf-coast-tour/pages -X POST -f build_type=workflow
```

**Step 3: Verify deployment**

Wait for the Actions workflow to complete, then check the GitHub Pages URL.

Run: `gh run list --limit 1`
Expected: Workflow completes successfully.

**Step 4: Share the URL with the group**

The site will be live at `https://{username}.github.io/gulf-coast-tour/`.
