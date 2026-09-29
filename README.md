# Recipe Generator

A Next.js recipe generator that builds three distinct dish approaches from the selected ingredients and preferences. No OpenAI API key or paid generation service is required.

## Run

Run `npm install`, then `npm run dev`. Run `npm run build` for a production build.

## Recipe architecture

- `app/ingredient-catalogue.ts` contains structured ingredients: quantity, unit, preparation, cooking role, approximate cooking time and roasting suitability. The same metadata is available to the ingredient editor. Added custom ingredients require a preparation type (vegetable to cook, already cooked food, fresh garnish or sauce). Dried beans or other ingredients requiring special treatment need a dedicated catalogue entry.
- `app/api/generate/blueprints.ts` defines three cooking approaches per dish style. The generator builds an ordered plan of cooking actions and ingredient references from these blueprints.
- `app/api/generate/validation.ts` rejects a plan if a chosen ingredient is merely named in prep, if any listed ingredient never enters the method, if quantities are duplicated, or if the requested time cannot yield three different approaches. It also rejects a few known incompatible combinations and overly large selections rather than forcing every ingredient into an implausible dish.
- `app/api/generate/generator.ts` assembles and scales quantities, picks flavour variants, builds methods and returns validated recipes. Flavour and texture settings adjust the result; methods are genuinely different within a set of three.

Quantities and times are estimates; generated combinations still need real cooking trials. Custom ingredient classification is a user declaration, not a food-safety guarantee. Parmigiano Reggiano/Parmesan may use animal rennet, so check the product if a strictly vegetarian dish is required. The ingredient editor and UI Studio save settings in the browser; generated recipes are not saved after refresh. With fixed inputs and a finite set of blueprints, repeated requests can eventually resemble earlier recipes.
