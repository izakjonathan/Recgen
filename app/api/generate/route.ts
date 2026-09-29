import { generateRecipes, type Feel, type Flavour, type Heat, type Pace, type Style, type Texture } from "./generator";
import { normalize, type CustomKind } from "../../ingredient-catalogue";

export const runtime = "nodejs";
const styles: Style[] = ["Salad", "Potato", "Soup", "Pasta", "Curry", "Stew"];
const flavours: Flavour[] = ["Surprise me", "Herby", "Citrus", "Smoky", "Spiced", "Creamy", "Umami"];
const textures: Texture[] = ["Surprise me", "Fresh", "Tender", "Crisp"];
const paces: Pace[] = ["Any time", "About 30 min", "About 45 min"];
const heats: Heat[] = ["Mild", "Medium", "Hot"];
const kinds: CustomKind[] = ["vegetable", "cooked", "fresh", "sauce"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || !styles.includes(body.style as Style) || !["Light", "Hearty"].includes(body.weight as string) ||
    !Array.isArray(body.ingredients) || body.ingredients.length < 1 || body.ingredients.length > 40 ||
    !body.ingredients.every((item: unknown) => typeof item === "string" && item.trim().length > 0 && item.length <= 60) ||
    !flavours.includes(body.flavour as Flavour) || !textures.includes(body.texture as Texture) ||
    !paces.includes(body.pace as Pace) || !heats.includes(body.heat as Heat) ||
    !Number.isInteger(body.servings) || ![2, 4, 6].includes(body.servings as number) ||
    !Number.isInteger(body.round) || (body.round as number) < 0 || (body.round as number) > 1_000_000 ||
    !body.customKinds || typeof body.customKinds !== "object" || Array.isArray(body.customKinds) ||
    Object.entries(body.customKinds).length > 100 || !Object.entries(body.customKinds).every(([key, kind]) => key.length <= 60 && kinds.includes(kind as CustomKind))) {
    return Response.json({ error: "Choose a dish, ingredients, feel and valid preferences." }, { status: 400 });
  }
  const ingredients = [...new Map((body.ingredients as string[]).map(item => [normalize(item), item.trim()])).values()];
  try {
    const recipes = generateRecipes({ style: body.style as Style, weight: body.weight as Feel, ingredients,
      customKinds: Object.fromEntries(Object.entries(body.customKinds).map(([name, kind]) => [normalize(name), kind])) as Record<string, CustomKind>,
      flavour: body.flavour as Flavour, texture: body.texture as Texture, pace: body.pace as Pace, heat: body.heat as Heat,
      servings: body.servings as number, round: body.round as number });
    return Response.json({ recipes, source: "validated-blueprints" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not make a valid recipe." }, { status: 422 });
  }
}
