# Adam Hall Buy My Car — Website

Authorised recreation of [adamhallbuymycar.com.au](https://adamhallbuymycar.com.au/) as a modern
React + Vite + TypeScript application, reproducing the original WordPress/Elementor site's design,
branding, content and behaviour.

## Stack

- **React 18** + **React Router 6** (SPA with clean routes matching the original URL structure)
- **Vite 5** + **TypeScript** (strict)
- Plain, well-organised CSS (design tokens + per-component files) — no CSS framework
- Zero runtime dependencies beyond React/Router

## Getting started

```bash
npm install
npm run dev        # dev server on :5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/how-it-works` | How It Works |
| `/buy-my-car` | Buy My Car (standalone valuation landing page) |
| `/about-adam-hall` | Adam's Story |
| `/listen-whats-your-car-worth` | Listen — "What's Your Car Worth" radio programs |
| `/contact-us` | Contact |
| `/privacy-policy` | Privacy Policy |
| anything else | 404 |

SPA fallback for deep links: Cloudflare Workers uses `wrangler.jsonc`
(`not_found_handling: single-page-application`), Vercel uses `vercel.json`. For nginx/Apache,
rewrite all paths to `/index.html`.

## Deployment (Cloudflare Workers)

```bash
npm run build
npx wrangler deploy   # requires CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID
```

Deployed at: https://adamhall-buymycar.clent.workers.dev

## Configuration

Copy `.env.example` to `.env`:

- **`VITE_FORM_ENDPOINT`** — destination for the valuation + contact form submissions
  (Formspree/webhook/API URL, posted as JSON). The original site's Forminator recipient is
  private, so until this is set the forms validate and show their success state without sending.
  All field definitions live in `src/data/formConfig.ts`.
- **`VITE_AUDIO_BASE`** — optional relocation of the radio-program audio. Episode metadata lives
  in `src/data/episodes.ts`; audio currently streams from the existing authorised hosted source.

## Content & data

All copy is centralised under `src/data/`:

- `site.ts` — contact details, nav, trust items
- `faq.ts` — Questions & Answers
- `testimonials.ts` — all testimonial variants
- `steps.ts` — How-it-works steps
- `episodes.ts` — 46 radio episodes (generated from the original AudioIgniter playlists)
- `privacy.ts` — Privacy Policy text
- `public/data/transcripts.json` — episode transcripts (lazy-loaded on demand)

## Fonts

The original uses Adobe Fonts (Typekit kit `dej5ozb`: **neue-haas-grotesk-display**,
**mr-eaves-modern**) plus Google Roboto. The kit is referenced in `index.html`; if the site moves
to a new domain, add that domain to the Adobe Fonts kit's allowed domains. Faithful fallback
stacks are defined in `src/styles/tokens.css`.

## Assets

All images, logos, icons and decorative SVGs are stored locally under `public/assets/`
(no hotlinking). Favicons, `robots.txt` and `sitemap.xml` are in `public/`.
