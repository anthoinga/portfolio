# Studio: managing the site's content in Sanity

The site reads case studies and your profile from Sanity. Until you switch it on, it uses the
typed copy in `apps/web/src/lib/data/fixtures.ts`, so nothing breaks while you set this up.

## One-time setup

1. **Create a project** at [sanity.io/manage](https://www.sanity.io/manage): dataset `production`,
   public dataset. Copy the **project ID**.
2. **Allow the Studio to talk to it.** In the project's *API → CORS origins* add
   `http://localhost:3333` (with credentials) and, once deployed, your Vercel and production URLs.
3. **Configure locally.**
   ```sh
   cp apps/studio/.env.example apps/studio/.env      # set SANITY_STUDIO_PROJECT_ID
   cp .env.example apps/web/.env                      # set PUBLIC_SANITY_PROJECT_ID (same ID)
   ```
4. **Load the current content** (this uploads the images and videos too, about 150 MB):
   ```sh
   pnpm --filter web export:sanity
   cd apps/studio
   npx sanity login
   npx sanity dataset import import/data.ndjson production --replace
   ```
   It is safe to run again; documents have fixed ids and `--replace` overwrites them.
5. **Open the Studio** with `pnpm studio` and check *Site settings* and *Projects*.
6. **Create a read token**: *API → Tokens → Add API token → Viewer*. Put it in `apps/web/.env` as
   `SANITY_API_READ_TOKEN`. Never commit it, and never prefix it with `PUBLIC_`.
7. **Switch the site over** by setting `PUBLIC_CONTENT_SOURCE=sanity` in `apps/web/.env`, then
   `pnpm build`. A production build fails on purpose if Sanity is unreachable or empty, so a bad
   token can never publish an empty site.

## Putting it on Vercel

- Add these environment variables (Production and Preview):
  `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`,
  `SANITY_API_READ_TOKEN`, `PUBLIC_CONTENT_SOURCE=sanity`, `PUBLIC_SITE_URL=https://inga.dev`.
- The site is static, so editing content only goes live when it rebuilds. Create a **Deploy Hook**
  in Vercel (*Settings → Git → Deploy Hooks*) and add it as a webhook in Sanity
  (*API → Webhooks*, trigger on create/update/delete of `project` and `siteSettings`).
- `apps/web/scripts/ignore-build.mjs` skips builds when only `apps/studio/` changed. Check it
  does not skip hook-triggered builds before relying on the webhook.
- Optional: `pnpm --filter studio deploy` publishes the Studio to a free `*.sanity.studio` URL.

## Adding a case study

*Projects → New.* Fill in the **English** tab (title, slug, tagline, poster, brief, body), pick the
colours on **Colour & motion**, and publish. After the next rebuild it appears on the home page,
`/work`, the sitemap, its Markdown twin, `llms.txt` and the JSON API automatically.

The **Español (Perú)** tab is optional. Anything left empty falls back to English, and the project
list shows *es-PE missing* until the tagline is written. Write it in your own voice rather than
translating word for word.

The body is built from the block types in the schema (text, full image, layout grid, video, quote,
list, team, slideshow, spacer). A brand-new kind of section needs a small code change.

## Checks

- `pnpm --filter web verify:sanity` runs the real queries over your content offline and confirms
  the schema, queries and content agree. It needs no account.
- `pnpm --filter studio validate` runs Sanity's schema validator.
