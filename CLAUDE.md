# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The `pinable.cc` marketing site for **PinableAgents**, a VitePress static site published to GitHub Pages. All site code lives under `docs/`; there is no application source here. The desktop app, execution engine, and release pipeline live in other repositories — this repo only hosts their public web presence and their **release/update feed artifact** (see below).

Content is written in Chinese (zh-CN); match that when editing pages, sidebar labels, and copy.

## Commands

All npm commands run from `docs/`, not the repo root:

```bash
cd docs
npm ci          # install (CI uses npm ci, not npm install)
npm run dev     # vitepress dev — local dev server
npm run build   # vitepress build → docs/.vitepress/dist
npm run preview # serve the built output
```

There is no test suite, linter, or formatter configured. `vitepress build` is the only correctness check available — run it before considering a change done, since it resolves the markdown, sidebar links, and Vue components.

VitePress 1.6.x is pinned via `docs/package-lock.json`; Node 20 in CI.

## Deploy pipeline

`.github/workflows/pages.yml` runs on every push to `main`: `npm ci` → `npm run build` in `docs/` → upload `docs/.vitepress/dist` → `deploy-pages`. Only the built `dist` directory is published; nothing outside `docs/public/` (for static passthrough files) or `docs/*.md` reaches the live site.

## Release feed (the non-obvious part)

`docs/public/releases/latest.json` is the desktop app's update manifest. It is **not** authored or read by the site — an external release pipeline commits it on `main` with author `PinableAgents <noreply@pinable.cc>` and message `release: publish PinableAgents <build>`. Because that commit touches `docs/public/`, each release triggers a full site rebuild and republication.

At runtime it is served as `https://pinable.cc/releases/latest.json`. It carries per-platform `download_url`/`sha256` entries and legacy `assets`/`asset_sha256` maps that must stay mutually consistent. When editing it by hand, keep the overlapping keys (`darwin`/`darwin-universal`, `windows`/`windows-amd64`/`windows-x86_64`, and the `assets` vs `platforms` duplicate URLs) in sync — consumers index it by several different platform aliases.

**The feed has exactly one consumer in the site**: `theme/components/HeroDownloads.vue`, rendered on `/` only. It fetches the feed in `onMounted` (never during SSR) and degrades to a plain GitHub Releases link, which is what the server renders and what a no-JS visitor sees — the degraded state *is* the SSR state, so there is no hydration mismatch to guard against. Two invariants follow: the SSR markup must stay platform-neutral (no `navigator` access outside `onMounted`), and every asset field must be treated as nullable — `assets.linux_tar_gz_amd64` and `assets.linux_appimage_amd64` are `null` in the current feed, so a missing URL has to render as an omission, never as a dead link.

## Navigation declares pages that don't exist yet

`docs/.vitepress/config.ts` configures a large `/wiki/` sidebar (core engine, workflows, skills, desktop, advanced topics), but `docs/wiki/` does not exist — only `index.md`, `about.md`, and `contact.md` are present. `ignoreDeadLinks: true` is set, so the build passes despite ~30 broken sidebar links. When adding or renumbering wiki pages, update the sidebar in `config.ts` by hand; it is not generated. Don't treat the sidebar as an inventory of what exists.

## Custom theme

`docs/.vitepress/theme/` extends the VitePress default theme:

- `index.ts` registers four global components (`HomeExperience`, `FeaturesSection`, `FunctionCarousel`, `SectionShell`) and injects an AdSense `AdSlot` into the `doc-after` layout slot. AdSense client ID appears in both `config.ts` (`head`) and `index.ts`; changing it means changing both.
- Three components are **not** registered globally; they are mounted through layout slots, each with different gating because all three pages use `layout: home` and would otherwise share the same slots:
  - `HeroDownloads` → `home-hero-actions-after`, route-gated to `/` (a download offer belongs on the landing page only).
  - `HeroMeta` → `home-hero-after`, ungated — the backend/platform/run-root strip is generic product fact and renders on all three pages, which is what keeps the three heroes structurally identical.
  - `SectionRail` → `layout-bottom`, ungated — it discovers `.landing-section` / `.features-section` in the DOM at runtime and hides itself below three sections, so `/contact` simply renders nothing.
- Styling is three layers, imported in `index.ts` in load-bearing order — `tokens.css` defines, `docs.css` and `landing.css` consume:
  - `tokens.css` is the single source of truth. It rebinds the `--vp-c-*` variables to a neutral (chroma-0) palette shared with the desktop app's shadcn tokens, so the default theme's own components (search, sidebar, footer, code blocks) follow without per-component overrides. Light and dark are both defined; `config.ts` sets `appearance: 'dark'`, which makes dark the default but keeps the toggle working.
  - `docs.css` restyles the default theme (nav, hero, buttons, `.vp-doc` prose, code, tables, footer, search, ad slot).
  - `landing.css` holds the marketing vocabulary (`.landing-*`) that `.md` files compose by hand.
