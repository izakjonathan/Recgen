export type Style = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
export type Feel = "Light" | "Hearty";

type Flavour = {
  name: string;
  ingredients: string[];
  tags: string[];
  sauce: string;
  finish: string;
};

const flavours: Record<string, Flavour> = {
  lemon: { name: "lemon and parsley", ingredients: ["1 lemon", "2 tbsp chopped parsley", "1 tbsp olive oil"], tags: ["Lemon"], sauce: "Mix lemon juice, parsley and olive oil.", finish: "Spoon over the lemon and parsley dressing." },
  mustard: { name: "mustard vinaigrette", ingredients: ["1 tsp Dijon mustard", "1 tbsp cider vinegar", "1 tbsp olive oil"], tags: [], sauce: "Whisk mustard, vinegar and oil until combined.", finish: "Coat with the mustard dressing." },
  tahini: { name: "tahini lemon", ingredients: ["2 tbsp tahini", "½ lemon", "2 tbsp water"], tags: ["Lemon"], sauce: "Whisk tahini, lemon juice and water into a pourable sauce.", finish: "Drizzle with tahini sauce." },
  yogurt: { name: "garlic yogurt", ingredients: ["100 g plain yogurt", "1 small garlic clove", "½ lemon"], tags: ["Garlic", "Lemon"], sauce: "Mix yogurt with crushed garlic and lemon juice.", finish: "Serve with the garlic yogurt." },
  balsamic: { name: "balsamic and basil", ingredients: ["1 tbsp balsamic vinegar", "1 tbsp olive oil", "1 handful basil"], tags: [], sauce: "Mix balsamic vinegar, oil and torn basil.", finish: "Finish with the balsamic basil dressing." },
  dill: { name: "dill and lemon", ingredients: ["1 tbsp chopped dill", "½ lemon", "1 tbsp olive oil"], tags: ["Lemon"], sauce: "Mix dill, lemon juice and oil.", finish: "Finish with the dill dressing." },
  pesto: { name: "basil pesto", ingredients: ["2 tbsp basil pesto", "1 tbsp olive oil"], tags: [], sauce: "Loosen the pesto with a little olive oil or warm cooking water.", finish: "Stir through the basil pesto." },
  parmesan: { name: "parmesan and black pepper", ingredients: ["35 g grated Parmesan", "1 tsp cracked black pepper", "1 tbsp olive oil"], tags: ["Parmesan"], sauce: "Mix Parmesan and pepper with oil or a splash of warm cooking water.", finish: "Add the Parmesan mixture off the heat." },
  tomato: { name: "tomato and basil", ingredients: ["200 g chopped tomatoes", "1 tbsp olive oil", "1 handful basil"], tags: ["Tomato"], sauce: "Cook the chopped tomatoes with oil for 8 minutes until saucy, then add basil.", finish: "Fold through the tomato basil sauce." },
  chili: { name: "garlic and chilli", ingredients: ["2 garlic cloves", "½ tsp chilli flakes", "1 tbsp olive oil"], tags: ["Garlic"], sauce: "Warm the sliced garlic and chilli in oil over low heat for 2 minutes without burning it.", finish: "Toss with the fragrant garlic oil." },
  smoky: { name: "smoked paprika", ingredients: ["1 tsp smoked paprika", "1 tbsp olive oil", "½ lemon"], tags: ["Lemon"], sauce: "Stir smoked paprika into the oil and add a squeeze of lemon.", finish: "Finish with the paprika oil." },
  rosemary: { name: "rosemary and garlic", ingredients: ["1 tsp chopped rosemary", "2 garlic cloves", "1 tbsp olive oil"], tags: ["Garlic"], sauce: "Warm rosemary and crushed garlic in oil for 2 minutes.", finish: "Spoon over the rosemary oil." },
  cumin: { name: "cumin and citrus", ingredients: ["1 tsp ground cumin", "½ lemon", "1 tbsp olive oil"], tags: ["Lemon"], sauce: "Toast the cumin briefly and mix with lemon juice and oil.", finish: "Season with the cumin citrus dressing." },
  harissa: { name: "harissa", ingredients: ["1 tbsp harissa paste", "½ lemon", "1 tbsp olive oil"], tags: ["Lemon"], sauce: "Mix harissa with lemon juice and oil.", finish: "Swirl through the harissa sauce." },
  ginger: { name: "ginger and soy", ingredients: ["1 tbsp grated ginger", "1 tbsp soy sauce", "1 tsp sesame oil"], tags: ["Ginger"], sauce: "Mix ginger, soy sauce and sesame oil.", finish: "Add the ginger soy dressing." },
  peanut: { name: "peanut and lime", ingredients: ["2 tbsp peanut butter", "1 lime", "1 tbsp soy sauce", "2 tbsp water"], tags: [], sauce: "Whisk peanut butter, lime juice, soy and water until smooth.", finish: "Coat with the peanut lime sauce." },
  coconut: { name: "coconut and ginger", ingredients: ["200 ml coconut milk", "1 tbsp grated ginger", "1 tsp mild curry powder"], tags: ["Coconut milk", "Ginger"], sauce: "Mix coconut milk with ginger and curry powder.", finish: "Simmer in the coconut ginger sauce for 5 minutes." },
  masala: { name: "tomato masala", ingredients: ["200 g chopped tomatoes", "1 tbsp curry powder", "1 tsp ground cumin"], tags: ["Tomato"], sauce: "Simmer tomatoes with curry powder and cumin for 8 minutes.", finish: "Coat with the tomato masala sauce." },
  turmeric: { name: "turmeric and lemon", ingredients: ["1 tsp turmeric", "½ lemon", "1 tbsp olive oil"], tags: ["Lemon"], sauce: "Warm turmeric in oil for 1 minute, then add lemon juice.", finish: "Stir through the golden turmeric oil." },
  coriander: { name: "coriander and lime", ingredients: ["1 handful coriander", "1 lime", "1 tbsp olive oil"], tags: ["Coriander"], sauce: "Chop the coriander and mix with lime juice and oil.", finish: "Scatter over the coriander and lime dressing." },
  miso: { name: "miso and sesame", ingredients: ["1 tbsp white miso", "1 tsp sesame oil", "2 tbsp warm water"], tags: [], sauce: "Whisk miso, sesame oil and water into a smooth glaze.", finish: "Glaze with the miso sesame mixture." },
  paprika: { name: "paprika and tomato", ingredients: ["200 g chopped tomatoes", "1 tsp sweet paprika", "1 tbsp olive oil"], tags: ["Tomato"], sauce: "Simmer tomato and paprika in oil for 8 minutes.", finish: "Stir through the paprika tomato sauce." }
};

