import { catalogue, pickRecipes, type Feel, type Style } from "./library";

export const runtime = "nodejs";

const styles: Style[] = ["Salad", "Potato", "Soup", "Pasta", "Curry", "Stew"];

export async function GET() {
  return Response.json({ count: catalogue.length, perStyleAndFeel: 20 });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || !styles.includes(body.style as Style) || !["Light", "Hearty"].includes(body.weight as string) ||
    !Array.isArray(body.ingredients) || body.ingredients.length < 1 || body.ingredients.length > 40 ||
    !body.ingredients.every((item: unknown) => typeof item === "string" && item.trim().length > 0 && item.length <= 60)) {
    return Response.json({ error: "Choose a style, a feel, and at least one ingredient." }, { status: 400 });
  }
  const seen = Array.isArray(body.seenIds) && body.seenIds.length <= 100 && body.seenIds.every((id: unknown) => typeof id === "string" && id.length <= 60) ? body.seenIds as string[] : [];
  const recipes = pickRecipes(body.style as Style, body.weight as Feel, (body.ingredients as string[]).map(item => item.trim()), seen);
  return Response.json({ recipes, count: catalogue.length, source: "library" }, { headers: { "Cache-Control": "no-store" } });
}
