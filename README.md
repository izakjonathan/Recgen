# The Recipe Table

A Next.js recipe generator. Choose salad, potato, soup, pasta, curry, or stew; select ingredients; choose light or hearty; and generate three distinct recipes through the OpenAI API.

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` to your OpenAI API key.
3. Run `npm run dev` and open http://localhost:3000.

## Deploy to Vercel

Import this folder as a Next.js project. Add `OPENAI_API_KEY` in the Vercel project environment variables, then deploy. `OPENAI_MODEL` is optional and defaults to `gpt-4.1-mini`. OpenAI API usage is billed separately from ChatGPT subscriptions.

The ingredient list can be edited in the Settings panel and persists in the same browser through localStorage. Replace `starterIngredients` in `app/recipe-builder.tsx` with your preferred default list when ready. Generated recipes are ephemeral and are not saved after refreshing.

The API key stays in the server route, never in client code. A public deployment may incur API usage from visitors; add access control and rate limiting before sharing it broadly.
