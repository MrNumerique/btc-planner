export function buildNeighborMap(
  pairs: { commune_id: string; neighbor_id: string }[],
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  const add = (a: string, b: string) => {
    const set = map.get(a) ?? new Set<string>();
    set.add(b);
    map.set(a, set);
  };

  for (const { commune_id, neighbor_id } of pairs) {
    add(commune_id, neighbor_id);
    add(neighbor_id, commune_id);
  }

  return map;
}
