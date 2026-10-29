# SkyCast

A weather dashboard built with React, Vite, Tailwind CSS, and Open-Meteo.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Vercel

Import the repository into Vercel. It will detect Vite automatically and use
`npm run build` with `dist` as the output directory. The Vercel rewrite
configuration supports direct visits and refreshes on app URLs.

No API key or environment variables are required. Browser geolocation requires
HTTPS, which Vercel provides for deployed sites.

## Verify before deploying

```sh
npm run lint
npm run build
```
