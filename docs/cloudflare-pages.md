# Cloudflare Pages deployment

Connect the GitHub repository to Cloudflare Pages, then use these build
settings:

- Production branch: `redesign/v2` (or change this after merging to `master`)
- Build command: `npm run build`
- Build output directory: `build`
- Root directory: `/`
- Node version: `22`, pinned by `.node-version`

No Wrangler configuration or server runtime is required. This is a static
Create React App build.

`public/_redirects` routes client-side URLs to `index.html`. `public/_headers`
adds baseline security headers, prevents stale app-shell files, and gives
hashed static assets a long immutable cache lifetime.

Cloudflare Pages creates preview deployments for non-production branches and
pull requests. Keep `mobile/android` outside the Pages production branch; it
contains the native Android project and is not part of the web deployment.
