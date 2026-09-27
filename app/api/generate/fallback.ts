type Dish = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
type Feel = "Light" | "Hearty";

type Idea = {
  name: string;
  note: string;
  extra: string[];
  finish: string;
};

const ideas: Record<Dish, Idea[]> = {
  Salad: [
    { name: "Lemony crunch salad", note: "A bright bowl with a lively citrus dressing.", extra: ["1 lemon", "2 tbsp olive oil", "1 tsp mustard"], finish: "Whisk lemon juice, oil and mustard; toss through the bowl just before serving." },
    { name: "Herby warm salad", note: "Warm ingredients over a bed of fresh greens.", extra: ["1 handful salad leaves", "2 tbsp olive oil", "1 tbsp chopped herbs"], finish: "Toss the warm ingredients with leaves, oil and herbs; season and serve." },
    { name: "Spiced pantry salad", note: "A smoky, lightly spiced take on the ingredients you chose.", extra: ["1 tsp smoked paprika", "2 tbsp olive oil", "1 tbsp vinegar"], finish: "Dress with oil and vinegar, dust with paprika and toss well." }
  ],
  Potato: [
    { name: "Crispy skillet potatoes", note: "Golden edges and a simple savoury finish.", extra: ["500 g potatoes", "2 tbsp olive oil", "1 tsp dried herbs"], finish: "Add the cooked ingredients to the crisp potatoes, season with herbs and serve." },
    { name: "Smashed potato plate", note: "Tender centres and crunchy roasted tops.", extra: ["500 g baby potatoes", "2 tbsp olive oil", "1 lemon"], finish: "Crush the potatoes gently, roast until crisp and top with the prepared ingredients and lemon." },
    { name: "Rustic potato hash", note: "A cosy one-pan meal with plenty of texture.", extra: ["500 g potatoes", "1 onion", "2 tbsp olive oil"], finish: "Fold everything together in the pan and cook until the potatoes are golden." }
  ],
  Soup: [
    { name: "Bright vegetable soup", note: "A clear, fragrant bowl that lets the ingredients shine.", extra: ["750 ml vegetable stock", "1 tbsp olive oil", "1 lemon"], finish: "Simmer everything in stock until tender; finish with lemon and seasoning." },
    { name: "Silky blended soup", note: "Smooth and comforting with a fresh finish.", extra: ["750 ml vegetable stock", "1 tbsp olive oil", "2 tbsp yoghurt or cream"], finish: "Blend the cooked soup until smooth and swirl in yoghurt or cream." },
    { name: "Herby chunky soup", note: "A spoonable, substantial soup with distinct pieces.", extra: ["750 ml vegetable stock", "1 tsp dried herbs", "1 tbsp olive oil"], finish: "Keep the soup chunky; stir in herbs and a drizzle of oil before serving." }
  ],
  Pasta: [
    { name: "Lemon and herb pasta", note: "Glossy pasta with a fresh, zesty sauce.", extra: ["180 g dried pasta", "1 lemon", "2 tbsp olive oil"], finish: "Toss the pasta and prepared ingredients with oil, lemon and a splash of pasta water." },
    { name: "Slow-cooked pantry pasta", note: "A deeper, savoury sauce built in one pan.", extra: ["180 g dried pasta", "1 tin chopped tomatoes", "1 tbsp olive oil"], finish: "Simmer the prepared ingredients with tomatoes, then toss through the pasta." },
    { name: "Golden skillet pasta", note: "A quick, gently toasted pasta supper.", extra: ["180 g dried pasta", "1 tbsp olive oil", "2 tbsp grated cheese or nutritional yeast"], finish: "Toss everything together over heat and finish with cheese or nutritional yeast." }
  ],
  Curry: [
    { name: "Ginger coconut curry", note: "Fragrant, creamy and easy to adjust to your pantry.", extra: ["200 ml coconut milk", "1 tbsp curry powder", "1 tsp grated ginger"], finish: "Simmer with coconut milk and spices until cooked through; season and serve." },
    { name: "Tomato masala curry", note: "A warming, gently spiced tomato sauce.", extra: ["1 tin chopped tomatoes", "1 tbsp curry powder", "1 tbsp olive oil"], finish: "Simmer the prepared ingredients in spiced tomatoes until the sauce thickens." },
    { name: "Golden turmeric curry", note: "A fragrant golden bowl with a bright finish.", extra: ["200 ml coconut milk", "1 tsp turmeric", "1 lime or lemon"], finish: "Simmer in coconut milk and turmeric; finish with citrus juice." }
  ],
  Stew: [
    { name: "Rustic tomato stew", note: "A slow-simmered pot with a rich tomato base.", extra: ["1 tin chopped tomatoes", "250 ml vegetable stock", "1 tsp dried herbs"], finish: "Simmer gently until the sauce thickens and the ingredients are tender." },
    { name: "Herby garden stew", note: "Soft vegetables in a fragrant, savoury broth.", extra: ["400 ml vegetable stock", "1 tbsp olive oil", "1 tsp dried herbs"], finish: "Simmer in stock, stir in herbs and season generously." },
    { name: "Smoky one-pot stew", note: "A warming pot with gentle paprika warmth.", extra: ["1 tin chopped tomatoes", "1 tsp smoked paprika", "250 ml vegetable stock"], finish: "Simmer with tomatoes, paprika and stock until thick and comforting." }
  ]
};

