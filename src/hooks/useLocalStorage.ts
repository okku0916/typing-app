"use client";

import { useCallback, useEffect, useState } from "react";

import { readStorage, writeStorage } from "@/lib/storage";

type SetStateAction<T> = T | ((prev: T) => T);

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setValue(readStorage<T>(key, fallback));
  }, [key, fallback]);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }
      setValue(readStorage<T>(key, fallback));
      setVersion((prev) => prev + 1);
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, fallback]);

  const setPersistedValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      setValue((previousValue) => {
        const resolvedValue =
          typeof nextValue === "function"
            ? (nextValue as (prev: T) => T)(previousValue)
            : nextValue;

        writeStorage(key, resolvedValue);
        setVersion((prev) => prev + 1);
        return resolvedValue;
      });
    },
    [key],
  );

  return [value, setPersistedValue, version] as const;
}

export function useLocalStorageVersion(key: string) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }
      setVersion((prev) => prev + 1);
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return version;
}
