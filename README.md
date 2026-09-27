# The Recipe Table

A Next.js recipe generator. Choose salad, potato, soup, pasta, curry, or stew; select ingredients; choose light or hearty; and get three recipe ideas. It tries a free Vercel AI Gateway model, then returns built-in ideas if the gateway is unavailable. The page labels built-in ideas clearly.

## Run locally

1. Run `npm install`.
2. Run `npm run dev` and open http://localhost:3000. Without a Vercel OIDC token, built-in ideas work automatically.

## Deploy to Vercel

Import this folder as a Next.js project. No API key is required for built-in ideas. Vercel automatically supplies an OIDC token for AI Gateway. Gateway free-tier access can be subject to Vercel account verification and rate limits; if it is blocked, the site uses built-in ideas. OpenAI API credits and ChatGPT subscriptions are not used.

The ingredient list can be edited with the top-right plus button and persists in the same browser through localStorage. The top-left settings button opens UI Studio: canvas, ink, accent, and positive colors can be previewed and saved in the same browser. Replace `starterIngredients` in `app/recipe-builder.tsx` with your preferred default list when ready. Generated recipes are ephemeral and are not saved after refreshing.

The gateway token stays in the server route, never in client code. Public traffic can consume the Vercel AI Gateway allowance when access is available.
