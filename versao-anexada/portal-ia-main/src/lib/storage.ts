type StorageArea = "localStorage" | "sessionStorage";

export function readStorage(area: StorageArea, key: string): string | null {
  try {
    return window[area].getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(area: StorageArea, key: string, value: string): boolean {
  try {
    window[area].setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStorage(area: StorageArea, key: string): boolean {
  try {
    window[area].removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// The same tab learns of a write through its own event, and the other tabs through the storage event.
function subscribeTo(changeEvent: string) {
  return (notify: () => void) => {
    window.addEventListener(changeEvent, notify);
    window.addEventListener("storage", notify);
    return () => {
      window.removeEventListener(changeEvent, notify);
      window.removeEventListener("storage", notify);
    };
  };
}

export function createStoredValue<T extends string>(key: string, parse: (raw: string | null) => T | null) {
  const changeEvent = `storage:${key}`;
  const read = (): T | null => parse(readStorage("localStorage", key));
  const write = (value: T | null) => {
    const saved = value === null ? removeStorage("localStorage", key) : writeStorage("localStorage", key, value);
    if (saved) window.dispatchEvent(new Event(changeEvent));
  };
  return { read, subscribe: subscribeTo(changeEvent), write, empty: (): T | null => null };
}

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const EMPTY: ReadonlySet<string> = new Set();

export function createStoredSet(key: string) {
  const changeEvent = `storage:${key}`;
  let cache: { raw: string | null; values: ReadonlySet<string> } = { raw: null, values: EMPTY };

  const read = (): ReadonlySet<string> => {
    const raw = readStorage("localStorage", key);
    if (raw !== cache.raw) cache = { raw, values: new Set(parseList(raw)) };
    return cache.values;
  };

  const subscribe = subscribeTo(changeEvent);

  const write = (values: ReadonlySet<string>) => {
    if (writeStorage("localStorage", key, JSON.stringify([...values]))) window.dispatchEvent(new Event(changeEvent));
  };

  return { read, subscribe, write, empty: () => EMPTY };
}
