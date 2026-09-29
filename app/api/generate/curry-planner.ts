import { catalogue, formatIngredient, type Ingredient } from "../../ingredient-catalogue";
import { names, paceLimit, type Action, type Plan, type Technique } from "./blueprints";
import type { Options } from "./generator";

type State = "raw" | "prepared" | "cooked" | "in-dish";
type Step = Action & { minutes: number; from: State[]; to: State; tool: "board" | "hob" | "oven" | "bowl" };
type CurryPlan = Plan & { steps: Step[]; states: Map<string, State>; mode: Mode; score: number };
type Mode = "saucy" | "dry" | "crushed" | "roasted" | "brothy";
const modes: { mode: Mode; label: string; texture: Technique["texture"] }[] = [
  { mode: "saucy", label: "saucy vegetable curry", texture: "Tender" },
  { mode: "dry", label: "spiced curry skillet", texture: "Crisp" },
  { mode: "crushed", label: "thick crushed vegetable curry", texture: "Tender" },
  { mode: "roasted", label: "roast and simmer curry", texture: "Crisp" },
  { mode: "brothy", label: "light curry broth", texture: "Fresh" }
];
const named = (xs: Ingredient[]) => names(xs);
const maxTime = (xs: Ingredient[]) => xs.length ? Math.max(...xs.map(x => x.cookMinutes)) : 0;
const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

