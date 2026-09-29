import { catalogue, formatIngredient, normalize, resolveIngredients, type CustomKind, type Ingredient } from "../../ingredient-catalogue";
import { blueprints, names, type Action, type Feel, type Flavour, type Heat, type IngredientLine, type Pace, type Plan, type Style, type Technique, type Texture } from "./blueprints";
import { validatePlan, validateSelection, validateSet } from "./validation";
export type { Feel, Flavour, Heat, Pace, Style, Texture } from "./blueprints";
export type Options = { style: Style; weight: Feel; ingredients: string[]; customKinds: Record<string, CustomKind>; flavour: Flavour; texture: Texture; pace: Pace; heat: Heat; servings: number; round: number };

type FlavorDetail = { name: Exclude<Flavour, "Surprise me">; key: string; line: string; use: string; selectedId?: string };
const flavors: Record<Exclude<Flavour, "Surprise me">, Omit<FlavorDetail, "name">[]> = {
  Herby: [
    { key: "herbs", line: "1 tsp dried mixed herbs", use: "Stir the mixed herbs through the warm dish." },
    { key: "oregano", line: "1 tsp dried oregano", use: "Rub the oregano between your fingers and stir it through." },
    { key: "dill", line: "1 tbsp chopped dill", use: "Scatter the dill over the dish just before serving." }
  ],
  Citrus: [
    { key: "lemon", line: "1 lemon", use: "Add the lemon juice and zest off the heat.", selectedId: "lemon" },
    { key: "lime", line: "1 lime", use: "Squeeze the lime over the dish just before serving." },
    { key: "lemon", line: "1 lemon", use: "Zest the lemon over the dish, then add its juice off the heat.", selectedId: "lemon" }
  ],
  Smoky: [
    { key: "paprika", line: "1 tsp smoked paprika", use: "Warm the smoked paprika briefly in a spoonful of oil, then stir it through." },
    { key: "paprika-cumin", line: "1 tsp smoked paprika and ½ tsp ground cumin", use: "Warm the smoked paprika and cumin briefly in oil, then fold them through." },
    { key: "paprika-tomato", line: "1 tsp smoked paprika and 1 tsp tomato paste", use: "Cook the smoked paprika and tomato paste in oil for one minute, then stir them through." }
  ],
  Spiced: [
    { key: "curry-powder", line: "1 tbsp curry powder", use: "Bloom the curry powder in oil for 30 seconds and stir it into the dish." },
    { key: "cumin-turmeric", line: "1 tsp cumin and ½ tsp turmeric", use: "Warm the cumin and turmeric in oil for 30 seconds and fold through." },
    { key: "garam-masala", line: "1 tsp garam masala", use: "Stir the garam masala through the warm dish." }
  ],
  Creamy: [
    { key: "yogurt", line: "100 g plain yogurt", use: "Turn off the heat and swirl in the yogurt without boiling it." },
    { key: "oat-cream", line: "100 ml oat cream", use: "Stir in the oat cream and warm gently." },
    { key: "creme-fraiche", line: "100 g crème fraîche", use: "Take the pan off the heat and fold in the crème fraîche." }
  ],
  Umami: [
    { key: "miso", line: "1 tsp white miso", use: "Dissolve the miso in a spoonful of warm water and stir it in off the heat." },
    { key: "soy", line: "1 tbsp soy sauce", use: "Stir in the soy sauce, then taste before adding salt." },
    { key: "mushroom", line: "1 tsp mushroom seasoning", use: "Stir in the mushroom seasoning and taste before adding salt." }
  ]
};
const flavourNames = Object.keys(flavors) as Exclude<Flavour, "Surprise me">[];
const scaleLine = (line: string, servings: number) => line.replace(/(^| and )(\d+(?:\.\d+)?|½|¼)(?=\s)/g, (_, prefix: string, amount: string) => {
  const value = (amount === "½" ? .5 : amount === "¼" ? .25 : Number(amount)) * servings / 2;
  const whole = Math.floor(value), fraction = Math.round((value - whole) * 4);
  return `${prefix}${whole || !fraction ? whole : ""}${["", "¼", "½", "¾"][fraction]}`;
});
const hash = (value: string) => { let n = 2166136261; for (const ch of value) n = Math.imul(n ^ ch.charCodeAt(0), 16777619); return n >>> 0; };
const group = (items: Ingredient[], roles: Ingredient["role"][]) => items.filter(item => roles.includes(item.role));

