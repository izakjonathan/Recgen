"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

type Recipe = { title: string; description: string; minutes: number; servings: number; ingredients: string[]; steps: string[]; whyItFits: string };
type Style = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
type Weight = "Light" | "Hearty";
type Theme = { canvas: string; ink: string; accent: string; positive: string };
const defaultTheme: Theme = { canvas: "#fff4c4", ink: "#000000", accent: "#bb533f", positive: "#78a353" };
const styles: Style[] = ["Salad", "Potato", "Soup", "Pasta", "Curry", "Stew"];
const starterIngredients = ["Potato", "Tomato", "Onion", "Garlic", "Courgette", "Carrot", "Spinach", "Butter beans", "Chickpeas", "Lentils", "Tofu", "Coriander", "Ginger", "Coconut milk", "Parmesan", "Lemon"];
const ingredientKey = "supper-club-ingredients-v1";
const themeKey = "recgen-ui-theme-v1";
const hexPattern = /^#[0-9a-f]{6}$/i;

function contrastRatio(first: string, second: string) {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + .05) / (dark + .05);
}

export default function RecipeBuilder() {
  const [ingredients, setIngredients] = useState<string[]>(starterIngredients);
  const [selected, setSelected] = useState<string[]>([]);
  const [style, setStyle] = useState<Style | null>(null);
  const [weight, setWeight] = useState<Weight | null>(null);
  const [panel, setPanel] = useState<"ingredients" | "studio" | null>(null);
  const [newIngredient, setNewIngredient] = useState("");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [savedTheme, setSavedTheme] = useState<Theme>(defaultTheme);
  const [draftTheme, setDraftTheme] = useState<Theme>(defaultTheme);
  const [studioMessage, setStudioMessage] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedIngredients = JSON.parse(localStorage.getItem(ingredientKey) || "null");
      if (Array.isArray(storedIngredients) && storedIngredients.length <= 100 && storedIngredients.every(item => typeof item === "string")) setIngredients(storedIngredients);
      const storedTheme = JSON.parse(localStorage.getItem(themeKey) || "null") as Theme | null;
      if (storedTheme && [storedTheme.canvas, storedTheme.ink, storedTheme.accent, storedTheme.positive].every(value => typeof value === "string" && hexPattern.test(value)) && contrastRatio(storedTheme.canvas, storedTheme.ink) >= 4.5) {
        setTheme(storedTheme); setSavedTheme(storedTheme); setDraftTheme(storedTheme);
      }
    } catch { /* Default settings remain available. */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { try { localStorage.setItem(ingredientKey, JSON.stringify(ingredients)); } catch {} } }, [ingredients, hydrated]);
  useEffect(() => {
    document.documentElement.style.backgroundColor = theme.canvas;
    document.body.style.backgroundColor = theme.canvas;
  }, [theme.canvas]);
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closePanel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, savedTheme]);

  function openStudio() { setDraftTheme(savedTheme); setStudioMessage(""); setPanel("studio"); }
  function closePanel() { if (panel === "studio") setTheme(savedTheme); setPanel(null); }
  function updateTheme(key: keyof Theme, value: string) {
    const next = { ...draftTheme, [key]: value };
    setDraftTheme(next); setStudioMessage("");
    if (Object.values(next).every(color => hexPattern.test(color))) setTheme(next);
  }
  function saveTheme() {
    if (!Object.values(draftTheme).every(color => hexPattern.test(color))) { setStudioMessage("Use a six-digit hex color, such as #fff4c4."); return; }
    if (contrastRatio(draftTheme.canvas, draftTheme.ink) < 4.5) { setStudioMessage("Canvas and ink need at least 4.5:1 contrast for readable text."); return; }
    setTheme(draftTheme); setSavedTheme(draftTheme);
    try { localStorage.setItem(themeKey, JSON.stringify(draftTheme)); setStudioMessage("Colors saved in this browser."); }
    catch { setStudioMessage("Could not save colors in this browser."); }
  }
  function resetTheme() { setDraftTheme(defaultTheme); setTheme(defaultTheme); setStudioMessage("Default colors previewed. Save to keep them."); }
  function addIngredient(event: FormEvent) {
    event.preventDefault();
    const name = newIngredient.trim().replace(/\s+/g, " ");
    if (!name || name.length > 60 || ingredients.length >= 100 || ingredients.some(item => item.toLocaleLowerCase() === name.toLocaleLowerCase())) return;
    setIngredients(current => [...current, name]); setNewIngredient("");
  }
  function removeIngredient(name: string) {
    setIngredients(current => current.filter(item => item !== name));
    setSelected(current => current.filter(item => item !== name));
    setRecipes([]);
  }
  function toggleIngredient(name: string) {
    setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
    setRecipes([]); setError("");
  }
  async function generate() {
    if (!style || !weight || !selected.length || loading) return;
    setLoading(true); setError(""); setRecipes([]);
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ style, weight, ingredients: selected }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate recipes.");
      setRecipes(data.recipes); setExpanded(0);
      requestAnimationFrame(() => document.getElementById("ideas")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not generate recipes."); }
    finally { setLoading(false); }
  }

  const themeStyle = { "--canvas": theme.canvas, "--ink": theme.ink, "--accent": theme.accent, "--positive": theme.positive } as CSSProperties;
  return <div className="recipe-app" style={themeStyle}>
    <header className="app-header">
      <button className="round-control" type="button" onClick={openStudio} aria-label="Open UI Studio"><SettingsIcon /></button>
      <div className="wordmark">RECIPE GENERATOR</div>
      <button className="round-control" type="button" onClick={() => setPanel("ingredients")} aria-label="Edit ingredient list"><PlusIcon /></button>
    </header>

    <main className="app-main">
      <section className="opening"><p className="eyebrow">YOUR KITCHEN · YOUR WAY</p><h1>What shall we<br />make today?</h1><p>Pick a dish, choose what goes in, and get three ideas worth cooking.</p></section>

      <section className="flow-section" id="dish" aria-labelledby="dish-heading">
        <div className="section-title"><span className="step-number">01</span><div><span className="eyebrow">THE STARTING POINT</span><h2 id="dish-heading">Choose a dish</h2></div></div>
        <div className="style-grid">{styles.map(item => <button className="choice-card" data-selected={style === item} type="button" key={item} aria-pressed={style === item} onClick={() => { setStyle(item); setRecipes([]); setError(""); }}><strong>{item}</strong><span aria-hidden="true">{style === item ? "●" : "○"}</span></button>)}</div>
      </section>

      <section className="flow-section" id="ingredients" aria-labelledby="ingredients-heading">
        <div className="section-title"><span className="step-number">02</span><div><span className="eyebrow">FROM YOUR PANTRY</span><h2 id="ingredients-heading">Pick ingredients</h2></div></div>
        <div className="section-tools"><p>{selected.length} selected</p><button type="button" onClick={() => setPanel("ingredients")}>Edit list <span aria-hidden="true">↗</span></button></div>
        <div className="ingredient-list">{ingredients.map(name => <button className="ingredient-pill" data-selected={selected.includes(name)} type="button" key={name} aria-pressed={selected.includes(name)} onClick={() => toggleIngredient(name)}><span aria-hidden="true">{selected.includes(name) ? "✓" : "+"}</span>{name}</button>)}{!ingredients.length && <p className="muted">Your list is empty. Add ingredients in settings.</p>}</div>
      </section>

      <section className="flow-section" id="feel" aria-labelledby="feel-heading">
        <div className="section-title"><span className="step-number">03</span><div><span className="eyebrow">THE FINISHING TOUCH</span><h2 id="feel-heading">Keep it light or hearty?</h2></div></div>
        <div className="weight-grid"><button className="weight-card" data-selected={weight === "Light"} type="button" aria-pressed={weight === "Light"} onClick={() => { setWeight("Light"); setRecipes([]); }}><span><strong>Light</strong><small>Fresh, bright and easy</small></span><span className="selection-circle" /></button><button className="weight-card" data-selected={weight === "Hearty"} type="button" aria-pressed={weight === "Hearty"} onClick={() => { setWeight("Hearty"); setRecipes([]); }}><span><strong>Hearty</strong><small>Rich, filling and cosy</small></span><span className="selection-circle" /></button></div>
      </section>

      <section className="action-section"><button className="generate-button" type="button" disabled={!style || !weight || !selected.length || loading} onClick={generate}>{loading ? "Making your menu…" : recipes.length ? "Generate three more" : "Generate three ideas"}<span aria-hidden="true">↗</span></button><p>{selected.length ? `${selected.length} ingredient${selected.length === 1 ? "" : "s"} selected` : "Select at least one ingredient to continue"}</p>{error && <p className="error" role="alert">{error}</p>}</section>

      {(recipes.length > 0 || loading) && <section className="results" id="ideas" aria-live="polite"><div className="results-heading"><p className="eyebrow">YOUR MENU</p><h2>Three ways to make it</h2><p>{style} · {weight}</p></div>{loading ? <div className="loading-card" role="status">Finding three ideas for you…</div> : <div className="recipe-list">{recipes.map((recipe, index) => <article className="recipe-card" key={`${recipe.title}-${index}`}><div className="recipe-meta"><span>IDEA {String(index + 1).padStart(2, "0")}</span><span>{recipe.minutes} MIN · {recipe.servings} SERVINGS</span></div><h3>{recipe.title}</h3><p className="description">{recipe.description}</p><p className="fit">{recipe.whyItFits}</p><button className="recipe-toggle" type="button" aria-expanded={expanded === index} onClick={() => setExpanded(expanded === index ? null : index)}>{expanded === index ? "Hide recipe" : "View recipe"}<span aria-hidden="true">{expanded === index ? "−" : "+"}</span></button>{expanded === index && <div className="recipe-detail"><h4>Ingredients</h4><ul>{recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}</ul><h4>Method</h4><ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol></div>}</article>)}</div>}</section>}
    </main>

    <nav className="bottom-dock" aria-label="Recipe steps"><a href="#dish">Dish</a><a href="#ingredients">Ingredients</a><a href="#feel">Feel</a><a href="#ideas" aria-disabled={!recipes.length}>{recipes.length ? "Ideas" : "Ideas"}</a></nav>

    {panel && <div className="panel-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closePanel(); }}><section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title"><div className="panel-heading"><div><p className="eyebrow">{panel === "studio" ? "APPEARANCE" : "YOUR PANTRY"}</p><h2 id="panel-title">{panel === "studio" ? "UI Studio" : "Ingredient list"}</h2></div><button className="round-control" type="button" onClick={closePanel} aria-label="Close settings">×</button></div>
      {panel === "studio" ? <><p className="panel-intro">Change the colors of the recipe generator. Preview them live, then save them for this browser.</p><div className="studio-fields">{([ ["canvas", "Canvas / background"], ["ink", "Ink / text and borders"], ["accent", "Accent / attention"], ["positive", "Positive / calm"] ] as [keyof Theme, string][]).map(([key, label]) => <label className="color-field" key={key}><span>{label}</span><span><input type="color" value={hexPattern.test(draftTheme[key]) ? draftTheme[key] : "#000000"} onChange={event => updateTheme(key, event.target.value)} aria-label={`${label} color picker`} /><input value={draftTheme[key]} onChange={event => updateTheme(key, event.target.value)} maxLength={7} aria-label={`${label} hex value`} /></span></label>)}</div><div className="theme-preview" style={{ background: draftTheme.canvas, color: draftTheme.ink }}><strong>Recipe preview</strong><span>Cards and type inherit these colors.</span><span style={{ color: draftTheme.accent }}>Accent for attention</span><span style={{ color: draftTheme.positive }}>Positive for calm</span></div>{studioMessage && <p className="status-message" role="status">{studioMessage}</p>}<div className="panel-actions"><button type="button" className="secondary-button" onClick={resetTheme}>Reset defaults</button><button type="button" className="primary-button" onClick={saveTheme}>Save colors</button></div></> : <><p className="panel-intro">Add or remove ingredients whenever you like. Changes are saved in this browser.</p><form className="add-form" onSubmit={addIngredient}><label htmlFor="new-ingredient">Add an ingredient</label><div><input id="new-ingredient" value={newIngredient} onChange={event => setNewIngredient(event.target.value)} maxLength={60} placeholder="e.g. Aubergine" /><button type="submit" disabled={!newIngredient.trim() || ingredients.length >= 100}>Add</button></div></form><div className="pantry-list"><h3>Your ingredients <span>{ingredients.length}</span></h3>{ingredients.map(name => <div className="pantry-row" key={name}><span>{name}</span><button type="button" onClick={() => removeIngredient(name)} aria-label={`Remove ${name}`}>Remove</button></div>)}{!ingredients.length && <p className="muted">No ingredients yet.</p>}</div><button className="primary-button full-width" type="button" onClick={closePanel}>Done</button></>}
    </section></div>}
  </div>;
}

function SettingsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.99l.06.06-1.77 1.77-.06-.06A1.8 1.8 0 0 0 16 18.4a1.8 1.8 0 0 0-1.1 1.64V21h-2.5v-.96a1.8 1.8 0 0 0-1.1-1.64 1.8 1.8 0 0 0-1.99.36l-.06.06-1.77-1.77.06-.06A1.8 1.8 0 0 0 7.9 15a1.8 1.8 0 0 0-1.64-1.1H5.3v-2.5h.96A1.8 1.8 0 0 0 7.9 10.3a1.8 1.8 0 0 0-.36-1.99l-.06-.06 1.77-1.77.06.06A1.8 1.8 0 0 0 11.3 6.9a1.8 1.8 0 0 0 1.1-1.64V4.3h2.5v.96A1.8 1.8 0 0 0 16 6.9a1.8 1.8 0 0 0 1.99-.36l.06-.06 1.77 1.77-.06.06A1.8 1.8 0 0 0 19.4 10.3a1.8 1.8 0 0 0 1.64 1.1H22v2.5h-.96A1.8 1.8 0 0 0 19.4 15Z" transform="translate(-1.65 -1.65)"/></svg>; }
function PlusIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>; }
