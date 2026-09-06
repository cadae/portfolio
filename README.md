# Luke Cao — Healthcare AI Portfolio

A responsive portfolio for Luke (Guanhua) Cao, Senior Machine Learning Engineer. The editorial design pairs warm ivory, forest green, DM Sans, and Newsreader with a personal illustrated portrait and detailed healthcare project stories.

## Run locally

No install step or build pipeline is required. From this repository:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Static HTML, CSS, and JavaScript remain compatible with GitHub Pages and the existing `CNAME` (`guanhuacao.com`). Publishing is a separate step; local edits do not deploy the site.

## Site structure

- `index.html`: profile, filterable Evolve spotlight and four project deep dives, expertise, about, experience, and contact.
- `assets/css/style.css`: design tokens, layout, responsive breakpoints, and reduced-motion support.
- `assets/js/script.js`: mobile navigation, project filtering, year, and contact delivery states.
- `assets/js/chat.js`: inactive portfolio Q&A code retained for a possible future return; not loaded by the site.
- `assets/images/`: original portrait and four custom AI-generated project illustrations in the ivory, sage, and forest-green palette. Optimised 1280 × 721 WebP assets; generation prompts are recorded in `assets/images/project-artwork.md`.
- `style-guide.md`: visual system and content conventions.

## Editing content

Edit the semantic HTML directly. Project cards use `data-category="predictive"` or `"language"`; filter buttons use corresponding `data-filter` values. If adding a project, update the initial count and the All work badge. The live count is calculated by JavaScript. Expandable project details work without JavaScript.

Do not add invented employment dates, degrees, technologies, or impact metrics. The original illustrations are explicitly labelled as conceptual, not screenshots of a shipped product.

## Integrations and graceful failure

**Contact:** Formspree endpoint `https://formspree.io/f/mvgkwvav`. The submit button triggers an AJAX POST with `Accept: application/json`, native required/email validation, subject metadata, and a 20-second timeout. Only a successful JSON response without API errors is reported as submitted. HTTP, validation, network and timeout errors preserve the draft; edits made during an in-flight submission are never erased. A separate email link opens an encoded draft in the visitor’s mail app for manual sending. Without JavaScript, the main form uses a normal POST. Formspree activation and recipient routing are account settings; client code cannot activate a missing or unverified form. An owner-authorised live POST on 6 September 2026 returned HTTP 200 and `{"next":"/thanks","ok":true}`. Test subject: `[TEST] Luke Cao portfolio contact form`. The owner confirmed receipt of the test email, verifying submission and email delivery.

**Chat (disabled):** Disabled at the owner’s request on 6 September 2026. The launcher, dialog, and script reference have been removed from the page. The inactive script and styles remain for future reuse. The site makes no chat requests. To restore chat later, reintroduce its markup and script and configure a working server-side endpoint; keep provider API keys in backend secret storage, never in browser code.

**Experience:** The current Senior Machine Learning Engineer role at Beamtree is the primary experience entry, followed by its main work areas. Earlier projects and education are preserved in a native expandable disclosure. Employment dates are not inferred.

**Fonts:** DM Sans and Newsreader are loaded from Google Fonts with system fallbacks and `font-display: swap`. There are no icon scripts, animation libraries, or framework dependencies.

## Content provenance (reviewed 6 September 2026)

- Existing repository: original project descriptions, methods, images, contact details, Formspree endpoint and AI proxy.
- [Public LinkedIn profile](https://au.linkedin.com/in/guanhuacao): public search index retrieved during the redesign identifies Senior Machine Learning Engineer, Beamtree, production ML/MLOps, Evolve (July 2025), RxMx Nightingale (April 2020–January 2022), CT segmentation (April–May 2020), and University of Sydney (2017–2019). Full authenticated profile was not accessible. No job tenure or degree title was inferred. Project dates are not employment dates.
- [NHS Confederation Evolve announcement](https://www.nhsconfed.org/news/new-ai-powered-data-tool-launched-help-hospitals-improve-their-performance-and-productivity): product-level description of the Evolve partnership and forecasting platform. Personal responsibilities beyond the LinkedIn project listing are not claimed.
- [Beamtree Ainsoff](https://beamtree.com.au/our-solutions/ainsoff-deterioration-index/): the 5% length-of-stay result is attributed to the published product implementation study, not Luke individually.
- RippleDown is labelled as related clinical decision support rather than evidence of a specific personal NLP implementation.
- Removed the original unverified 24-hour prediction and 70% coding-effort claims, along with subjective skill percentages. The Health Roundtable article could not be retrieved by the research browser; its original link is preserved.

## Verification

Before publishing, check desktop and mobile navigation, every filter, project disclosures, expertise-to-filter links, email/social/project links, required/email form validation, absence of the disabled chat UI, and absence of horizontal overflow. Test contact response handling with a local mocked `fetch` to avoid sending external messages. The authorised Formspree live test was accepted (HTTP 200, `ok: true`); the owner confirmed inbox receipt. The old AI proxy hostname did not resolve, so its key and inference service could not be tested.

GitHub Pages needs only the repository files. Preserve `CNAME` for the custom domain. There is no deployment performed by the redesign scripts.

## Asset caching

Cloudflare currently serves CSS, JavaScript and images with a four-hour cache lifetime. The page uses content-derived `?v=` versions for the stylesheet, main script, and project illustrations so visitors fetch the matching redesign assets. Whenever one of these files changes, update its URL in `index.html` using the first 12 characters of its SHA-256 hash. This prevents new HTML from loading a previously cached version of that asset.