- **Specificity is the trap in this theme; read this before adding a rule.** Two separate mechanisms silently defeat a naive override, and both fail *without* a build error — the page just comes out half-styled:
  - Default-theme components use `<style scoped>`, so their rules compile to `.VPHero[data-v-*]` — (0,2,0). A plain `.VPHero { … }` is (0,1,0) and loses regardless of source order. `docs.css` therefore uses only two shapes: `.VPContent.is-home .VPFoo` (0,3,0) inside the content area, and `.VPFoo.VPFoo` (0,2,0) outside it (nav, sidebar, footer — no `.VPContent` ancestor). The doubled class is deliberate; it wins the tie by source order.
  - The theme's *prose* rules ship in an unscoped global stylesheet at (0,1,1) — `.vp-doc h2 { border-top; margin: 48px 0 16px; letter-spacing: -.02em }`, `.vp-doc ul { padding-left: 1.25rem; list-style: disc }`, `.vp-doc a { color: brand; text-decoration: underline }`, and `.vp-doc li + li` at (0,1,2). A `layout: home` page's markdown body is wrapped in `.vp-doc` too, so these hit the landing page. Every selector in `landing.css` is therefore prefixed with `.vp-doc` to reach (0,2,0)+. A `.landing-*` class used *outside* the markdown body would not be styled — give it an explicit rule rather than dropping the prefix.
  - `docs.css` prose rules are scoped `.VPContent:not(.is-home)` so they never reach the landing page (the home `.VPContent` carries `is-home`, so the `:not()` can't match).
- Layout uses **one measure**: `min(var(--pa-page-width), 100% - var(--pa-gutter))` from `tokens.css`, applied by the hero container, `.home-experience`, `.landing-page`, `.features-section` and the hero meta strip. `docs.css` zeroes the theme's home-body padding (`.VPContent.is-home .vp-doc`) so `100%` means the viewport for all of them; without that, blocks re-derived their width from a parent's padding and landed on different left edges. Anything full-width added later must use the same formula.
- Components are presentational; only `HeroDownloads` touches the network (see the release feed section above).
- `SectionRail` is the one component whose behaviour depends on the pages' markup. Three couplings to keep in mind when editing pages: it keys off `.landing-section` / `.features-section`, so a section wrapped in some other class silently drops off the rail; it renders nothing on SSR (the section list is read from the DOM in `onMounted`), which is what avoids a hydration mismatch; and it re-runs its discovery on route change because `layout-bottom` is a Layout slot that survives client-side navigation. Anchor offsets are CSS, not JS — `.landing-section` / `.features-section` carry `scroll-margin-top` in `landing.css` to clear the fixed nav.
- Pages compose `<SectionShell>` (numbered eyebrow + title + lead + optional `#panel` slot) inside `<div class="landing-page">`. Markdown inside those blocks is not processed — write the section bodies as raw HTML, and note that a blank line ends an HTML block, so keep each `<SectionShell>` block free of interior blank lines if you need it to parse as one unit.
- Typography follows the reference design but drops its Latin-only devices: Chinese headings use `letter-spacing: 0` (negative tracking closes Han sidebearings and reads as cramped) and `text-transform: uppercase` is applied only to all-Latin mono eyebrows.
- **Cap measures on Chinese text in `em`, never `ch`.** A `ch` is the advance of "0" in the Latin stack — about half a Han character — so `62ch` reads like 62 characters and is really ~31, which is how a two-sentence hero tagline ends up with three characters orphaned on its second line. `em` is one Han character, so the cap means the same thing in every locale. Both caps that matter (`--pa`-era hero tagline at `40em`, `.landing-title` at `20em`) were derived from measuring the actual copy; re-measure copy before lengthening it, and keep `text-wrap: balance` on short centred blocks (hero headline, tagline, section titles) so a wrap that does happen never leaves a stub last line. `docs.css` also sizes `.VPHero .main` to hold the longest headline (16 Han characters on `/about`) on one line — the headline font size and that container both track the viewport, so the property holds at every width.

## Root-level files are legacy mirrors

`ads.txt`, `robots.txt`, `sitemap.xml`, and `icons/` exist at the repo root as duplicates of the copies under `docs/public/` (identical except for a trailing newline in `ads.txt`, and root `CNAME`, which `docs/public/` lacks). Only the `docs/public/` versions are deployed — the Pages workflow uploads `dist`, not the repo root. Edit `docs/public/` when changing these; treat the root copies as stale. `sitemap.xml` and `robots.txt` are static and hand-maintained — VitePress does not generate them, so new pages need a manual sitemap entry.

## History rewrite tooling

`scripts/wipe-github-history.sh` destructively rewrites the repo into a single anonymous commit, force-pushes, and deletes tags, Actions runs, deployments, environments, and all but the latest release. It requires `git`, `gh` (authenticated against the remote), `awk`, and `sed`, and must be run from a clean `main` checkout. It is opt-in: set `CONFIRM=YES` to skip the interactive prompt, otherwise it asks for a typed `YES`. Overridable via `REMOTE`, `BRANCH`, `AUTHOR_NAME`, `AUTHOR_EMAIL`, `COMMIT_MESSAGE`.
