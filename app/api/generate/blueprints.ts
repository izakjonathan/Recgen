import type { Ingredient } from "../../ingredient-catalogue";
export type Style = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
export type Feel = "Light" | "Hearty";
export type Texture = "Surprise me" | "Fresh" | "Tender" | "Crisp";
export type Flavour = "Surprise me" | "Herby" | "Citrus" | "Smoky" | "Spiced" | "Creamy" | "Umami";
export type Pace = "Any time" | "About 30 min" | "About 45 min";
export type Heat = "Mild" | "Medium" | "Hot";
export type Mode = "raw" | "warm" | "pan" | "mash" | "roast" | "broth" | "blend" | "simmer";
export type Technique = { id: string; label: string; mode: Mode; minutes: number; texture: Exclude<Texture, "Surprise me"> };
export type Action = { kind: "prep" | "cook" | "combine" | "finish" | "serve"; ingredientIds: string[]; text: string };
export type IngredientLine = { id: string; text: string };
export type Plan = { title: string; description: string; minutes: number; servings: number; lines: IngredientLine[]; actions: Action[]; technique: Technique; flavour: Exclude<Flavour, "Surprise me"> };

export const blueprints: Record<Style, { label: string; techniques: Technique[] }> = {
  Salad: { label: "salad", techniques: [
    { id: "chopped", label: "chopped salad", mode: "raw", minutes: 20, texture: "Fresh" },
    { id: "warm", label: "warm salad", mode: "warm", minutes: 28, texture: "Tender" },
    { id: "charred", label: "charred salad", mode: "roast", minutes: 38, texture: "Crisp" }
  ] },
  Potato: { label: "potato dish", techniques: [
    { id: "skillet", label: "potato skillet", mode: "pan", minutes: 30, texture: "Crisp" },
    { id: "crushed", label: "crushed potato bowl", mode: "mash", minutes: 32, texture: "Tender" },
    { id: "tray", label: "roasted potato tray", mode: "roast", minutes: 42, texture: "Crisp" }
  ] },
  Soup: { label: "soup", techniques: [
    { id: "broth", label: "bright broth", mode: "broth", minutes: 28, texture: "Fresh" },
    { id: "chunky", label: "chunky soup", mode: "simmer", minutes: 35, texture: "Tender" },
    { id: "smooth", label: "blended soup", mode: "blend", minutes: 38, texture: "Tender" }
  ] },
  Pasta: { label: "pasta", techniques: [
    { id: "skillet", label: "skillet pasta", mode: "pan", minutes: 25, texture: "Fresh" },
    { id: "saucy", label: "saucy pasta", mode: "simmer", minutes: 30, texture: "Tender" },
    { id: "roasted", label: "roasted vegetable pasta", mode: "roast", minutes: 42, texture: "Crisp" }
  ] },
  Curry: { label: "curry", techniques: [
    { id: "skillet", label: "spiced skillet curry", mode: "pan", minutes: 30, texture: "Fresh" },
    { id: "simmered", label: "slow-simmered curry", mode: "simmer", minutes: 38, texture: "Tender" },
    { id: "roasted", label: "roasted vegetable curry", mode: "roast", minutes: 45, texture: "Crisp" }
  ] },
  Stew: { label: "stew", techniques: [
    { id: "brothy", label: "brothy stew", mode: "broth", minutes: 32, texture: "Fresh" },
    { id: "rustic", label: "rustic stew", mode: "simmer", minutes: 40, texture: "Tender" },
    { id: "roasted", label: "roasted vegetable stew", mode: "roast", minutes: 45, texture: "Crisp" }
  ] }
};
export const names = (items: Ingredient[]) => {
  const words = items.map(item => item.label.toLowerCase());
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
};
export const paceLimit = (pace: Pace) => pace === "About 30 min" ? 30 : pace === "About 45 min" ? 45 : Infinity;
