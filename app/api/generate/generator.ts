export type Style = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
export type Feel = "Light" | "Hearty";
export type Flavour = "Surprise me" | "Herby" | "Citrus" | "Smoky" | "Spiced" | "Creamy" | "Umami";
export type Texture = "Surprise me" | "Fresh" | "Tender" | "Crisp";
export type Pace = "Any time" | "About 30 min" | "About 45 min";
export type Heat = "Mild" | "Medium" | "Hot";
export type Options = { style: Style; weight: Feel; ingredients: string[]; flavour: Flavour; texture: Texture; pace: Pace; heat: Heat; servings: number; round: number };

type Role = "firm" | "quick" | "protein" | "leaf" | "aromatic" | "finish" | "liquid";
type Ingredient = { amount: string; role: Role; prep: string; name: string };
const known: Record<string, Ingredient> = {
  potato: { amount: "400 g", role: "firm", prep: "dice the potatoes into 2 cm pieces", name: "potatoes" },
  tomato: { amount: "2", role: "quick", prep: "chop the tomatoes", name: "tomatoes" },
  onion: { amount: "1", role: "aromatic", prep: "slice the onion", name: "onion" },
  garlic: { amount: "2", role: "aromatic", prep: "mince the garlic cloves", name: "garlic cloves" },
  courgette: { amount: "1", role: "quick", prep: "dice the courgette", name: "courgette" },
  carrot: { amount: "2", role: "firm", prep: "thinly slice the carrots", name: "carrots" },
  spinach: { amount: "100 g", role: "leaf", prep: "wash the spinach", name: "spinach" },
  "butter beans": { amount: "1 tin", role: "protein", prep: "drain and rinse the butter beans", name: "butter beans" },
  chickpeas: { amount: "1 tin", role: "protein", prep: "drain and rinse the chickpeas", name: "chickpeas" },
  lentils: { amount: "1 tin cooked", role: "protein", prep: "drain the cooked lentils", name: "lentils" },
  tofu: { amount: "200 g", role: "protein", prep: "pat dry and cube the tofu", name: "firm tofu" },
  coriander: { amount: "1 handful", role: "finish", prep: "chop the coriander", name: "coriander" },
  ginger: { amount: "1 tbsp", role: "aromatic", prep: "grate the ginger", name: "fresh ginger" },
  "coconut milk": { amount: "200 ml", role: "liquid", prep: "shake the coconut milk", name: "coconut milk" },
  parmesan: { amount: "35 g", role: "finish", prep: "grate the Parmesan", name: "Parmesan" },
  lemon: { amount: "1", role: "finish", prep: "zest and juice the lemon", name: "lemon" },
  cucumber: { amount: "½", role: "finish", prep: "dice the cucumber", name: "cucumber" },
  feta: { amount: "80 g", role: "finish", prep: "crumble the feta", name: "feta" },
  peas: { amount: "150 g", role: "quick", prep: "measure the peas", name: "peas" },
  mushrooms: { amount: "200 g", role: "quick", prep: "slice the mushrooms", name: "mushrooms" },
  aubergine: { amount: "1", role: "firm", prep: "dice the aubergine small", name: "aubergine" },
  broccoli: { amount: "½ head", role: "firm", prep: "cut the broccoli into small florets", name: "broccoli" },
  "sweet potato": { amount: "1", role: "firm", prep: "peel and dice the sweet potato", name: "sweet potato" },
  kale: { amount: "100 g", role: "leaf", prep: "strip and chop the kale", name: "kale" },
  "red pepper": { amount: "1", role: "quick", prep: "slice the red pepper", name: "red pepper" },
  "green beans": { amount: "150 g", role: "firm", prep: "trim and halve the green beans", name: "green beans" },
  pumpkin: { amount: "300 g", role: "firm", prep: "peel and dice the pumpkin", name: "pumpkin" },
  "white beans": { amount: "1 tin", role: "protein", prep: "drain and rinse the white beans", name: "white beans" },
  rocket: { amount: "50 g", role: "finish", prep: "wash the rocket", name: "rocket" },
  "spring onion": { amount: "3", role: "finish", prep: "slice the spring onions", name: "spring onions" },
  celery: { amount: "2 sticks", role: "aromatic", prep: "slice the celery", name: "celery" },
};
const profiles: Record<Exclude<Flavour, "Surprise me">, { extras: string[]; sauce: string; finish: string }> = {
  Herby: { extras: ["1 tsp dried mixed herbs"], sauce: "Stir through the herbs and warm for one minute.", finish: "Finish with another pinch of herbs." },
  Citrus: { extras: ["1 tbsp lemon juice"], sauce: "Add lemon juice off the heat for a bright finish.", finish: "Taste for acidity before serving." },
  Smoky: { extras: ["1 tsp smoked paprika"], sauce: "Warm the smoked paprika in a spoonful of oil for 30 seconds, then fold it through.", finish: "Finish with a pinch of smoked paprika." },
  Spiced: { extras: ["1 tsp ground cumin", "½ tsp ground turmeric"], sauce: "Warm the cumin and turmeric in a spoonful of oil for 30 seconds, then fold the spices through.", finish: "Taste the spices and adjust the seasoning." },
  Creamy: { extras: ["2 tbsp plain yogurt or plant-based yogurt"], sauce: "Take off the heat and swirl through the yogurt; do not boil it.", finish: "Add a little yogurt on top." },
  Umami: { extras: ["1 tsp white miso"], sauce: "Dissolve the miso in a spoonful of warm water and stir it through off the heat.", finish: "Taste before adding more salt." }
};
const flavourNames = Object.keys(profiles) as Exclude<Flavour, "Surprise me">[];
const techniques: Record<Style, { name: string; texture: Exclude<Texture, "Surprise me">; minutes: number }[]> = {
  Salad: [{ name: "chopped bowl", texture: "Fresh", minutes: 25 }, { name: "warm salad", texture: "Tender", minutes: 30 }, { name: "charred salad", texture: "Crisp", minutes: 35 }],
  Potato: [{ name: "skillet", texture: "Tender", minutes: 30 }, { name: "crisp tray", texture: "Crisp", minutes: 40 }, { name: "bowl", texture: "Fresh", minutes: 30 }],
  Soup: [{ name: "chunky soup", texture: "Tender", minutes: 30 }, { name: "blended soup", texture: "Tender", minutes: 35 }, { name: "bright broth", texture: "Fresh", minutes: 30 }],
  Pasta: [{ name: "saucy pasta", texture: "Tender", minutes: 25 }, { name: "crisp-topped pasta", texture: "Crisp", minutes: 35 }, { name: "fresh pasta bowl", texture: "Fresh", minutes: 25 }],
  Curry: [{ name: "saucy curry", texture: "Tender", minutes: 30 }, { name: "roasted vegetable curry", texture: "Crisp", minutes: 40 }, { name: "bright curry bowl", texture: "Fresh", minutes: 30 }],
  Stew: [{ name: "rustic stew", texture: "Tender", minutes: 40 }, { name: "roasted vegetable stew", texture: "Crisp", minutes: 45 }, { name: "brothy stew", texture: "Fresh", minutes: 35 }]
};
const key = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
const list = (names: string[]) => names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
const hash = (value: string) => { let n = 2166136261; for (const character of value) n = Math.imul(n ^ character.charCodeAt(0), 16777619); return n >>> 0; };
const scale = (amount: string, servings: number) => {
  const match = amount.match(/^(\d+(?:\.\d+)?)\b/);
  if (!match) return amount; // Keep sensible fractional units (½ cucumber, etc.) as written.
  const value = Number(match[1]) * servings / 2;
  return `${Number.isInteger(value) ? value : Number(value.toFixed(1))}${amount.slice(match[1].length)}`;
};

