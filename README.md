# Iram Fatima — personal portfolio

A responsive portfolio built with semantic HTML, CSS and JavaScript, using Vite. The emerald hero includes moving light fields, contour lines and particles; cards and sections animate on interaction and scroll. A persistent motion toggle and system reduced-motion support keep animation optional. Off-screen and hidden-page animations pause. Fonts are hosted locally. No API keys, backend or database are needed.

## Develop

Use Node.js 20.19+, 22.12+ or 24 (validated with Node 24.19.0).

```sh
cd /workspace/IRAMFATIMAPORTFOLIO
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

## Build and check

```sh
npm run build
npm test
```

The production website is generated in `dist/`. Browser tests use the system Chromium at `/usr/bin/chromium`; set `CHROMIUM_PATH` if yours is elsewhere. Tests cover content, portrait and PDF availability, social link destinations, keyboard tabs, clipboard, mobile navigation and horizontal overflow at 360, 390, 768 and 1440 pixels. Motion checks verify a changing background, pause/resume persistence and reduced-motion behaviour. `npm test` starts and stops its own development server if one is not running.

To check the production build, run `npm run preview -- --port 4173 --strictPort`.

## Content and assets

- `index.html`: biography, experience, school/college details, links and page metadata.
- `src/style.css`: responsive visual design.
- `src/main.js`: navigation, accessible tabs, clipboard and local fonts.
- `src/motion.js`: scroll reveals, pointer response, reading progress and persistent motion controls.
- `public/portrait.png`: AI-assisted studio-background edit of the supplied portrait; review likeness before public release.
- `public/Iram-Fatima-Profile.pdf`: the original résumé supplied by Iram, unchanged.

The website uses the user's confirmed title **Senior Customer Relationship Manager (CRM)** and school **Ralli International School**. The original downloadable PDF still says **Senior Deputy Customer Relationship Manager** and does not name the school. Replace it with an updated PDF when available. Master's study is marked in progress (2025–2027), rather than a completed qualification.

Channel cards link to the four supplied YouTube/Instagram profiles. They do not embed or autoplay third-party videos. Specific video URLs can be added later. Profile details are based on the supplied résumé and user corrections; no audience statistics, awards or client testimonials have been invented.

## Hosting

Deploy the contents of `dist/` to a static host. Vite uses relative asset URLs, so the build supports both domain-root hosting and the GitHub Pages project path. The `gh-pages` branch contains the generated site. In GitHub Settings → Pages, use “Deploy from a branch”, branch `gh-pages`, folder `/ (root)`. A published site must be verified separately; a successful Git push alone does not confirm publication.

Use the existing checkout for future work. Cloud tasks are already isolated; do not create a Git worktree unless the user asks for one. Dependencies and assets can persist in an environment snapshot, but the development server must be started again in each new task.
