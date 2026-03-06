"use client";

import { useCallback, useEffect, useState } from "react";

import { readStorage, writeStorage } from "@/lib/storage";

type SetStateAction<T> = T | ((prev: T) => T);

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readStorage<T>(key, fallback));
  }, [key, fallback]);

  const setPersistedValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      setValue((previousValue) => {
        const resolvedValue =
          typeof nextValue === "function"
            ? (nextValue as (prev: T) => T)(previousValue)
            : nextValue;

        writeStorage(key, resolvedValue);
        return resolvedValue;
      });
    },
    [key],
  );

  return [value, setPersistedValue] as const;
}