// A plan stores transitions first. Prose is written with the exact ingredients consumed by each action.
function build(options: Options, selected: Ingredient[], mode: Mode, variant: number): CurryPlan | null {
  const all = [...selected];
  if (options.weight === "Hearty" && !all.some(x => ["tofu", "cookedProtein"].includes(x.role))) {
    all.push({ ...catalogue.chickpeas, id: "chickpeas", label: "Chickpeas" });
  }
  const lines = new Map<string, string>();
  const states = new Map<string, State>();
  const steps: Step[] = [];
  const add = (id: string, text: string) => { if (!lines.has(id)) { lines.set(id, text); states.set(id, "raw"); } return id; };
  for (const x of all) add(x.id, formatIngredient(x, options.servings));
  const extra = (id: string, text: string) => add(id, text);
  const step = (kind: Action["kind"], ids: string[], text: string, minutes: number, tool: Step["tool"], to: State) => {
    if (!ids.length) return;
    const from = ids.map(id => { const state = states.get(id); if (!state) throw new Error(`Unlisted ingredient: ${id}`); return state; });
    for (const id of ids) states.set(id, to);
    steps.push({ kind, ingredientIds: [...new Set(ids)], text, minutes, tool, from, to });
  };
  const prep = (xs: Ingredient[]) => { if (xs.length) step("prep", xs.map(x => x.id), `Prepare ${named(xs)}: ${xs.map(x => x.prep).join("; ")}.`, 5 + Math.ceil(xs.length * 1.3), "board", "prepared"); };
  const byRole = (role: Ingredient["role"]) => all.filter(x => x.role === role);
  const aromatics = byRole("aromatic"), firm = byRole("firm"), quick = byRole("quick"), tofu = byRole("tofu"), beans = byRole("cookedProtein"), leaves = byRole("leaf"), garnish = byRole("finish"), liquid = byRole("liquid");
  const root = firm.filter(x => !["broccoli", "green beans"].includes(x.id));
  const tender = [...firm.filter(x => ["broccoli", "green beans"].includes(x.id)), ...quick];
  const roastable = [...root, ...tender.filter(x => x.roastable), ...tofu];
  if (mode === "roasted" && !roastable.length) return null;
  if (mode === "crushed" && !root.length && !beans.length) return null;
  if (mode === "brothy" && liquid.some(x => x.id === "coconut milk")) return null;
  if (mode === "brothy" && options.weight === "Hearty") return null;
  const oil = extra("pantry-oil", `${options.servings / 2} tbsp neutral oil`);
  const spice = extra("pantry-spice", variant % 3 === 0 ? "1 tbsp mild curry powder" : variant % 3 === 1 ? "1 tsp ground cumin and ½ tsp turmeric" : "1 tsp garam masala and ½ tsp ground coriander");
  const salt = extra("pantry-salt", "Salt, to taste");
  const water = mode === "dry" ? null : extra("pantry-water", `${mode === "brothy" ? 500 : mode === "crushed" ? 120 : 180} ml water or vegetable stock`);
  const rice = options.weight === "Hearty" && mode !== "crushed" ? extra("base-rice", `${150 * options.servings / 2} g dry rice`) : null;
  const chili = options.heat === "Mild" ? null : extra("pantry-chili", options.heat === "Hot" ? "1 tsp chilli flakes" : "¼ tsp chilli flakes");
  const seeds = options.texture === "Crisp" && mode !== "roasted" ? extra("finish-seeds", "2 tbsp pumpkin seeds") : null;
  let finish: string | null = null;
  if (options.flavour === "Citrus" && !all.some(x => x.id === "lemon")) finish = extra("finish-lemon", "½ lemon");
  if (options.flavour === "Creamy" && !liquid.length) finish = extra("finish-yogurt", "100 g plain yogurt");
  if (options.flavour === "Umami") finish = extra("finish-soy", "1 tbsp soy sauce");
  if (options.flavour === "Smoky") finish = extra("finish-paprika", "1 tsp smoked paprika");
  if (options.flavour === "Herby" && !garnish.some(x => x.id === "coriander")) finish = extra("finish-herbs", "1 tbsp chopped coriander");
  prep(all);
  const prepMinutes = steps[0]?.minutes ?? 5;
  if (rice) step("cook", [rice], "Cook the rice according to its packet instructions while the curry cooks.", 18, "hob", "cooked");
  const aromaticBase = aromatics.filter(x => ["onion", "celery"].includes(x.id));
  const aromaticLate = aromatics.filter(x => !aromaticBase.includes(x));
  const panOil = mode === "roasted" ? extra("pan-oil", "1 tsp neutral oil") : oil;
  if (mode === "roasted") {
    step("cook", [oil, ...roastable.map(x => x.id)], `Heat the oven to 210°C. Spread ${named(roastable)} on a roomy tray with the oil. Roast for ${root.length ? "25–30" : "18–22"} minutes, turning halfway, until tender and browned.`, root.length ? 30 : 22, "oven", "cooked");
  }
  if (aromaticBase.length) step("cook", [panOil, ...aromaticBase.map(x => x.id)], `Soften ${named(aromaticBase)} in the oil for 5–6 minutes.`, 6, "hob", "in-dish");
  if (aromaticLate.length) step("cook", [panOil, ...aromaticLate.map(x => x.id)], `Add ${named(aromaticLate)} and stir for 1 minute.`, 1, "hob", "in-dish");
  step("cook", [panOil, spice, ...(chili ? [chili] : []), ...(finish === "finish-paprika" ? [finish] : [])], `Stir in ${variant % 3 === 0 ? "the curry powder" : variant % 3 === 1 ? "the cumin and turmeric" : "the garam masala and ground coriander"} ${chili ? "and chilli flakes " : ""}${finish === "finish-paprika" ? "and smoked paprika " : ""}with the oil for 30 seconds so the spices become fragrant.`, 1, "hob", "in-dish");
  if (mode === "dry") {
    const tenderTime = tender.length ? Math.max(5, maxTime(tender)) : 0;
    if (root.length) step("cook", root.map(x => x.id), `Add ${named(root)} with a splash of water. Cover and cook for ${Math.max(4, maxTime(root) - tenderTime)} minutes.`, Math.max(4, maxTime(root) - tenderTime), "hob", "in-dish");
    if (tender.length) step("cook", tender.map(x => x.id), `Add ${named(tender)} and stir-fry for ${tenderTime} minutes until all the vegetables are tender and the water has evaporated.`, tenderTime, "hob", "in-dish");
    if (liquid.length) step("combine", liquid.map(x => x.id), `Pour in ${named(liquid)} and stir over medium heat for 3–5 minutes until it coats the vegetables.`, 5, "hob", "in-dish");
  } else if (mode === "roasted") {
    const unroasted = all.filter(x => [...root, ...tender, ...tofu].includes(x) && !roastable.includes(x));
    if (unroasted.length) step("cook", unroasted.map(x => x.id), `Cook ${named(unroasted)} in the pan for ${maxTime(unroasted)} minutes until tender.`, maxTime(unroasted), "hob", "in-dish");
  } else {
    const tenderTime = tender.length ? Math.max(5, maxTime(tender)) : 0;
    const firstTime = root.length ? Math.max(4, maxTime(root) - tenderTime) : 3;
    if (root.length) step("cook", [water!, ...root.map(x => x.id), ...liquid.map(x => x.id)], `Pour in ${named(liquid).length ? named(liquid) + " and " : ""}the water or stock. Add ${named(root)} and simmer for ${firstTime} minutes.`, firstTime, "hob", "in-dish");
    else step("cook", [water!, ...liquid.map(x => x.id)], `Pour in ${named(liquid).length ? named(liquid) + " and " : ""}the water or stock and bring to a gentle simmer.`, 3, "hob", "in-dish");
    if (tender.length) step("cook", tender.map(x => x.id), `Add ${named(tender)} and simmer for ${tenderTime} minutes, until ${named([...root, ...tender])} are tender.`, tenderTime, "hob", "in-dish");
    else if (root.length) step("cook", root.map(x => x.id), `Continue simmering ${named(root)} for ${Math.max(0, maxTime(root) - firstTime)} minutes until tender.`, Math.max(0, maxTime(root) - firstTime), "hob", "in-dish");
  }
  if (tofu.length && mode !== "roasted") step("cook", tofu.map(x => x.id), `Meanwhile, brown ${named(tofu)} in a separate hot pan for 6–8 minutes, then add to the curry.`, 8, "hob", "in-dish");
  if (beans.length) step("cook", beans.map(x => x.id), `Fold in ${named(beans)} and heat through for 3–5 minutes.`, 5, "hob", "in-dish");
  if (mode === "crushed") step("combine", root.length ? root.map(x => x.id) : beans.map(x => x.id), `Lightly crush some of the cooked ${named(root.length ? root : beans)} into the sauce to make the curry thick and spoonable.`, 2, "hob", "in-dish");
  if (mode === "roasted") step("combine", [water!, oil, ...liquid.map(x => x.id), ...roastable.map(x => x.id)], `Pour in ${named(liquid).length ? named(liquid) + " and " : ""}the water or stock, then fold in ${named(roastable)}. Simmer together for 5 minutes.`, 5, "hob", "in-dish");
  if (leaves.length) step("combine", leaves.map(x => x.id), `Fold in ${named(leaves)} for the last 2–3 minutes, until wilted.`, 3, "hob", "in-dish");
  if (garnish.length) step("finish", garnish.map(x => x.id), `Finish with ${named(garnish)} just before serving.`, 1, "bowl", "in-dish");
  if (finish && finish !== "finish-paprika") step("finish", [finish], finish === "finish-yogurt" ? "Turn off the heat and swirl in the yogurt without boiling it." : finish === "finish-lemon" ? "Squeeze the lemon over the curry off the heat." : finish === "finish-soy" ? "Stir in the soy sauce, then taste before adding salt." : "Scatter the coriander over the curry.", 1, "bowl", "in-dish");
  if (seeds) step("finish", [seeds], "Toast the pumpkin seeds in a dry pan and scatter them over the curry.", 2, "hob", "in-dish");
  step("finish", [salt], "Taste the curry and add salt as needed.", 1, "bowl", "in-dish");
  if (rice) step("serve", [rice], "Spoon the curry over the cooked rice.", 1, "bowl", "in-dish");
  const technique = { id: mode, label: modes.find(x => x.mode === mode)!.label, mode: mode === "roasted" ? "roast" as const : mode === "crushed" ? "mash" as const : mode === "brothy" ? "broth" as const : "pan" as const, minutes: 0, texture: modes.find(x => x.mode === mode)!.texture };
  const hobMinutes = steps.filter(x => x.tool === "hob" && x.ingredientIds[0] !== rice && !x.ingredientIds.some(id => tofu.some(t => t.id === id))).reduce((n, x) => n + x.minutes, 0);
  const tofuMinutes = tofu.length && mode !== "roasted" ? 8 : 0;
  const ovenMinutes = steps.filter(x => x.tool === "oven").reduce((n, x) => n + x.minutes, 0);
  const finishMinutes = steps.filter(x => ["finish", "serve"].includes(x.kind)).reduce((n, x) => n + x.minutes, 0);
  // Rice cooks alongside the curry; the roast and hob sauce are prepared in parallel.
  const minutes = prepMinutes + Math.max(hobMinutes, ovenMinutes, tofuMinutes, rice ? 18 : 0) + finishMinutes;
  const score = (mode === "saucy" ? 4 : 0) + ((options.round + modes.findIndex(x => x.mode === mode) * 2) % 5) + (options.texture !== "Surprise me" && options.texture === technique.texture ? 4 : 0) + (options.weight === "Light" && mode === "brothy" ? 3 : 0) + (options.weight === "Hearty" && mode === "crushed" ? 3 : 0) + (variant === options.round % 3 ? 2 : 0) - minutes / 30;
  return { title: technique.label[0].toUpperCase() + technique.label.slice(1) + (root.length ? ` with ${root[0].label.toLowerCase()}` : beans.length ? ` with ${beans[0].label.toLowerCase()}` : ""),
    description: `${options.flavour === "Surprise me" ? "Warmly spiced" : options.flavour} · ${technique.texture} texture`, minutes, servings: options.servings,
    lines: [...lines].map(([id, text]) => ({ id, text })), actions: steps, steps, technique, flavour: options.flavour === "Surprise me" ? "Spiced" : options.flavour,
    mode, score, states };
}

