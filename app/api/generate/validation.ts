import type { Ingredient } from "../../ingredient-catalogue";
import type { Plan, Style, Pace } from "./blueprints";
import { paceLimit } from "./blueprints";

export function validateSelection(style: Style, items: Ingredient[]) {
  if (items.length > 8) return "Choose up to eight ingredients for a coherent dish. All chosen ingredients will still be used.";
  if (style === "Salad" && items.some(item => item.id === "coconut milk") && !items.some(item => ["lemon", "coriander", "ginger"].includes(item.id)))
    return "A coconut milk salad needs lemon, coriander or ginger to make a balanced dressing. Add one or choose another dish.";
  if (items.some(item => item.id === "parmesan") && items.some(item => item.id === "coconut milk") && ["Salad", "Curry"].includes(style))
    return "Parmesan and coconut milk do not make a reliable combination for this dish. Change the dish or one ingredient.";
  return null;
}
export function validatePlan(plan: Plan, selected: Ingredient[], pace: Pace) {
  const lines = new Set(plan.lines.map(item => item.id));
  if (lines.size !== plan.lines.length) return "Duplicate ingredient in recipe.";
  const used = new Set(plan.actions.filter(action => action.kind !== "prep").flatMap(action => action.ingredientIds));
  const missing = selected.filter(item => !lines.has(item.id) || !used.has(item.id));
  if (missing.length) return `The method does not use ${missing.map(item => item.label).join(", ")}.`;
  if (plan.lines.some(line => !used.has(line.id))) return "An ingredient is listed but never used in the method.";
  if (plan.minutes > paceLimit(pace)) return "The method exceeds the chosen time.";
  if (plan.actions.some(action => !action.text.trim())) return "A cooking step is incomplete.";
  return null;
}
export function validateSet(plans: Plan[]) {
  if (plans.length !== 3) return "These choices cannot produce three different recipes within the time limit. Try Any time or select fewer ingredients.";
  if (new Set(plans.map(plan => plan.technique.id)).size !== 3) return "The recipes need three different cooking approaches.";
  return null;
}