const quantity: Record<string, string> = {
  Potato: "400 g potatoes", Tomato: "2 tomatoes", Onion: "1 onion", Garlic: "2 garlic cloves",
  Courgette: "1 courgette", Carrot: "2 carrots", Spinach: "100 g spinach",
  "Butter beans": "1 tin butter beans, drained", Chickpeas: "1 tin chickpeas, drained",
  Lentils: "1 tin cooked lentils, drained", Tofu: "200 g firm tofu", Coriander: "1 handful coriander",
  Ginger: "1 tbsp grated ginger", "Coconut milk": "200 ml coconut milk", Parmesan: "35 g Parmesan", Lemon: "1 lemon",
  Cucumber: "½ cucumber", Feta: "80 g feta", Peas: "150 g frozen peas", Mushrooms: "200 g mushrooms",
  Aubergine: "1 aubergine", Broccoli: "½ head broccoli", "Sweet potato": "1 sweet potato",
  Kale: "100 g kale", "Red pepper": "1 red pepper", "Green beans": "150 g green beans",
  Pumpkin: "300 g pumpkin or squash", "White beans": "1 tin white beans, drained",
  Rocket: "50 g rocket", "Spring onion": "3 spring onions", Celery: "2 celery sticks"
};

type Base = { title: string; core: string[]; flavour: string; note: string };
const rows: Record<Style, string[]> = {
  Salad: [
    "Butter bean, tomato and coriander salad|Butter beans,Tomato,Coriander|lemon|A juicy bean salad with plenty of herbs",
    "Crisp potato and green bean salad|Potato,Green beans,Onion|mustard|A warm potato salad with crunchy beans",
    "Chickpea, cucumber and tomato salad|Chickpeas,Cucumber,Tomato|yogurt|A cool and creamy chopped salad",
    "Carrot, lentil and rocket salad|Carrot,Lentils,Rocket|cumin|Sweet carrots and peppery leaves",
    "Spinach, feta and cucumber salad|Spinach,Feta,Cucumber|balsamic|A tangy green salad",
    "Courgette, chickpea and parsley salad|Courgette,Chickpeas,Tomato|lemon|A lightly charred summer bowl",
    "Tofu, carrot and cucumber salad|Tofu,Carrot,Cucumber|ginger|Crunchy vegetables with golden tofu",
    "Butter bean, pepper and rocket salad|Butter beans,Red pepper,Rocket|smoky|A smoky, peppery bean salad",
    "Roasted aubergine and lentil salad|Aubergine,Lentils,Spinach|tahini|Silky aubergine over tender lentils",
    "Tomato, feta and basil salad|Tomato,Feta,Onion|balsamic|A bright tomato and cheese plate",
    "Broccoli, pea and lemon salad|Broccoli,Peas,Spinach|dill|A vibrant green bowl",
    "Roasted sweet potato and chickpea salad|Sweet potato,Chickpeas,Spinach|harissa|Warm and spicy with cool greens",
    "Mushroom, butter bean and kale salad|Mushrooms,Butter beans,Kale|rosemary|Earthy mushrooms with tender beans",
    "Lentil, beet-style carrot and feta salad|Lentils,Carrot,Feta|mustard|A hearty little lentil plate",
    "Crispy tofu and coriander salad|Tofu,Coriander,Red pepper|peanut|Crunchy tofu and sweet pepper",
    "Courgette ribbon and Parmesan salad|Courgette,Parmesan,Rocket|lemon|Delicate courgette ribbons",
    "Pumpkin, spinach and chickpea salad|Pumpkin,Spinach,Chickpeas|tahini|A warm autumn bowl",
    "White bean, tomato and spring onion salad|White beans,Tomato,Spring onion|dill|Fresh, quick and generously herbed",
    "Green bean and tomato potato salad|Green beans,Potato,Tomato|mustard|A classic-inspired vegetable salad",
    "Kale, carrot and peanut salad|Kale,Carrot,Cucumber|peanut|Shredded greens with a creamy dressing"
  ],
  Potato: [
    "Garlic and rosemary roasted potatoes|Potato,Garlic,Onion|rosemary|Crisp edges and soft centres",
    "Smashed potatoes with chickpeas|Potato,Chickpeas,Spinach|tahini|Crunchy potatoes with creamy chickpeas",
    "Potato and courgette hash|Potato,Courgette,Onion|smoky|A golden one-pan hash",
    "Golden potato and onion bake|Potato,Onion,Parmesan|parmesan|Thin layers baked until golden",
    "Potato, butter bean and tomato traybake|Potato,Butter beans,Tomato|balsamic|A hearty oven tray of vegetables",
    "Spiced potato and pea skillet|Potato,Peas,Onion|masala|A gently spiced pan of potatoes",
    "Lemon potato and green bean bowl|Potato,Green beans,Garlic|lemon|Bright potatoes with crisp beans",
    "Sweet potato and tofu sheet pan|Sweet potato,Tofu,Red pepper|miso|Golden tofu and sweet vegetables",
    "Potato, mushroom and spinach skillet|Potato,Mushrooms,Spinach|rosemary|Earthy mushrooms and golden potatoes",
    "Harissa potatoes with yogurt|Potato,Carrot,Onion|harissa|Roasted roots with a fiery finish",
    "Paprika potato and chickpea bake|Potato,Chickpeas,Tomato|paprika|A smoky tomato potato bake",
    "Roasted potato and broccoli with Parmesan|Potato,Broccoli,Parmesan|parmesan|A golden, cheesy vegetable dish",
    "Ginger sweet potato and lentil skillet|Sweet potato,Lentils,Spinach|ginger|Sweet roots with savoury lentils",
    "Roasted potato and aubergine pan|Potato,Aubergine,Onion|cumin|Soft aubergine and crisp potatoes",
    "Crispy potatoes with coriander chutney-style sauce|Potato,Coriander,Garlic|coriander|An herby, citrusy potato plate",
    "Potato and kale breakfast-style hash|Potato,Kale,Onion|mustard|Golden potatoes and wilted greens",
    "Smashed sweet potatoes with beans|Sweet potato,Butter beans,Rocket|tahini|A soft and crunchy bean plate",
    "Roasted potato and pepper tray|Potato,Red pepper,Garlic|smoky|Sweet pepper and crisp edges",
    "Potato, pea and dill salad plate|Potato,Peas,Spring onion|dill|A light spring potato supper",
    "Coconut potato and spinach skillet|Potato,Spinach,Coconut milk|coconut|A creamy, gently spiced pan"
  ],
  Soup: [
    "Carrot and ginger soup|Carrot,Ginger,Onion|ginger|Silky carrots with fresh ginger",
    "Tomato and butter bean soup|Tomato,Butter beans,Onion|tomato|A rustic tomato and bean bowl",
    "Potato and spinach soup|Potato,Spinach,Garlic|lemon|A simple green potato soup",
    "Courgette and pea soup|Courgette,Peas,Onion|dill|A fresh, summery green soup",
    "Lentil and tomato soup|Lentils,Tomato,Carrot|cumin|A gently spiced everyday soup",
    "Broccoli and Parmesan soup|Broccoli,Parmesan,Onion|parmesan|A savoury broccoli bowl",
    "Coconut pumpkin soup|Pumpkin,Coconut milk,Ginger|coconut|Sweet pumpkin with fragrant coconut",
    "Mushroom and white bean soup|Mushrooms,White beans,Onion|rosemary|An earthy and filling broth",
    "Sweet potato and red pepper soup|Sweet potato,Red pepper,Onion|smoky|Smooth and gently smoky",
    "Chickpea, spinach and lemon soup|Chickpeas,Spinach,Lemon|lemon|A bright chickpea broth",
    "Potato, kale and butter bean soup|Potato,Kale,Butter beans|rosemary|A cosy bowl of greens and beans",
    "Tomato, lentil and coriander soup|Tomato,Lentils,Coriander|coriander|Fresh herbs in a warming soup",
    "Courgette and garlic soup|Courgette,Garlic,Potato|yogurt|A delicate and creamy bowl",
    "Carrot, coconut and turmeric soup|Carrot,Coconut milk,Ginger|turmeric|A golden aromatic soup",
    "Aubergine and tomato soup|Aubergine,Tomato,Onion|paprika|Rich roasted vegetable flavour",
    "Pea, spinach and spring onion soup|Peas,Spinach,Spring onion|lemon|A lively green soup",
    "White bean and celery soup|White beans,Celery,Carrot|dill|A comforting vegetable broth",
    "Potato and mushroom soup|Potato,Mushrooms,Onion|rosemary|Creamy potatoes and mushrooms",
    "Broccoli, kale and chickpea soup|Broccoli,Kale,Chickpeas|miso|A savoury green bowl",
    "Roasted pepper and tomato soup|Red pepper,Tomato,Garlic|balsamic|Sweet peppers in a bright soup"
  ],
  Pasta: [
    "Tomato and basil chickpea pasta|Tomato,Chickpeas,Garlic|tomato|A quick tomato sauce with beans",
    "Courgette and lemon Parmesan pasta|Courgette,Lemon,Parmesan|parmesan|Fresh and savoury ribbons",
    "Creamy spinach and mushroom pasta|Spinach,Mushrooms,Onion|yogurt|A silky mushroom sauce",
    "Garlic butter bean pasta|Butter beans,Garlic,Tomato|chili|Creamy beans with a little heat",
    "Broccoli and chilli pasta|Broccoli,Garlic,Lemon|chili|Tender broccoli in spicy oil",
    "Roasted pepper and feta pasta|Red pepper,Feta,Tomato|balsamic|Sweet roasted pepper and salty cheese",
    "Pea, spinach and pesto pasta|Peas,Spinach,Parmesan|pesto|A spring-green pasta bowl",
    "Aubergine and tomato pasta|Aubergine,Tomato,Garlic|tomato|Soft aubergine in a rich sauce",
    "Lentil bolognese-style pasta|Lentils,Carrot,Onion|tomato|A vegetable-rich lentil sauce",
    "Tofu and sesame noodle-style pasta|Tofu,Carrot,Spring onion|ginger|A savoury sesame noodle bowl",
    "Potato and green bean pesto pasta|Potato,Green beans,Parmesan|pesto|A Ligurian-inspired supper",
    "Mushroom and rosemary pasta|Mushrooms,Garlic,Spinach|rosemary|Earthy mushrooms and herbs",
    "Coconut ginger vegetable noodles|Courgette,Carrot,Coconut milk|coconut|Fragrant vegetables with noodles",
    "Kale and white bean pasta|Kale,White beans,Garlic|lemon|Tender beans and greens",
    "Pumpkin and rosemary pasta|Pumpkin,Parmesan,Onion|rosemary|Sweet squash with savoury herbs",
    "Chickpea and harissa pasta|Chickpeas,Tomato,Spinach|harissa|A spicy pantry pasta",
    "Tomato, spinach and feta pasta|Tomato,Spinach,Feta|balsamic|A tangy, colourful pasta",
    "Broccoli and miso pasta|Broccoli,Tofu,Garlic|miso|A deeply savoury vegetable pasta",
    "Carrot and peanut noodle-style pasta|Carrot,Tofu,Coriander|peanut|Creamy peanut sauce and crunch",
    "Lemon pea and dill pasta|Peas,Lemon,Spring onion|dill|A light springtime pasta"
  ],
  Curry: [
    "Chickpea and spinach coconut curry|Chickpeas,Spinach,Coconut milk|coconut|A creamy green chickpea curry",
    "Potato, pea and tomato curry|Potato,Peas,Tomato|masala|A classic vegetable curry",
    "Tofu, courgette and ginger curry|Tofu,Courgette,Ginger|coconut|Soft vegetables and golden tofu",
    "Butter bean and tomato masala|Butter beans,Tomato,Onion|masala|Creamy beans in a spiced tomato sauce",
    "Sweet potato and lentil curry|Sweet potato,Lentils,Coconut milk|coconut|A gently sweet and filling curry",
    "Broccoli and chickpea curry|Broccoli,Chickpeas,Tomato|masala|Tender broccoli and spiced chickpeas",
    "Aubergine and coconut curry|Aubergine,Coconut milk,Garlic|coconut|Silky aubergine in coconut sauce",
    "Carrot, ginger and lentil curry|Carrot,Ginger,Lentils|turmeric|A bright golden lentil curry",
    "Mushroom and spinach masala|Mushrooms,Spinach,Tomato|masala|Earthy mushrooms with leafy greens",
    "Pumpkin and butter bean curry|Pumpkin,Butter beans,Coconut milk|coconut|A mellow autumn curry",
    "Green bean, potato and coriander curry|Green beans,Potato,Coriander|coriander|Fresh herbs lift a warming curry",
    "Tofu and peanut curry|Tofu,Red pepper,Carrot|peanut|A nutty, gently spicy sauce",
    "Courgette and chickpea tomato curry|Courgette,Chickpeas,Tomato|masala|A quick summer vegetable curry",
    "Broccoli and pea coconut curry|Broccoli,Peas,Coconut milk|coconut|A vivid green coconut curry",
    "Potato, spinach and lentil curry|Potato,Spinach,Lentils|masala|A substantial one-pot curry",
    "Aubergine, tomato and coriander curry|Aubergine,Tomato,Coriander|harissa|Soft aubergine with a bright finish",
    "White bean and kale curry|White beans,Kale,Ginger|turmeric|A green, gently spiced curry",
    "Sweet potato and tofu curry|Sweet potato,Tofu,Coconut milk|coconut|Creamy roots and tofu",
    "Red pepper and butter bean curry|Red pepper,Butter beans,Onion|paprika|Sweet pepper in a warming sauce",
    "Ginger chickpea and carrot curry|Ginger,Chickpeas,Carrot|coriander|Fresh ginger and tender chickpeas"
  ],
  Stew: [
    "Tomato and butter bean stew|Tomato,Butter beans,Onion|rosemary|Creamy beans in rich tomato",
    "Lentil, carrot and potato stew|Lentils,Carrot,Potato|smoky|A rustic, filling pot",
    "Chickpea and courgette stew|Chickpeas,Courgette,Tomato|paprika|A sunny vegetable stew",
    "Mushroom and white bean stew|Mushrooms,White beans,Onion|rosemary|Deeply savoury mushrooms and beans",
    "Sweet potato and chickpea stew|Sweet potato,Chickpeas,Red pepper|smoky|Sweet roots and smoky pulses",
    "Aubergine and tomato stew|Aubergine,Tomato,Garlic|balsamic|Soft aubergine in a tangy sauce",
    "Potato and kale vegetable stew|Potato,Kale,Carrot|mustard|A comforting bowl of vegetables",
    "Butter bean and spinach stew|Butter beans,Spinach,Garlic|lemon|A bright, silky bean pot",
    "Tofu and mushroom miso stew|Tofu,Mushrooms,Spring onion|miso|A savoury, brothy supper",
    "Pumpkin and lentil stew|Pumpkin,Lentils,Onion|cumin|Tender squash and warming spice",
    "Courgette and white bean stew|Courgette,White beans,Tomato|lemon|A light, brothy bean pot",
    "Red pepper and chickpea stew|Red pepper,Chickpeas,Tomato|harissa|Sweet pepper with gentle heat",
    "Broccoli and butter bean stew|Broccoli,Butter beans,Garlic|parmesan|Green vegetables with creamy beans",
    "Carrot, ginger and lentil stew|Carrot,Ginger,Lentils|turmeric|A golden vegetable pot",
    "Potato, green bean and tomato stew|Potato,Green beans,Tomato|paprika|A garden vegetable stew",
    "Spinach and chickpea stew|Spinach,Chickpeas,Onion|cumin|A simple warming pantry meal",
    "Aubergine and butter bean stew|Aubergine,Butter beans,Tomato|smoky|Smoky aubergine with creamy beans",
    "Sweet potato and kale stew|Sweet potato,Kale,White beans|rosemary|A cosy pot of roots and greens",
    "Mushroom, lentil and carrot stew|Mushrooms,Lentils,Carrot|mustard|An earthy, slow-simmered pot",
    "Coconut vegetable stew|Pumpkin,Courgette,Coconut milk|ginger|A fragrant, creamy vegetable pot"
  ]
};

