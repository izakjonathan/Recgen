"use client";

import { useEffect, useState } from "react";

type Recipe = { title: string; description: string; minutes: number; servings: number; ingredients: string[]; steps: string[]; whyItFits: string };
type Style = "Salad" | "Potato" | "Soup" | "Pasta" | "Curry" | "Stew";
type Weight = "Light" | "Hearty";

const styles: { name: Style; icon: string; detail: string }[] = [
  { name: "Salad", icon: "✳", detail: "Fresh & generous" },
  { name: "Potato", icon: "◒", detail: "Roasted, mashed & more" },
  { name: "Soup", icon: "◡", detail: "Something comforting" },
  { name: "Pasta", icon: "〰", detail: "A bowl of good things" },
  { name: "Curry", icon: "✺", detail: "Warm & fragrant" },
  { name: "Stew", icon: "◉", detail: "Slow & satisfying" }
];
const starterIngredients = ["Potato", "Tomato", "Onion", "Garlic", "Courgette", "Carrot", "Spinach", "Butter beans", "Chickpeas", "Lentils", "Tofu", "Coriander", "Ginger", "Coconut milk", "Parmesan", "Lemon"];
const storageKey = "supper-club-ingredients-v1";

export default function RecipeBuilder() {
  const [ingredients, setIngredients] = useState<string[]>(starterIngredients);
  const [selected, setSelected] = useState<string[]>([]);
  const [style, setStyle] = useState<Style | null>(null);
  const [weight, setWeight] = useState<Weight | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved) && saved.every(x => typeof x === "string") && saved.length <= 100) setIngredients(saved);
    } catch { /* Keep starter list if browser storage is unavailable. */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(ingredients)); } catch {} }, [ingredients]);
  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSettingsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen]);

  function addIngredient(event: React.FormEvent) {
    event.preventDefault();
    const name = newIngredient.trim().replace(/\s+/g, " ");
    if (!name || name.length > 60 || ingredients.some(x => x.toLocaleLowerCase() === name.toLocaleLowerCase()) || ingredients.length >= 100) return;
    setIngredients(current => [...current, name]); setNewIngredient("");
  }
  function removeIngredient(name: string) {
    setIngredients(current => current.filter(x => x !== name));
    setSelected(current => current.filter(x => x !== name));
  }
  function toggleIngredient(name: string) {
    setSelected(current => current.includes(name) ? current.filter(x => x !== name) : [...current, name]);
    setRecipes([]); setError("");
  }
  async function generate() {
    if (!style || !weight || selected.length === 0 || loading) return;
    setLoading(true); setError(""); setRecipes([]);
    try {
      const response = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, weight, ingredients: selected })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate recipes.");
      setRecipes(data.recipes); setExpanded(0);
      requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not generate recipes."); }
    finally { setLoading(false); }
  }

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark" aria-hidden="true">✳</span><span>THE RECIPE TABLE</span></div>
      <button className="settings-trigger" onClick={() => setSettingsOpen(true)} aria-label="Manage ingredients"><span aria-hidden="true">⚙</span> Ingredients</button>
    </header>

    <div className="layout">
      <div className="intro"><p className="eyebrow">A LITTLE DINNER INSPIRATION</p><h1>What shall we<br /><em>make today?</em></h1><p>Choose a kind of dish, pick what you have, and find something good to cook.</p></div>
      <section className="builder" aria-label="Build your recipe">
        <div className="section-heading"><span className="number">01</span><div><h2>Start with a dish</h2><p>What are you in the mood for?</p></div></div>
        <div className="style-grid">{styles.map(item => <button key={item.name} type="button" className={`style-card ${style === item.name ? "active" : ""}`} aria-pressed={style === item.name} onClick={() => { setStyle(item.name); setRecipes([]); setError(""); }}><span className="style-icon" aria-hidden="true">{item.icon}</span><strong>{item.name}</strong><small>{item.detail}</small></button>)}</div>

        <div className="rule" />
        <div className="section-heading"><span className="number">02</span><div><h2>Make it yours</h2><p>Choose the ingredients you would like to include.</p></div></div>
        <div className="ingredient-heading"><span>{selected.length} selected</span><button onClick={() => setSettingsOpen(true)}>Edit ingredient list <span aria-hidden="true">↗</span></button></div>
        <div className="chip-list">{ingredients.length ? ingredients.map(name => <button type="button" key={name} className={`chip ${selected.includes(name) ? "selected" : ""}`} aria-pressed={selected.includes(name)} onClick={() => toggleIngredient(name)}><span aria-hidden="true">{selected.includes(name) ? "✓" : "+"}</span>{name}</button>) : <p className="empty">Your list is empty. Add ingredients in settings.</p>}</div>

        <div className="rule" />
        <div className="section-heading"><span className="number">03</span><div><h2>How should it feel?</h2><p>Pick the kind of meal you want tonight.</p></div></div>
        <div className="weight-grid"><button type="button" className={`weight-card ${weight === "Light" ? "active" : ""}`} aria-pressed={weight === "Light"} onClick={() => { setWeight("Light"); setRecipes([]); }}><span className="weight-symbol" aria-hidden="true">☼</span><span><strong>Light</strong><small>Fresh, bright and easy</small></span><span className="radio" /></button><button type="button" className={`weight-card ${weight === "Hearty" ? "active" : ""}`} aria-pressed={weight === "Hearty"} onClick={() => { setWeight("Hearty"); setRecipes([]); }}><span className="weight-symbol" aria-hidden="true">◕</span><span><strong>Hearty</strong><small>Rich, filling and cosy</small></span><span className="radio" /></button></div>
        <div className="generate-row"><button className="generate" disabled={!style || !weight || !selected.length || loading} onClick={generate}>{loading ? "Cooking up ideas…" : recipes.length ? "Generate three more ideas" : "Give me three ideas"}<span aria-hidden="true">↗</span></button><p>{selected.length ? `${selected.length} ingredient${selected.length === 1 ? "" : "s"} selected` : "Select at least one ingredient to continue"}</p></div>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </div>

    {(recipes.length > 0 || loading) && <section className="results" id="results" aria-live="polite"><div className="results-head"><div><p className="eyebrow">YOUR MENU</p><h2>Three ways to make it</h2></div><span>{style} · {weight}</span></div>{loading ? <div className="loading-card">Finding three ideas for you<span className="loading-dots">…</span></div> : <div className="recipe-grid">{recipes.map((recipe, index) => <article className="recipe-card" key={`${recipe.title}-${index}`}><div className="recipe-top"><span>IDEA {String(index + 1).padStart(2, "0")}</span><span>{recipe.minutes} MIN · {recipe.servings} SERVINGS</span></div><h3>{recipe.title}</h3><p className="recipe-description">{recipe.description}</p><p className="fit">{recipe.whyItFits}</p><button className="recipe-toggle" onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index}> {expanded === index ? "Hide recipe" : "View recipe"}<span aria-hidden="true">{expanded === index ? "−" : "+"}</span></button>{expanded === index && <div className="recipe-detail"><h4>Ingredients</h4><ul>{recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}</ul><h4>Method</h4><ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol></div>}</article>)}</div>}</section>}

    <footer>Made for better everyday cooking <span aria-hidden="true">✳</span></footer>

    {settingsOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSettingsOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="modal-head"><div><p className="eyebrow">YOUR PANTRY</p><h2 id="settings-title">Ingredient list</h2></div><button className="close" aria-label="Close settings" onClick={() => setSettingsOpen(false)}>×</button></div><p className="modal-description">Add the ingredients you use. Your list stays saved in this browser.</p><form className="add-form" onSubmit={addIngredient}><label htmlFor="new-ingredient">Add an ingredient</label><div><input id="new-ingredient" value={newIngredient} onChange={event => setNewIngredient(event.target.value)} placeholder="e.g. Aubergine" maxLength={60} /><button type="submit" disabled={!newIngredient.trim() || ingredients.length >= 100}>Add</button></div></form><div className="settings-list"><h3>Your ingredients <span>{ingredients.length}</span></h3>{ingredients.map(name => <div className="settings-item" key={name}><span>{name}</span><button onClick={() => removeIngredient(name)} aria-label={`Remove ${name}`}>Remove</button></div>)}{ingredients.length === 0 && <p>No ingredients yet.</p>}</div><button className="done" onClick={() => setSettingsOpen(false)}>Done</button></section></div>}
  </main>;
}
