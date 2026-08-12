import type { Category } from "./types";

export function groupCategoryIdsByEvent(
  rows: { event_id: string; category_id: string }[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const list = map.get(row.event_id) ?? [];
    list.push(row.category_id);
    map.set(row.event_id, list);
  }
  return map;
}

export function resolveCategories(
  categoryIds: string[],
  categoryById: Map<string, Category>,
): Category[] {
  return categoryIds
    .map((id) => categoryById.get(id))
    .filter((c): c is Category => c !== undefined);
}
