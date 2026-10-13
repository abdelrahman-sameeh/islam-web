# Cloudflare Workers deployment

The web branch deploys as a static React SPA through Cloudflare Workers Static
Assets. `wrangler.jsonc` is the source of truth for asset routing.

## Git build settings

- Production branch: `redesign/v2` (or change this after merging to `master`)
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node version: `22`, pinned by `.node-version`

The Create React App output is `build/`. Wrangler uploads that directory and
uses `not_found_handling: "single-page-application"` to serve `index.html` for
React Router navigation. No `_redirects` file or server runtime is required.

For a local/manual release, run `npm run deploy`. Keep `mobile/android` outside
the production branch; it contains the native Android project and is not part
of the web deployment.
