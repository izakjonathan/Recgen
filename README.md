# Recipe Generator

A Next.js vegetarian recipe generator that creates three recipes from the selected dish, ingredients, Light/Hearty setting, flavour, texture, cooking time, heat and servings. It runs locally on the server without an API key or usage credits.

## Run locally

Run `npm install` and `npm run dev`.

## How generation works

`app/api/generate/generator.ts` contains ingredient preparation metadata, dish techniques and flavour profiles. It combines the selected parameters to build a title, scaled ingredient list and ordered cooking method. All chosen ingredients are included in each result. “Generate three more” changes the variation round. The number of possible combinations is large and grows as ingredients are added, but repeated requests with identical choices may eventually produce similar dishes; this is a rule based generator, not a language model.

The starter ingredient list is in `app/recipe-builder.tsx`. You can add or remove ingredients in the site's ingredient editor; the list and UI Studio colours are saved in the browser. For a custom ingredient without known preparation metadata, the generator includes it with a generic quantity and advises following its food safety instructions. Add its quantity, role and preparation in `known` to get a fully tailored method. Review generated recipes before cooking, especially custom ingredients or unusually large selections.
