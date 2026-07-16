The frontend runs at `http://localhost:3000` and uses the API and Socket.IO URLs configured through environment variables.

## Environment variables

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

`NEXT_PUBLIC_APP_URL` is important in production because it generates absolute canonical, sitemap, robots, and social-sharing URLs. The development fallback is `http://localhost:3000`.

## SEO implementation

The application includes the following search and sharing optimizations:

- A crawlable, semantic public landing page at `/` with a single descriptive heading, product copy, feature sections, and clear registration/login links.
- Global metadata with a title template, detailed description, relevant keywords, application identity, canonical URL, and gaming category.
- Open Graph and Twitter Card metadata for consistent previews when links are shared.
- A generated 1200×630 Open Graph image using the Next.js `ImageResponse` convention.
- Route-specific metadata and canonical URLs for login and registration.
- `noindex, nofollow` metadata for the password-reset flow.
- A generated `/robots.txt` that allows public pages and prevents crawling authenticated/private application routes.
- A generated `/sitemap.xml` containing the public landing, registration, and login pages.
- A generated `/manifest.webmanifest` with application name, description, theme colors, standalone display mode, and favicon.
- Semantic HTML and accessible section labeling on the landing page.
- Optimized Inter and JetBrains Mono fonts through `next/font`, avoiding third-party font requests and reducing layout shift.

Public user profiles use dynamic URLs (`/users/[userId]`) and are allowed by `robots.txt`, but they are not enumerated in the sitemap because the documented backend API does not provide a crawlable list of every user ID. Authenticated dashboard, game, profile, settings, friends, and admin routes are intentionally excluded from crawling.

## Verification

Before deployment, run:

```bash
npm run lint
npm run build
```

After deployment, verify these generated resources:

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- `/opengraph-image`

Use the production page source or browser developer tools to confirm canonical, Open Graph, Twitter, title, and description tags resolve against `NEXT_PUBLIC_APP_URL`.