function selectedQuantity(name: string): string {
  const lower = name.toLowerCase();
  if (/milk|stock|cream/.test(lower)) return `150 ml ${name}`;
  if (/herb|spice|ginger|garlic|coriander|lemon|lime/.test(lower)) return `1 tbsp ${name}, or to taste`;
  if (/cheese|parmesan/.test(lower)) return `40 g ${name}`;
  return `150 g ${name}`;
}

export function fallbackRecipes(style: Dish, weight: Feel, ingredients: string[], offset = 0) {
  return Array.from({ length: 3 }, (_, index) => {
    const idea = ideas[style][(index + offset) % 3];
    const featured = [ingredients[(index + offset) % ingredients.length], ...ingredients.filter((_, i) => i !== (index + offset) % ingredients.length).slice(0, 2)];
    const picked = [...new Set(featured)];
    const hearty = weight === "Hearty";
    const boost = hearty ? (style === "Pasta" || style === "Potato" ? "1 tin beans or chickpeas, drained" : "100 g cooked rice or 1 slice crusty bread per person") : "1 handful fresh greens or herbs";
    const base = style === "Salad" ? "Rinse and prepare the selected ingredients; cook any that need cooking, such as beans, potatoes or tofu." :
      style === "Potato" ? "Boil the potatoes for 12–15 minutes until nearly tender; drain well." :
      style === "Pasta" ? "Cook the pasta in salted water until tender; save a mug of pasta water." :
      "Wash and chop the selected ingredients into bite-size pieces.";
    const middle = style === "Salad" ? "Combine the selected ingredients in a serving bowl." :
      style === "Potato" ? "Heat oil in a pan or oven tray and cook the potatoes until golden; cook the other selected ingredients separately until tender." :
      style === "Pasta" ? "Cook the selected ingredients in a pan with a little oil until tender." :
      "Heat a little oil in a saucepan; cook the selected ingredients until softened. Add a splash of water if needed.";
    return {
      title: `${idea.name} with ${picked[0].toLowerCase()}`,
      description: `${idea.note} ${hearty ? "Made more filling for a hearty meal." : "Kept fresh and easy for a lighter meal."}`,
      minutes: style === "Stew" ? 40 : style === "Potato" ? 35 : style === "Soup" || style === "Curry" ? 30 : 25,
      servings: 2,
      ingredients: [...picked.map(selectedQuantity), ...idea.extra, boost, "Salt and black pepper, to taste"],
      steps: [base, middle, idea.finish, hearty ? "Add the beans, rice or bread to make it a filling meal; taste and adjust the seasoning." : "Add the greens or herbs just before serving; taste and adjust the seasoning."],
      whyItFits: `${style} · ${weight} · features ${picked.join(", ")}.`
    };
  });
}
