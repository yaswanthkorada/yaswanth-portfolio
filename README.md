# Yaswanth Korada — Personal Portfolio

> Production-ready personal portfolio site built with pure HTML · CSS · Vanilla JS.
> Deployed on **GitHub Pages** with zero build tools required.

**Live site:** `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

---

## Features

- **Glassmorphism dark/light design** with smooth theme toggle (persists to `localStorage`)
- **Fully responsive** — mobile-first from 320 px up through 1280 px+
- **Zero external network calls** — no CDN fonts, no remote JS
- **JSON-driven content** — update `content.json` and the page reflects changes automatically
- **Accessibility** — semantic HTML5 landmarks, ARIA labels, keyboard focus styles, ≥ 4.5:1 contrast
- **SEO** — meta tags, Open Graph, Twitter Card, JSON-LD `schema.org/Person`
- **IntersectionObserver reveal animations** — disabled when `prefers-reduced-motion: reduce`
- **Contact form** → prefilled `mailto:` (no server needed)
- **Lazy-loaded** non-critical images; `width`/`height` to prevent CLS

---

## File / Folder Structure

```
/
├── index.html              # Main HTML document
├── styles.css              # Design system + all styles
├── script.js               # Theme, animations, content render, form
├── content.json            # ← ALL your personal data lives here
├── YaswanthKorada_AIEngineer.pdf  # Résumé (served as download)
├── Linkedin_profile.txt    # Source (reference only, not served)
├── assets/
│   ├── profile.jpg         # ← YOUR profile photo (square, ≥ 400 px)
│   └── hero-bg.jpg         # ← Hero background image (1920×1080 recommended)
├── docs/
│   └── favicon.svg         # Auto-generated SVG favicon
└── README.md
```

---

## Quick Start (Local)

No build tools required. Just open the file with a local server so `fetch('./content.json')` works.

### Option A — VS Code Live Server (recommended)
1. Install the **Live Server** extension by Ritwick Dey.
2. Right-click `index.html` → **Open with Live Server**.
3. Browser opens at `http://127.0.0.1:5500/`.

### Option B — Python HTTP server
```bash
cd c:\Yaswanth\web_page
python -m http.server 8080
# Open http://localhost:8080
```

### Option C — Node.js
```bash
npx serve .
# or
npx http-server . -p 8080
```

> **Note:** Opening `index.html` directly as `file://` will cause `fetch()` to fail due to CORS. Always use a local server.

---

## How to Customise Content

All personal data is stored in **`content.json`**. Edit that file; the page re-renders automatically on next load.

### Required TODO fields (mark with `TODO_` prefix currently)
| Field | Location in content.json | Example |
|---|---|---|
| Email | `email` | `yaswanth@example.com` |
| GitHub URL | `links.github` | `https://github.com/yaswanthkorada` |
| LinkedIn URL | `links.linkedin` | `https://linkedin.com/in/yaswanthkorada` |
| Education | `education[0]` | Fill in university, degree, dates |
| Certifications | `certifications` | Add AZ-900, etc. |
| og:url / canonical | `index.html` meta tags | Update after deploy |

### Replace Images

| File | Spec | Notes |
|---|---|---|
| `assets/profile.jpg` | Square, ≥ 400×400 px, JPEG/WebP | Displayed in hero avatar ring |
| `assets/hero-bg.jpg` | 1920×1080 px minimum, JPEG | Background behind hero section |

After adding images, no code changes are needed — the CSS and HTML already reference these paths.

---

## GitHub Pages Deployment

### Manual (simplest)

1. **Create a GitHub repo** (e.g. `portfolio`).
2. Push all files to the `main` branch.
3. Go to **Settings → Pages**.
4. Under *Source*, select **Deploy from a branch**.
5. Choose **Branch: `main`** / **Folder: `/ (root)`**.
6. Click **Save** — your site will be live at `https://USERNAME.github.io/portfolio/` within ~60 seconds.
7. Update the `<link rel="canonical">` and `og:url` meta tags in `index.html` with your real URL.

### Automated with GitHub Actions (optional)

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

With this workflow, every push to `main` auto-deploys.

---

## Updating the Résumé

Replace `YaswanthKorada_AIEngineer.pdf` with your updated file, keeping the same filename. All download buttons reference this path.

To use a different filename, update the `href` on every button with `download` attribute in `index.html`, and update `links.resume` in `content.json`.

---

## Lighthouse Targets

The site is built to meet:
| Category | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

Run a local Lighthouse audit:
```bash
npx lighthouse http://localhost:8080 --view
```
Or use Chrome DevTools → Lighthouse tab.

---

## Next Steps (Future Enhancements)

| Feature | Notes |
|---|---|
| **Blog / Writing** | Add a `/blog/` directory with Markdown-rendered posts (use e.g. `marked.js`) |
| **RSS Feed** | Auto-generated `feed.xml` for blog posts |
| **Analytics** | Add privacy-friendly analytics (e.g. Plausible, Umami self-hosted) — no external scripts currently |
| **Project demos** | Add GIF previews or embedded Loom videos in project cards |
| **Testimonials** | Add a testimonials section with LinkedIn recommendations |
| **i18n** | Add language toggle (Hindi / Telugu) |
| **Dark-mode OG image** | Generate `docs/opengraph.png` via Satori or Puppeteer in a CI step |
| **PWA** | Add `manifest.json` and a minimal service worker for offline support |
| **Email backend** | Replace `mailto:` form with a serverless function (Formspree, EmailJS, or Cloudflare Workers) |

---

## License

© 2026 Yaswanth Korada. All rights reserved.
Feel free to use this codebase as a template — just replace all personal information with your own.
