# Recipe Generator

A Next.js recipe catalogue with 120 named vegetarian dishes, each offered in Light and Hearty versions: 240 recipe editions total. Choose a dish style, select ingredients and get three matching recipes with quantities and cooking steps. No API key, credits or external AI service is required.

## Run locally

1. Run `npm install`.
2. Run `npm run dev` and open http://localhost:3000.

## How matching works

The data lives in `app/api/generate/library.ts`. Each recipe defines a title, dish style, core ingredients, flavour profile and description. The server expands the Light and Hearty editions, ranks recipes by selected ingredient overlap and returns three distinct suggestions. The result says how many selected ingredients the recipe actually uses. Other required ingredients are listed in full; checking an ingredient does not force it into an unrelated recipe. “Generate three more” avoids repeats until the selected category has been exhausted.

Add recipes by adding a row to the relevant style in `rows`, using `Title|Ingredient,Ingredient|flavourKey|Description`; define quantities for new ingredients in `quantity` and flavour profiles in `flavours`. Existing starters can be changed in `app/recipe-builder.tsx`. The ingredient editor and UI Studio save changes locally in the same browser. Results are not saved after refreshing.

The library is original, authored for this site. Each entry has a named combination, while cooking methods are built from shared dish-style and flavour instructions. Review and refine individual entries before using them for a commercial recipe publication.
