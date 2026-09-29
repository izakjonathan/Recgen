export type Role = "firm" | "quick" | "aromatic" | "leaf" | "cookedProtein" | "tofu" | "finish" | "liquid";
export type CustomKind = "vegetable" | "cooked" | "fresh" | "sauce";
export type Ingredient = {
  id: string; label: string; value: number; unit: string; noun: string; plural?: string;
  role: Role; prep: string; cookMinutes: number; roastable: boolean; custom?: boolean;
};
type Definition = Omit<Ingredient, "id" | "label" | "custom">;
const item = (value: number, unit: string, noun: string, role: Role, prep: string, cookMinutes: number, roastable = false, plural?: string): Definition =>
  ({ value, unit, noun, plural, role, prep, cookMinutes, roastable });

export const catalogue: Record<string, Definition> = {
  potato: item(400, "g", "potatoes", "firm", "dice the potatoes into 2 cm pieces", 18, true),
  tomato: item(2, "", "tomato", "quick", "chop the tomatoes", 5, true, "tomatoes"),
  onion: item(1, "", "onion", "aromatic", "slice the onion", 6, true, "onions"),
  garlic: item(2, "clove", "garlic", "aromatic", "mince the garlic", 2, false),
  courgette: item(1, "", "courgette", "quick", "dice the courgette", 7, true, "courgettes"),
  carrot: item(2, "", "carrot", "firm", "thinly slice the carrots", 12, true, "carrots"),
  spinach: item(100, "g", "spinach", "leaf", "wash the spinach", 2),
  "butter beans": item(1, "tin", "cooked butter beans, drained", "cookedProtein", "drain and rinse the canned butter beans", 3, true),
  chickpeas: item(1, "tin", "cooked chickpeas, drained", "cookedProtein", "drain and rinse the canned chickpeas", 3, true),
  lentils: item(1, "tin", "cooked lentils, drained", "cookedProtein", "drain the cooked lentils", 3),
  tofu: item(200, "g", "firm tofu", "tofu", "pat dry and cube the tofu", 8, true),
  coriander: item(1, "handful", "coriander", "finish", "chop the coriander", 0),
  ginger: item(1, "tbsp", "grated ginger", "aromatic", "grate the ginger", 2),
  "coconut milk": item(200, "ml", "coconut milk", "liquid", "shake the coconut milk", 3),
  parmesan: item(35, "g", "Parmesan", "finish", "grate the Parmesan", 0),
  lemon: item(1, "", "lemon", "finish", "zest and juice the lemon", 0, false, "lemons"),
  cucumber: item(.5, "", "cucumber", "finish", "dice the cucumber", 0, false, "cucumbers"),
  feta: item(80, "g", "feta", "finish", "crumble the feta", 0),
  peas: item(150, "g", "peas", "quick", "measure the frozen peas", 3),
  mushrooms: item(200, "g", "mushrooms", "quick", "slice the mushrooms", 7, true),
  aubergine: item(1, "", "aubergine", "firm", "dice the aubergine small", 15, true, "aubergines"),
  broccoli: item(.5, "head", "broccoli", "firm", "cut the broccoli into small florets", 10, true),
  "sweet potato": item(1, "", "sweet potato", "firm", "peel and dice the sweet potato", 18, true, "sweet potatoes"),
  kale: item(100, "g", "kale", "leaf", "strip and chop the kale", 4),
  "red pepper": item(1, "", "red pepper", "quick", "slice the red pepper", 7, true, "red peppers"),
  "green beans": item(150, "g", "green beans", "firm", "trim and halve the green beans", 9, true),
  pumpkin: item(300, "g", "pumpkin", "firm", "peel and dice the pumpkin", 18, true),
  "white beans": item(1, "tin", "cooked white beans, drained", "cookedProtein", "drain and rinse the canned white beans", 3, true),
  rocket: item(50, "g", "rocket", "finish", "wash the rocket", 0),
  "spring onion": item(3, "", "spring onion", "finish", "slice the spring onions", 0, false, "spring onions"),
  celery: item(2, "stick", "celery", "aromatic", "slice the celery", 6)
};

export const normalize = (name: string) => name.trim().toLocaleLowerCase().replace(/\s+/g, " ");
const customDefinitions: Record<CustomKind, (name: string) => Definition> = {
  vegetable: name => item(150, "g", name.toLowerCase(), "quick", `wash and chop the ${name.toLowerCase()}`, 10, true),
  cooked: name => item(150, "g", name.toLowerCase(), "cookedProtein", `confirm the ${name.toLowerCase()} is already fully cooked and ready to eat`, 3),
  fresh: name => item(50, "g", name.toLowerCase(), "finish", `wash and prepare the ${name.toLowerCase()} for serving`, 0),
  sauce: name => item(150, "ml", name.toLowerCase(), "liquid", `prepare the ${name.toLowerCase()} according to its label`, 3)
};
export function resolveIngredients(names: string[], customKinds: Record<string, CustomKind>): Ingredient[] {
  return [...new Map(names.map(label => {
    const id = normalize(label);
    const known = catalogue[id];
    const kind = customKinds[id];
    if (!known && !customDefinitions[kind]) throw new Error(`Set a preparation type for ${label} in Edit list before generating.`);
    return [id, { id, label, ...(known ?? customDefinitions[kind](label)), custom: !known } as Ingredient];
  })).values()];
}
const numberText = (value: number) => {
  const whole = Math.floor(value), fraction = Math.round((value - whole) * 4);
  const part = ["", "¼", "½", "¾"][fraction] ?? "";
  return part ? `${whole || ""}${part}` : String(whole);
};
export function formatIngredient(ingredient: Ingredient, servings: number) {
  const amount = ingredient.value * servings / 2;
  const unit = ingredient.unit === "tin" && amount !== 1 ? "tins" : ingredient.unit === "clove" && amount !== 1 ? "cloves" : ingredient.unit === "stick" && amount !== 1 ? "sticks" : ingredient.unit === "handful" && amount !== 1 ? "handfuls" : ingredient.unit;
  const noun = !unit && ingredient.plural && amount !== 1 ? ingredient.plural : ingredient.noun;
  return [numberText(amount), unit, noun].filter(Boolean).join(" ");
}
