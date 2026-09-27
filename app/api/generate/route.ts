export const runtime = "nodejs";

const styles = ["Salad", "Potato", "Soup", "Pasta", "Curry", "Stew"];
const schema = {
  type: "object",
  properties: {
    recipes: {
      type: "array", minItems: 3, maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" }, description: { type: "string" },
          minutes: { type: "integer" }, servings: { type: "integer" },
          ingredients: { type: "array", items: { type: "string" } },
          steps: { type: "array", items: { type: "string" } },
          whyItFits: { type: "string" }
        },
        required: ["title", "description", "minutes", "servings", "ingredients", "steps", "whyItFits"],
        additionalProperties: false
      }
    }
  }, required: ["recipes"], additionalProperties: false
} as const;

function validIngredients(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.length <= 40 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0 && item.length <= 60);
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid request." }, { status: 400 });
  const { style, weight, ingredients } = body as Record<string, unknown>;
  if (!styles.includes(style as string) || !["Light", "Hearty"].includes(weight as string) || !validIngredients(ingredients)) {
    return Response.json({ error: "Choose a style, a feel, and at least one ingredient." }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Recipe generation is not configured yet. Add OPENAI_API_KEY to the server environment." }, { status: 503 });
  }

  try {
    const result = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        store: false,
        instructions: "You are a practical home cook. Return exactly three genuinely different, appetising recipes. Respect the chosen dish style and light/hearty preference. Use every selected ingredient somewhere in each recipe when plausible; if that would make a poor dish, use most of them and keep the dish coherent. You may add ordinary pantry basics and a few other ingredients, listing all additions explicitly. Do not assume allergies or dietary restrictions. Give usable quantities for 2 servings, realistic cooking times, and concise numbered cooking steps. Never claim an ingredient was selected when it was not.",
        input: `Dish style: ${style}\nFeel: ${weight}\nSelected ingredients: ${(ingredients as string[]).map(x => x.trim()).join(", ")}\nMake the three ideas meaningfully distinct in flavour or preparation.`,
        text: { format: { type: "json_schema", name: "recipe_suggestions", strict: true, schema } }
      }),
      signal: AbortSignal.timeout(45000)
    });
    if (!result.ok) {
      const status = result.status === 429 ? 429 : 502;
      return Response.json({ error: status === 429 ? "Recipe generation is busy. Please try again shortly." : "Could not generate recipes right now. Check the API key and try again." }, { status });
    }
    const data = await result.json();
    const output = data.output?.flatMap((item: { content?: { type: string; text?: string }[] }) => item.content || [])
      .find((item: { type: string; text?: string }) => item.type === "output_text")?.text;
    if (typeof output !== "string") throw new Error("Missing output");
    const parsed = JSON.parse(output);
    if (!Array.isArray(parsed.recipes) || parsed.recipes.length !== 3) throw new Error("Invalid recipes");
    return Response.json({ recipes: parsed.recipes }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Something went wrong while generating recipes. Please try again." }, { status: 502 });
  }
}