function validate(plan: CurryPlan, selected: Ingredient[], limit: number) {
  if (plan.minutes > limit) return false;
  const listed = new Set(plan.lines.map(x => x.id));
  if (listed.size !== plan.lines.length) return false;
  const prepared = new Set(plan.steps.filter(s => s.kind === "prep").flatMap(s => s.ingredientIds));
  const used = new Set(plan.steps.filter(s => s.kind !== "prep").flatMap(s => s.ingredientIds));
  if (plan.lines.some(x => !used.has(x.id) || plan.states.get(x.id) !== "in-dish")) return false;
  if (selected.some(x => !listed.has(x.id) || !prepared.has(x.id) || !used.has(x.id))) return false;
  if (plan.steps.some(s => s.ingredientIds.some(id => !listed.has(id)) || s.from.some((state, index) => state === "raw" && s.kind !== "prep" && selected.some(i => i.id === s.ingredientIds[index])))) return false;
  return true;
}

export function generateCurries(options: Options, selected: Ingredient[]) {
  if (selected.some(x => x.id === "parmesan")) throw new Error("Parmesan does not fit the supported curry methods. Remove it or choose a different dish.");
  const variants = [0, 1, 2];
  const candidates = modes.flatMap(x => variants.map(variant => build(options, selected, x.mode, variant))).filter((x): x is CurryPlan => !!x && validate(x, selected, paceLimit(options.pace)));
  candidates.sort((a, b) => b.score - a.score || hash(`${a.mode}|${a.flavour}|${options.round}`) - hash(`${b.mode}|${b.flavour}|${options.round}`));
  const chosen: CurryPlan[] = [];
  for (const candidate of candidates) if (!chosen.some(x => x.mode === candidate.mode)) { chosen.push(candidate); if (chosen.length === 3) break; }
  if (chosen.length < 3) throw new Error(`These ingredients cannot make three distinct curries in ${options.pace === "Any time" ? "the available methods" : options.pace.toLowerCase()}. Try a longer time or fewer ingredients.`);
  return chosen.map(x => ({ id: `${hash(`${selected.map(i => i.id).join("|")}|${options.round}|${x.mode}`)}`, title: x.title, description: x.description, minutes: x.minutes, servings: x.servings,
    ingredients: x.lines.map(y => y.text), steps: x.steps.map(s => s.text) }));
}
