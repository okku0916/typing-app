export type MistakeMap = Record<string, number>;

export function incrementMistake(map: MistakeMap, key: string): MistakeMap {
  const normalized = key.length === 1 ? key : key.toLowerCase();

  return {
    ...map,
    [normalized]: (map[normalized] ?? 0) + 1,
  };
}

export function decrementMistake(map: MistakeMap, key: string): MistakeMap {
  const normalized = key.length === 1 ? key : key.toLowerCase();
  const current = map[normalized] ?? 0;

  if (current <= 1) {
    const next = { ...map };
    delete next[normalized];
    return next;
  }

  return {
    ...map,
    [normalized]: current - 1,
  };
}

export function mergeMistakeMaps(base: MistakeMap, addition: MistakeMap): MistakeMap {
  const merged: MistakeMap = { ...base };

  Object.entries(addition).forEach(([key, value]) => {
    merged[key] = (merged[key] ?? 0) + value;
  });

  return merged;
}
export function subtractMistakeMaps(base: MistakeMap, subtraction: MistakeMap): MistakeMap {
  let result = { ...base };

  Object.entries(subtraction).forEach(([key, count]) => {
    for (let i = 0; i < count; i += 1) {
      result = decrementMistake(result, key);
    }
  });

  return result;
}

export function toWeakKeysTop3(map: MistakeMap): Array<{ key: string; count: number }> {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({ key, count }));
}