export const catalogue: (Base & { id: string; style: Style; feel: Feel })[] = Object.entries(rows).flatMap(([style, entries]) =>
  entries.flatMap((row, index) => {
    const [title, core, flavour, note] = row.split("|");
    if (!title || !core || !flavours[flavour]) throw new Error(`Invalid catalogue entry: ${row}`);
    return (["Light", "Hearty"] as Feel[]).map(feel => ({ id: `${style.toLowerCase()}-${index + 1}-${feel.toLowerCase()}`, style: style as Style, feel, title, core: core.split(","), flavour, note }));
  })
);

export function recipeFromEntry(entry: (typeof catalogue)[number], selected: string[]) {
  const { style, feel, core } = entry;
  const profile = flavours[entry.flavour];
  const hearty = feel === "Hearty";
  const base: Record<Style, string> = {
    Salad: hearty ? "120 g cooked grains (such as couscous or rice)" : "50 g salad leaves",
    Potato: hearty ? "1 tin white beans, drained" : "50 g salad leaves",
    Soup: hearty ? "2 thick slices crusty bread" : "1 handful fresh herbs",
    Pasta: hearty ? "220 g dried pasta" : "160 g dried pasta",
    Curry: hearty ? "150 g dry rice" : "100 g dry rice",
    Stew: hearty ? "2 slices crusty bread" : "1 handful fresh herbs"
  };
  const extras = style === "Soup" || style === "Stew" ? ["600 ml vegetable stock"] : [];
  const main = core.map(key => quantity[key] ?? `150 g ${key.toLowerCase()}`);
  const sauceIngredients = core.some(key => profile.tags.includes(key))
    ? profile.ingredients.filter(line => !profile.tags.some(tag => core.includes(tag) && line.toLowerCase().includes(tag.toLowerCase())))
    : profile.ingredients;
  const oil = [...main, ...sauceIngredients].some(item => item.includes("olive oil")) ? [] : ["1 tbsp olive oil for cooking"];
  const ingredientList = [...new Set([...main, base[style], ...extras, ...sauceIngredients, ...oil, "Salt and black pepper, to taste"])];
  const prepMap: Record<string, string> = {
    Potato: "cut the potatoes into small pieces", "Sweet potato": "peel and cube the sweet potato",
    Tomato: "chop the tomatoes", Onion: "slice the onion", Garlic: "mince the garlic",
    Courgette: style === "Salad" ? "shave the courgette into ribbons" : "dice the courgette",
    Carrot: style === "Salad" ? "grate the carrots" : "slice the carrots",
    Spinach: "wash the spinach", "Butter beans": "drain and rinse the canned butter beans",
    Chickpeas: "drain and rinse the canned chickpeas", Lentils: "drain the cooked lentils",
    Tofu: "pat dry and cube the tofu", Coriander: "chop the coriander",
    Ginger: "grate the ginger", "Coconut milk": "shake the coconut milk",
    Parmesan: "grate the Parmesan", Lemon: "zest and juice the lemon",
    Cucumber: "dice the cucumber", Feta: "crumble the feta", Peas: "measure the frozen peas",
    Mushrooms: "slice the mushrooms", Aubergine: "cube the aubergine",
    Broccoli: "cut the broccoli into florets",
    Kale: "strip and chop the kale", "Red pepper": "slice the red pepper",
    "Green beans": "trim the green beans", Pumpkin: "peel and cube the squash",
    "White beans": "drain and rinse the canned white beans", Rocket: "wash the rocket",
    "Spring onion": "slice the spring onions", Celery: "slice the celery"
  };
  const prep = `Prepare the main ingredients: ${core.map(key => prepMap[key] ?? `prepare the ${key.toLowerCase()}`).join("; ")}.`;
  const longCook = core.filter(key => ["Potato", "Sweet potato", "Pumpkin", "Carrot", "Aubergine", "Broccoli", "Green beans", "Courgette", "Mushrooms", "Red pepper", "Onion", "Celery"].includes(key));
  const lateCook = core.filter(key => ["Spinach", "Kale", "Peas", "Tofu", "Chickpeas", "Butter beans", "Lentils", "White beans"].includes(key));
  const names = (list: string[]) => list.map(name => name.toLowerCase()).join(", ");
  const late = lateCook.length ? ` Add ${names(lateCook)} for the final 3–5 minutes.` : "";
  const saladCook = core.filter(key => ["Potato", "Sweet potato", "Pumpkin", "Aubergine", "Broccoli", "Green beans", "Courgette", "Mushrooms", "Tofu"].includes(key));
  const soften = longCook.length ? `Soften ${names(longCook)} in a little oil for 5 minutes.` : "Warm a little oil in the pan.";
  const cook: Record<Style, string> = {
    Salad: `Cook ${names(saladCook)} until tender and let cool slightly. Keep the other ingredients fresh.`,
    Potato: `Roast ${names(longCook)} with a little oil at 210°C for 25–35 minutes until golden.${late}`,
    Soup: `${soften} Add the vegetable stock and simmer 15–20 minutes until tender.${late}`,
    Pasta: `Boil the pasta in salted water until tender. ${longCook.length ? `Cook ${names(longCook)} in a little oil for 6–10 minutes.` : "Warm a little oil in a pan."}${late} Save a splash of pasta water.`,
    Curry: `Cook the rice according to the packet. ${soften} Add ${core.includes("Coconut milk") ? "the coconut milk" : "150 ml water"} and simmer 12–18 minutes until tender.${late}`,
    Stew: `${soften} Add the stock and simmer 20–25 minutes until tender.${late}`
  };
  const combine: Record<Style, string> = {
    Salad: `Combine the prepared ingredients with ${hearty ? "cooked grains" : "salad leaves"}. ${profile.sauce} ${profile.finish}`,
    Potato: `${profile.sauce} ${profile.finish} Serve with ${hearty ? "warmed white beans" : "salad leaves"}.`,
    Soup: `${profile.sauce} ${profile.finish} ${hearty ? "Serve with crusty bread." : "Scatter with fresh herbs."}`,
    Pasta: `${profile.sauce} Toss everything with the pasta and a splash of pasta water. ${profile.finish}`,
    Curry: `${profile.sauce} ${profile.finish} Spoon over the cooked rice.`,
    Stew: `${profile.sauce} ${profile.finish} ${hearty ? "Serve with crusty bread." : "Scatter with fresh herbs."}`
  };
  const normalized = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");
  const tags = new Set([...core, ...profile.tags, ...(style === "Potato" ? ["Potato"] : [])].map(normalized));
  const matches = selected.filter(name => tags.has(normalized(name)));
  const whyItFits = matches.length ? `Uses ${matches.length} of your ${selected.length} selected ingredient${selected.length === 1 ? "" : "s"}: ${matches.join(", ")}.` : "No selected ingredients match this recipe; see its ingredient list before cooking.";
  return {
    id: entry.id,
    title: `${entry.title}${hearty ? " · Hearty" : " · Light"}`,
    description: `${entry.note}. ${profile.name.charAt(0).toUpperCase()}${profile.name.slice(1)} finish.`,
    minutes: style === "Stew" ? 40 : style === "Potato" ? 40 : style === "Soup" || style === "Curry" ? 30 : 25,
    servings: 2,
    ingredients: ingredientList,
    steps: [prep, ...(style === "Salad" && !saladCook.length ? [] : [cook[style]]), combine[style], "Taste and season with salt and black pepper before serving."],
    whyItFits,
    matchedIngredients: matches
  };
}

export function pickRecipes(style: Style, feel: Feel, selected: string[], seen: string[] = []) {
  const candidates = catalogue.filter(item => item.style === style && item.feel === feel);
  const unseen = candidates.filter(item => !seen.includes(item.id));
  const pool = unseen.length >= 3 ? unseen : candidates;
  const ranked = pool.map(entry => {
    const recipe = recipeFromEntry(entry, selected);
    const score = recipe.matchedIngredients.length * 10 - (entry.core.length - recipe.matchedIngredients.length) + (Math.random() * 0.5);
    return { entry, recipe, score };
  }).sort((a, b) => b.score - a.score);
  const chosen: typeof ranked = [];
  for (const candidate of ranked) {
    if (chosen.some(item => item.entry.flavour === candidate.entry.flavour) && ranked.length - chosen.length > 3) continue;
    chosen.push(candidate);
    if (chosen.length === 3) break;
  }
  for (const candidate of ranked) {
    if (chosen.length === 3) break;
    if (!chosen.includes(candidate)) chosen.push(candidate);
  }
  return chosen.map(item => item.recipe);
}