function makePlan(options: Options, selected: Ingredient[], technique: Technique, index: number): Plan {
  const { style, weight, servings } = options;
  const lines: IngredientLine[] = [];
  const actions: Action[] = [];
  const add = (id: string, text: string) => { if (!lines.some(line => line.id === id)) lines.push({ id, text }); return id; };
  const act = (kind: Action["kind"], ingredients: (Ingredient | string)[], text: string) => actions.push({ kind, ingredientIds: ingredients.map(item => typeof item === "string" ? item : item.id), text });
  const selectedIds = new Set(selected.map(item => item.id));
  const items = selected.map(item => style === "Salad" && item.id === "coconut milk" ? { ...item, value: 80 } : item);
  for (const ingredient of items) add(ingredient.id, formatIngredient(ingredient, servings));
  if (style === "Potato" && !items.some(item => ["potato", "sweet potato"].includes(item.id))) {
    const potato = { ...catalogue.potato, id: "potato", label: "Potato" } as Ingredient;
    items.unshift(potato); add(potato.id, formatIngredient(potato, servings));
  }
  const protein = group(items, ["tofu", "cookedProtein"]);
  const hasProtein = protein.length > 0;
  let grain: string | null = null, stock: string | null = null, bread: string | null = null, saladBase: string | null = null;
  if (style === "Salad") {
    if (weight === "Light") saladBase = add("base-leaves", `${50 * servings / 2} g mixed salad leaves`);
    else grain = add("base-couscous", `${120 * servings / 2} g dry couscous`);
  }
  if (style === "Potato" && weight === "Light") saladBase = add("base-leaves", `${50 * servings / 2} g mixed salad leaves`);
  if (style === "Pasta") grain = add("base-pasta", `${(weight === "Hearty" ? 220 : 160) * servings / 2} g dried pasta`);
  if (style === "Curry") grain = add("base-rice", `${(weight === "Hearty" ? 150 : 100) * servings / 2} g dry rice`);
  if (style === "Soup" || style === "Stew") {
    stock = add("base-stock", `${600 * servings / 2} ml vegetable stock`);
    if (weight === "Hearty") bread = add("base-bread", `${servings} slices crusty bread`);
  }
  if (style === "Curry") stock = add("base-stock", `${(items.some(item => item.role === "liquid") ? 100 : 250) * servings / 2} ml vegetable stock or water`);
  if (weight === "Hearty" && !hasProtein && ["Salad", "Potato", "Pasta", "Curry", "Soup", "Stew"].includes(style)) {
    const bean = { ...catalogue.chickpeas, id: "chickpeas", label: "Chickpeas" } as Ingredient;
    items.push(bean); add(bean.id, formatIngredient(bean, servings));
  }
  const flavour = options.flavour === "Surprise me" ? flavourNames[(hash(`${style}|${items.map(item => item.id).join("|")}|${options.round}`) + index) % flavourNames.length] : options.flavour;
  let detail = flavors[flavour][options.round % 3];
  if (flavour === "Creamy" && items.some(item => item.id === "coconut milk")) detail = { key: "coconut", line: "", use: "Simmer the coconut milk gently until the sauce is creamy.", selectedId: "coconut milk" };
  const flavorId = detail.selectedId && selectedIds.has(detail.selectedId) ? detail.selectedId : `flavor-${detail.key}`;
  if (flavorId.startsWith("flavor-") && detail.line) add(flavorId, scaleLine(detail.line, servings));
  const oil = add("pantry-oil", `${1 * servings / 2} tbsp olive oil`);
  const salt = add("pantry-seasoning", "Salt and black pepper, to taste");
  let chili: string | null = null;
  if (options.heat !== "Mild") chili = add("pantry-chili", scaleLine(options.heat === "Hot" ? "1 tsp chilli flakes" : "¼ tsp chilli flakes", servings));
  let textureExtra: string | null = null;
  if (options.texture === "Crisp") textureExtra = add("texture-seeds", scaleLine("2 tbsp pumpkin seeds", servings));
  if (options.texture === "Fresh" && !items.some(item => ["coriander", "rocket", "lemon"].includes(item.id))) textureExtra = add("texture-parsley", "1 tbsp chopped parsley");
  if (style === "Soup" || style === "Stew") {
    if (weight === "Light") textureExtra = textureExtra ?? add("base-herbs", "1 handful fresh herbs");
  }
  // A preparation step does not count as using an ingredient; subsequent actions must consume every line.
  act("prep", items, `Prepare the ingredients: ${items.map(item => item.prep).join("; ")}.`);
  if (grain === "base-pasta") act("cook", [grain], "Cook the pasta in salted water until tender, reserving a mug of pasta water before draining.");
  if (grain === "base-rice") act("cook", [grain], "Cook the rice according to its packet instructions.");
  if (grain === "base-couscous") act("cook", [grain], "Prepare the couscous according to its packet instructions and fluff it with a fork.");
  const aromatics = group(items, ["aromatic"]), firm = group(items, ["firm"]), quick = group(items, ["quick"]), tofu = group(items, ["tofu"]), beans = group(items, ["cookedProtein"]), leaves = group(items, ["leaf"]), finishing = group(items, ["finish"]), liquid = group(items, ["liquid"]);
  const isSalad = style === "Salad", roasted = technique.mode === "roast";
  const roastables = [...firm, ...quick.filter(item => item.roastable), ...tofu, ...beans.filter(item => item.roastable)];
  const remainingQuick = roasted ? quick.filter(item => !item.roastable) : quick;
  const remainingBeans = roasted ? beans.filter(item => !item.roastable) : beans;
  if (roasted && !roastables.length) throw new Error(`Add a vegetable or protein that can be roasted to make three different ${style.toLowerCase()} recipes.`);
  if (roasted && roastables.length) act("cook", [oil, ...roastables], `Heat the oven to 210°C. Toss ${names(roastables)} with the oil, spread on a roomy tray and roast for ${firm.length ? "25–35" : "15–20"} minutes, turning halfway, until tender and browned. Cook tofu thoroughly.`.replace(" Cook tofu thoroughly.", tofu.length ? " Cook tofu thoroughly." : ""));
  if (aromatics.length) act("cook", [roasted ? "pantry-oil" : oil, ...aromatics], `Soften ${names(aromatics)} in a little oil for 2–3 minutes in a large pan.`);
  let liquidUsed = false, firmUsed = false;
  if (!roasted && firm.length && stock && (technique.mode === "simmer" || technique.mode === "broth")) {
    act("cook", [stock, ...liquid, ...firm], `Add ${names(firm)} to ${liquid.length ? `${names(liquid)} and ` : ""}the stock. Simmer for 15–20 minutes until the vegetables are tender.`);
    liquidUsed = true; firmUsed = true;
  }
  if (isSalad) {
    if (!roasted && firm.length) act("cook", [oil, ...firm], `Cook ${names(firm)} in a pan until tender, then let cool slightly.`);
    if (!roasted && tofu.length) act("cook", [oil, ...tofu], `Brown ${names(tofu)} in a pan for 6–8 minutes until cooked through, then cool slightly.`);
    const rawQuick = technique.mode === "raw" ? remainingQuick.filter(item => ["tomato", "courgette", "red pepper"].includes(item.id)) : [];
    const cookQuick = remainingQuick.filter(item => !rawQuick.includes(item));
    if (cookQuick.length) act("cook", [oil, ...cookQuick], `Briefly sauté ${names(cookQuick)} until tender; cool slightly.`);
    if (rawQuick.length) act("combine", rawQuick, `Keep ${names(rawQuick)} fresh for a crisp contrast.`);
    if (remainingBeans.length) act(technique.mode === "warm" ? "cook" : "combine", remainingBeans, technique.mode === "warm" ? `Warm ${names(remainingBeans)} in the pan for 3 minutes, then fold through the salad.` : `Fold through ${names(remainingBeans)}.`);
  } else if (technique.mode === "mash") {
    if (firm.length) act("cook", [oil, ...firm], `Simmer ${names(firm)} in a little water for 15–20 minutes until tender. Drain, then lightly crush the potatoes and fold the other vegetables through.`);
    if (remainingQuick.length) act("cook", [oil, ...remainingQuick], `Sauté ${names(remainingQuick)} for 4–6 minutes and fold through the crushed potatoes.`);
  } else {
    if (!roasted && firm.length && !firmUsed) act("cook", [oil, ...firm], `Cook ${names(firm)} for ${Math.max(...firm.map(item => item.cookMinutes))} minutes with a splash of water, until tender.`);
    if (remainingQuick.length) act("cook", [oil, ...remainingQuick], `Add ${names(remainingQuick)} and cook for 4–7 minutes until tender.`);
  }
  if (!isSalad && !roasted && tofu.length) act("cook", [oil, ...tofu], `Brown ${names(tofu)} for 6–8 minutes, until cooked through.`);
  if (!isSalad && remainingBeans.length) act("cook", remainingBeans, `Stir in ${names(remainingBeans)} and warm for 3–5 minutes.`);
  if (isSalad && liquid.length) act("combine", liquid, `Whisk ${names(liquid)} into the dressing and mix with the salad.`);
  if (!isSalad && (stock || liquid.length) && !liquidUsed) {
    const liquids = [...(stock ? [stock] : []), ...liquid];
    act("cook", [...liquids, ...(roasted ? roastables : [])], style === "Curry" ? `Add ${roasted ? "the roasted ingredients, " : ""}${liquid.length ? names(liquid) + " and " : ""}the stock or water and simmer for 5–10 minutes to bring the curry together.` : style === "Soup" || style === "Stew" ? `Add ${roasted ? "the roasted ingredients and " : ""}the stock${liquid.length ? ` with ${names(liquid)}` : ""} and simmer for 10–15 minutes until all vegetables are tender.` : `Stir in ${names(liquid)} and warm gently without boiling hard.`);
  }
  if (style === "Pasta" && technique.mode === "simmer") act("combine", [...firm, ...quick, ...tofu, ...beans], "Simmer the cooked vegetables with a splash of pasta water for 5 minutes to make a light sauce.");
  if (["Soup", "Curry", "Stew"].includes(style) && technique.mode === "simmer") act("cook", [...(stock ? [stock] : []), ...liquid, ...quick, ...beans], "Let the pot bubble gently for another 8–10 minutes so the vegetables and sauce come together; add a splash of water if it becomes too thick.");
  if (isSalad && stock) act("combine", [stock], "Use the stock to moisten the warm salad.");
  if (technique.mode === "blend") act("combine", [...firm, ...quick, ...beans, ...tofu], "Blend the cooked soup until smooth; add water as needed to adjust its consistency.");
  if (leaves.length) act(isSalad ? "combine" : "cook", leaves, isSalad ? `Fold in ${names(leaves)} just before serving.` : `Add ${names(leaves)} for the final 2–3 minutes, until just wilted.`);
  if (flavorId === "coconut milk" && liquid.some(item => item.id === "coconut milk")) act("cook", [flavorId], detail.use);
  else if (flavorId === "lemon" && finishing.some(item => item.id === "lemon")) act("finish", [flavorId], detail.use);
  else if (detail.line) act("combine", [flavorId], detail.use);
  if (chili) act("combine", [chili], `Add the chilli flakes a little at a time for ${options.heat.toLowerCase()} heat.`);
  const otherFinishing = finishing.filter(item => !(flavorId === "lemon" && item.id === "lemon"));
  if (otherFinishing.length) act("finish", otherFinishing, `Add ${names(otherFinishing)} off the heat just before serving.`);
  if (textureExtra) act("finish", [textureExtra], textureExtra === "texture-seeds" ? "Toast the pumpkin seeds in a dry pan and scatter them over the dish for crunch." : `Scatter ${textureExtra === "base-herbs" ? "fresh herbs" : "parsley"} over the dish.`);
  if (saladBase) act("serve", [saladBase], `Toss the prepared ingredients with the salad leaves.`);
  if (style === "Salad" && grain) act("serve", [grain], "Toss the prepared ingredients with the cooked couscous.");
  if (style === "Pasta" && grain) act("serve", [grain], "Toss the cooked vegetables and sauce with the pasta, adding reserved pasta water if needed.");
  if (style === "Curry" && grain) act("serve", [grain], "Serve the curry over the cooked rice.");
  if (bread) act("serve", [bread], "Serve with the crusty bread.");
  if (!actions.some(action => action.kind !== "prep" && action.ingredientIds.includes(oil))) act("combine", [oil], isSalad ? "Whisk the olive oil into the dressing." : "Finish with a little olive oil.");
  act("finish", [salt], "Taste and season with salt and black pepper before serving.");
  const spotlight = items.filter(item => !["aromatic", "finish", "liquid"].includes(item.role));
  const lead = spotlight[(options.round + index) % Math.max(spotlight.length, 1)] ?? items[0];
  const second = spotlight.filter(item => item !== lead)[(options.round + index) % Math.max(spotlight.length - 1, 1)];
  const title = `${lead.label}${second ? ` and ${second.label.toLowerCase()}` : ""} ${technique.label} · ${flavour.toLowerCase()}`;
  const prepMinutes = 6 + items.length * 2 + (servings > 2 ? 3 : 0);
  const firmMinutes = firm.length ? Math.max(...firm.map(item => item.cookMinutes)) : 0;
  const activeMinutes = roasted ? Math.max(firm.length ? 35 : 20, 15) + 5 :
    isSalad ? firmMinutes + (tofu.length ? 8 : 0) + (quick.length ? 5 : 0) + 5 :
    (aromatics.length ? 3 : 0) + (firmUsed ? Math.max(15, firmMinutes) : firmMinutes) +
    (quick.length ? 5 : 0) + (tofu.length ? 8 : 0) + (stock && !liquidUsed ? 10 : 0) + 5;
  const minutes = Math.max(technique.minutes, prepMinutes + activeMinutes);
  return { title, description: `${technique.label[0].toUpperCase()}${technique.label.slice(1)} with a ${flavour.toLowerCase()} finish and ${options.texture === "Surprise me" ? technique.texture.toLowerCase() : options.texture.toLowerCase()} texture.`, minutes, servings, lines, actions, technique, flavour };
}

export function generateRecipes(options: Options) {
  const selected = resolveIngredients(options.ingredients, options.customKinds);
  const selectionError = validateSelection(options.style, selected);
  if (selectionError) throw new Error(selectionError);
  const candidates = blueprints[options.style].techniques.map((technique, index) => makePlan(options, selected, technique, index));
  const valid = candidates.filter(plan => !validatePlan(plan, selected, options.pace));
  const setError = validateSet(valid);
  if (setError) throw new Error(setError);
  return valid.map((plan, index) => ({
    id: `${hash(`${selected.map(item => item.id).join("|")}|${options.style}|${options.weight}`)}-${options.round}-${plan.technique.id}`,
    title: plan.title, description: plan.description, minutes: plan.minutes, servings: plan.servings,
    ingredients: plan.lines.map(line => line.text), steps: plan.actions.map(action => action.text),
    whyItFits: `Uses all ${selected.length} chosen ingredient${selected.length === 1 ? "" : "s"}. Different cooking approach: ${plan.technique.label}.`
  }));
}