type Item = Ingredient & { label: string; custom: boolean };
function makeRecipe(options: Options, variant: number) {
  const { style, weight, ingredients: selected, pace, heat, servings } = options;
  const seed = hash(`${style}|${weight}|${selected.map(key).join("|")}|${options.round}`);
  const items: Item[] = [...new Map(selected.map(label => {
    const normalized = key(label);
    return [normalized, { ...(known[normalized] ?? { amount: "150 g", role: "quick", prep: `prepare ${label} safely according to its package instructions`, name: label }), label, custom: !known[normalized] } as Item];
  })).values()];
  const matching = techniques[style].filter(t => options.texture === "Surprise me" || t.texture === options.texture);
  const timeLimit = pace === "About 30 min" ? 30 : pace === "About 45 min" ? 45 : Infinity;
  const timely = matching.filter(t => t.minutes <= timeLimit);
  const choice = (timely.length ? timely : matching)[(options.round * 3 + variant) % (timely.length || matching.length)];
  const profileName = options.flavour === "Surprise me" ? flavourNames[(seed + variant) % flavourNames.length] : options.flavour;
  const profile = profiles[profileName];
  const order = [...items].filter(item => item.role !== "liquid" && item.role !== "finish");
  const lead = order.length ? order[(options.round + variant) % order.length] : items[(options.round + variant) % items.length];
  const second = order.filter(item => item !== lead)[(options.round + variant) % Math.max(1, order.length - 1)];
  const title = `${profileName} ${lead.label.toLowerCase()}${second ? ` and ${second.label.toLowerCase()}` : ""} ${choice.name}`;
  const grouped = (roles: Role[]) => items.filter(item => roles.includes(item.role)).map(item => item.name.toLowerCase());
  const potatoAnchor = style === "Potato" && !items.some(item => ["potato", "sweet potato"].includes(key(item.label))) ? ["potatoes"] : [];
  const aromatics = grouped(["aromatic"]), firm = [...potatoAnchor, ...grouped(["firm"])], quick = grouped(["quick"]), proteins = grouped(["protein"]), leaves = grouped(["leaf"]), finish = grouped(["finish"]), liquid = grouped(["liquid"]);
  const base: Record<Style, string> = {
    Salad: weight === "Hearty" ? `${scale("120 g", servings)} dry couscous` : `${scale("50 g", servings)} salad leaves`,
    Potato: weight === "Hearty" ? `${scale("1 tin", servings)} cooked white beans, drained` : `${scale("50 g", servings)} salad leaves`,
    Soup: weight === "Hearty" ? `${servings} slices crusty bread` : "fresh herbs, to finish",
    Pasta: `${scale(weight === "Hearty" ? "220 g" : "160 g", servings)} dried pasta`,
    Curry: `${scale(weight === "Hearty" ? "150 g" : "100 g", servings)} dry rice`,
    Stew: weight === "Hearty" ? `${servings} slices crusty bread` : "fresh herbs, to finish"
  };
  const pantry = style === "Soup" || style === "Stew" ? [`${scale("600 ml", servings)} vegetable stock`] : style === "Curry" ? [liquid.length ? "150 ml water, as needed" : "250 ml vegetable stock or water"] : [];
  const selectedLines = items.map(item => `${scale(item.amount, servings)} ${item.name}`);
  if (style === "Potato" && !items.some(item => ["potato", "sweet potato"].includes(key(item.label)))) selectedLines.unshift(`${scale("400 g", servings)} potatoes`);
  const extraLines = profile.extras.filter(extra => !items.some(item => key(extra).includes(key(item.label))));
  const chilli = heat === "Mild" ? [] : [heat === "Hot" ? "1 tsp chilli flakes" : "¼ tsp chilli flakes"];
  const allLines = [...selectedLines, base[style], ...pantry, ...extraLines, ...chilli, "1 tbsp olive oil", "Salt and black pepper, to taste"];
  const prep = `Prepare the chosen ingredients: ${list(items.map(item => item.prep))}${style === "Potato" && !items.some(item => ["potato", "sweet potato"].includes(key(item.label))) ? "; dice the added potatoes into 2 cm pieces" : ""}.`;
  const steps = [prep];
  if (style === "Pasta") steps.push("Cook the pasta in salted water until just tender, reserving a mug of pasta water before draining.");
  if (style === "Curry") steps.push("Cook the rice according to its packet instructions.");
  if (style === "Salad" && weight === "Hearty") steps.push("Cook the couscous according to its packet instructions, then fluff it with a fork.");
  const roasted = choice.texture === "Crisp";
  if (roasted && (firm.length || quick.length || proteins.length)) {
    steps.push(`Heat the oven to 210°C. Toss ${list([...firm, ...quick, ...proteins])} with olive oil and a pinch of salt. Roast on a tray for ${firm.length ? "25–35" : "15–20"} minutes until cooked through and browned, turning halfway. Make sure tofu and any custom ingredients are cooked safely.`);
  } else if (style === "Salad") {
    if (firm.length || proteins.includes("firm tofu")) steps.push(`Cook ${list([...firm, ...proteins.filter(p => p === "firm tofu")])} in a pan with a little oil until tender and fully cooked; cool slightly.`);
    if (quick.length) steps.push(choice.texture === "Fresh" ? `Leave ${list(quick)} fresh and chopped for crunch.` : `Briefly sauté ${list(quick)} in a little oil until tender.`);
  } else {
    if (aromatics.length) steps.push(`Warm the olive oil in a large pan and cook ${list(aromatics)} for 2–3 minutes until fragrant.`);
    if (firm.length || quick.length) steps.push(`Add ${list([...firm, ...quick])}${roasted ? " from the roasting tray" : " to the pan"}. ${roasted ? "Stir gently." : `Cook for ${firm.length ? "8–12" : "4–6"} minutes, stirring; add a splash of water if needed.`}`);
    if (style === "Soup" || style === "Stew") steps.push(`Pour in the vegetable stock and simmer ${style === "Stew" ? "15–20" : "10–15"} minutes, until all firm vegetables are tender.`);
    if (style === "Curry") steps.push(`Add ${liquid.length ? list(liquid) : "the stock or water"} and simmer for 8–12 minutes, until the vegetables are cooked through.`);
    if (proteins.length) steps.push(`Stir in ${list(proteins)}${roasted ? " from the tray" : ""} and heat through for 3–5 minutes.${proteins.includes("firm tofu") ? " Cook tofu thoroughly." : ""}`);
  }
  if (liquid.length && style !== "Curry") steps.push(`Stir in ${list(liquid)} and warm gently${style === "Salad" ? " as a dressing, then let cool" : " without boiling hard"}.`);
  if (leaves.length) steps.push(style === "Salad" ? `Keep ${list(leaves)} fresh and fold through just before serving.` : `Stir in ${list(leaves)} for the last 2–3 minutes until wilted.`);
  if (style === "Soup" && choice.name === "blended soup") steps.push("Blend the soup until smooth, then return it to the pan; thin with water if needed.");
  steps.push(profile.sauce);
  if (heat !== "Mild") steps.push(`Add the chilli flakes a little at a time for ${heat.toLowerCase()} heat.`);
  if (style === "Salad") steps.push(`Toss everything with ${weight === "Hearty" ? "the couscous" : "the salad leaves"}.`);
  if (style === "Pasta") steps.push("Toss the vegetables with the pasta, adding reserved pasta water until glossy.");
  if (style === "Potato") steps.push(`Serve with ${weight === "Hearty" ? "warmed white beans" : "salad leaves"}.`);
  if (style === "Curry") steps.push("Spoon the curry over the cooked rice.");
  if (style === "Soup" || style === "Stew") steps.push(weight === "Hearty" ? "Serve with the crusty bread." : "Scatter fresh herbs over the bowl.");
  if (finish.length) steps.push(`Add ${list(finish)} at the end, off the heat${style === "Salad" ? "" : ", so they keep their fresh flavour"}.`);
  if (items.some(item => item.custom)) steps.push(`For ${list(items.filter(item => item.custom).map(item => item.label.toLowerCase()))}, follow any required cooking and food safety instructions on the packaging before serving.`);
  steps.push(`${profile.finish} Taste and season with salt and black pepper.`);
  return { id: `${hash(selected.map(key).join("|"))}-${options.round}-${variant}`, title: title.charAt(0).toUpperCase() + title.slice(1), description: `${choice.name.charAt(0).toUpperCase()}${choice.name.slice(1)} with a ${profileName.toLowerCase()} finish. ${weight === "Hearty" ? "A filling" : "A lighter"} version with ${heat.toLowerCase()} heat.`, minutes: choice.minutes, servings, ingredients: allLines, steps, whyItFits: `Uses all ${items.length} chosen ingredient${items.length === 1 ? "" : "s"}.` };
}
export function generateRecipes(options: Options) { return [0, 1, 2].map(variant => makeRecipe(options, variant)); }
