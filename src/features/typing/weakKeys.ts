export type MistakeMap = Record<string, number>;

export function incrementMistake(map: MistakeMap, key: string): MistakeMap {
  const normalized = key.length === 1 ? key : key.toLowerCase();

  return {
    ...map,
    [normalized]: (map[normalized] ?? 0) + 1,
  };
}

export function toWeakKeysTop3(map: MistakeMap): Array<{ key: string; count: number }> {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({ key, count }));
}
