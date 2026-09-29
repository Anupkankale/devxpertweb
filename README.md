# DevXpert Labs

The DevXpert Labs site, built with [Nuxt 4](https://nuxt.com), [@nuxt/content](https://content.nuxt.com) and Tailwind CSS v4. It's generated as a fully static site.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # dev server at http://localhost:3000 (bound to 0.0.0.0 so Windows can reach it under WSL)
pnpm generate      # static build -> .output/public (upload this folder to any static host)
pnpm preview       # preview the production build
pnpm typecheck     # vue-tsc type check
```

## Pages

| Route | Source |
|---|---|
| `/` | `app/pages/index.vue`: sections listed in `app/app.config.ts` |
| `/what-we-do` | Services (`content/stack`) and process (`content/process`) |
| `/who-we-are` | `content/about.md`, profile, timeline, contributions |
| `/what-we-think` | Articles (`content/blog/*.md`) and case studies (`content/insights/*.md`) in one feed, filterable by type, plus projects and contributions |
| `/what-we-think/<slug>` | One article or case study, with table of contents and newer/older links |
| `/what-we-think/rss.xml` | RSS feed of articles and case studies |
| `/contact` | Contact form (Web3Forms) and direct contact options |

Each inner page's hero and SEO copy lives in `content/pages/<name>.yml`.

## Structure

```
content/                 # all site copy, one file per item
  site.yml               # SEO meta, hero, plugin-card header, footer
  sections/*.yml         # eyebrow / title / lead for each section
  contributions/*.yml    # "Giving back" cards
  stack/*.yml            # "What the lab tinkers with" blocks
  projects/*.yml         # "Projects & experiments" cards
  timeline/*.yml         # "Why the lab exists" timeline
  contacts/*.yml         # contact tiles
  tracker/*.yml          # private tracker projects + seed tasks
  faq/*.yml              # FAQ entries (also emitted as FAQPage structured data)
  about.md               # About section (markdown body + frontmatter)
  pages/*.yml            # hero + SEO title/description for each inner page
  blog/*.md              # articles (served under /what-we-think/<slug>)
  insights/*.md          # case studies (also under /what-we-think/<slug>; keep file names unique across both folders)
  process/*.yml          # "How the lab works" steps
content.config.ts        # schema for every collection above
app/
  app.config.ts          # brand, nav links, and which sections render (in order)
  pages/index.vue        # renders the sections listed in app.config.ts
  layouts/default.vue    # particles + header + footer
  components/
    ui/                  # reusable primitives: SectionShell, SectionHeader, BaseButton, BaseCard, Pill, IconLink, AppIcon
    layout/              # AppHeader, AppFooter, BrandMark, ParticleCanvas
    sections/            # one component per home-page section
    hero/, tracker/      # section-specific pieces
  composables/           # SEO/schema, content helpers, tracker state
  plugins/reveal.client.ts # scroll reveals (IntersectionObserver + CSS)
  router.options.ts      # scroll restoration rules
  utils/                 # icon map, particle engine, text helpers
  error.vue              # branded 404 / error page (noindex)
server/routes/           # build-time generated robots.txt, sitemap.xml, llms.txt
public/                  # favicons, web manifest, social share image
  assets/css/main.css    # Tailwind import + design tokens (@theme)
```

## Writing an article

Create `content/blog/my-post.md` (it's published at `/what-we-think/my-post`):

```md
---
title: My post title
description: One or two sentences, used in cards, search results and social previews.
date: 2026-10-01
tags: [WordPress, Plugins]
draft: true
---

Write the post in Markdown. `##` headings build the table of contents.
```

Entries with `draft: true` show up in `pnpm dev` with a "Draft" badge but are left out of `pnpm generate`: no page, no sitemap entry, no RSS item. Set `draft: false` to publish. Case studies work the same way in `content/insights/`, with extra `kind`, `client`, `services`, `outcome` and `link` fields. Both appear together on `/what-we-think` and in the home page's "What we think" section.

The three starter articles and the case study were drafted from facts already on the site. Review and personalise them before publishing.

## Contact form

The form posts to [Web3Forms](https://web3forms.com) (free, no backend):

1. Create an access key at web3forms.com using the email address that should receive messages.
2. Copy `.env.example` to `.env` and set `NUXT_PUBLIC_WEB3FORMS_KEY=...`.
3. Rebuild. The key is public by design, since Web3Forms keys are meant to be used from the browser.

Without a key, the form still works: it opens the visitor's email app with the message prefilled.

## Common changes

**Add a project**: create `content/projects/my-project.yml`:

```yaml
order: 4
tag: Experiment · WordPress Plugin
title: My Project
body: One or two sentences about it.
link: { href: 'https://github.com/...', label: View on GitHub, icon: github }
```

The same pattern works for contributions, stack blocks, timeline steps, contact tiles and tracker projects. `order` controls the position.

**Add a page to the navigation**: edit `nav.items` in `app/app.config.ts` (the header, mobile menu and footer all read from it), and add the route to `STATIC_PAGES` in `server/routes/sitemap.xml.ts`.

**Reorder or hide a section**: edit the `sections` array in `app/app.config.ts`.

**Add a new section**:
1. Create `app/components/sections/FooSection.vue`, wrapping its body in `<UiSectionShell id="foo" ...>`.
2. Add its copy as `content/sections/foo.yml` (plus a new collection in `content.config.ts` if it has a list of items).
3. Register it in the `registry` in `app/pages/index.vue` and add `'foo'` to `sections` (and the `SectionName` type) in `app/app.config.ts`.

**Add an icon**: add an entry to `app/utils/icons.ts`, then reference it by name in content (`icon: name`).

**Change colours or fonts**: edit the `@theme` tokens in `app/assets/css/main.css`. Every utility (`bg-panel`, `text-wp-soft`, `font-mono`, …) picks them up.

**Scroll reveal**: add `data-reveal="<group>"` to an element. Groups and their stagger timing are in `app/plugins/reveal.client.ts`; the animation itself is `[data-reveal][data-shown]` in `main.css`.

## SEO & AEO

Everything is generated from `content/`, so updating a YAML file updates the page, the structured data and `llms.txt` together.

- **Meta**: title, description, canonical, robots, Open Graph and Twitter card tags are set in `app/app.vue` from `content/site.yml`.
- **Structured data**: `app/composables/useStructuredData.ts` emits one linked JSON-LD `@graph`: Organization + ProfessionalService, Person, WebSite, WebPage, an ItemList of projects and a FAQPage. Validate with the [Rich Results Test](https://search.google.com/test/rich-results) after deploying.
- **Answer engines**: the visible FAQ section gives direct, quotable answers, and `/llms.txt` is a plain-text summary for AI crawlers. `robots.txt` allows all crawlers, including AI bots.
- **Per-page SEO**: every page calls `usePageSeo()` (in `app/composables/usePageSeo.ts`) for its title, description, WebPage type, breadcrumbs and extra JSON-LD. Posts get `BlogPosting` and case studies get `Article`.
- **Crawling**: `/robots.txt`, `/sitemap.xml` (static pages plus every published article and case study) and `/what-we-think/rss.xml` are generated at build time.
- **Site URL**: `runtimeConfig.public.siteUrl` in `nuxt.config.ts` (override with `NUXT_PUBLIC_SITE_URL`).
- **Staging**: build with `NUXT_PUBLIC_INDEXABLE=false pnpm generate` to emit `noindex` and a disallow-all `robots.txt`.
- **Icons**: `public/favicon.svg` is the source. `favicon.ico`, the PNG icons, `apple-touch-icon.png` and `og-image.png` (1200×630) were rendered from it. Regenerate them if the brand changes.

After launch, submit `https://www.devxpertlabs.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. The site is served on `www` (Vercel redirects the bare domain there), so `siteUrl` uses `www` too.

## Notes

- The private tracker's passcode check runs in the browser, so it only hides the tracker from casual visitors. It doesn't secure anything. Tasks are stored in each visitor's own `localStorage`.
- `legacy/index.html` is the original single-file site, kept for reference.
