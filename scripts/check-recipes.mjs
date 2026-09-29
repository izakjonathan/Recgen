import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const port = 32589;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "ignore" });
const url = `http://127.0.0.1:${port}/api/generate`;
async function request(overrides = {}) {
  const body = {
    style: "Curry", weight: "Hearty", ingredients: ["potato", "courgette", "tofu", "onion", "garlic", "ginger", "coconut milk"],
    customKinds: {}, flavour: "Surprise me", texture: "Surprise me", pace: "Any time", heat: "Mild", servings: 2, round: 0, ...overrides
  };
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  return { body, response, data };
}
try {
  let ready = false;
  for (let n = 0; n < 60; n++) {
    try { await fetch(`http://127.0.0.1:${port}/`); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert(ready, "Production server did not start");
  const cases = [
    {}, { ingredients: ["chickpeas", "potato", "carrot", "onion", "garlic"] },
    { ingredients: ["tofu", "spinach", "mushrooms"], pace: "About 45 min" },
    { ingredients: ["carrot", "broccoli", "lemon"], weight: "Light", pace: "About 30 min" },
    { ingredients: ["sweet potato", "aubergine", "chickpeas", "feta"] },
    { ingredients: ["pak choi", "tofu", "mushrooms"], customKinds: { "pak choi": "vegetable" } },
    { round: 1, flavour: "Citrus", texture: "Crisp", heat: "Medium" }
  ];
  for (const input of cases) {
    const { body, response, data } = await request(input);
    assert.equal(response.status, 200, data.error);
    assert.equal(data.recipes.length, 3);
    assert.equal(new Set(data.recipes.map(x => x.title)).size, 3);
    for (const recipe of data.recipes) {
      const ingredients = recipe.ingredients.join(" ").toLowerCase();
      const method = recipe.steps.slice(1).join(" ").toLowerCase();
      for (const chosen of body.ingredients) {
        assert(ingredients.includes(chosen), `${chosen} missing from ${recipe.title} ingredients`);
        assert(method.includes(chosen), `${chosen} missing from ${recipe.title} method`);
      }
      assert(!recipe.steps.some(x => /fold .* into the curry and warm through/i.test(x)), "Unexpected catch-all step");
      const limit = body.pace === "About 30 min" ? 30 : body.pace === "About 45 min" ? 45 : Infinity;
      assert(recipe.minutes <= limit, "Exceeded time preference");
    }
  }
  const incompatible = await request({ ingredients: ["parmesan", "potato"] });
  assert.equal(incompatible.response.status, 422);
  const tooSlow = await request({ pace: "About 30 min" });
  assert.equal(tooSlow.response.status, 422);
  const otherStyle = await request({ style: "Soup", ingredients: ["potato", "carrot", "onion"], pace: "Any time" });
  assert.equal(otherStyle.response.status, 200, otherStyle.data.error);
  console.log("Recipe route checks passed: 7 curry selections, two clear rejections, and soup regression.");
} finally {
  server.kill();
}
