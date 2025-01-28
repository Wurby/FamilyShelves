import { Preferences } from "@capacitor/preferences";
import { useState, useEffect } from "react";

export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from storage on mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        const { value } = await Preferences.get({ key });
        setStoredValue(value ? JSON.parse(value) : initialValue);
      } catch (error) {
        console.error("Error loading from storage:", error);
        setStoredValue(initialValue);
      }
    };
    loadValue();
  }, [key, initialValue]);

  // Save to storage
  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  };

  return [storedValue, setValue];
}
