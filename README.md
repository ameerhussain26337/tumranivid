# Social Video Downloader — Compliant Starter

This starter is a production-oriented web app scaffold for a social-media video utility.

Important: the app does NOT bypass DRM, private-content restrictions, authentication, or platform security controls. Social platforms may restrict downloading, and their terms/APIs should be followed. For production, integrate only platform-authorized APIs or user-authorized/public media sources.

## Stack
- Next.js 15
- TypeScript
- Tailwind CSS
- Zod
- Basic SEO metadata + robots + sitemap

## Run
1. Install Node.js 20+
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

## Production
`npm run build`
`npm start`

## Environment
Copy `.env.example` to `.env.local`.

The `/api/analyze` endpoint validates supported URLs and returns a safe response structure. Replace the TODO integration with an official/authorized provider before enabling real media retrieval.
