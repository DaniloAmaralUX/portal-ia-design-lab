import { useCallback, useSyncExternalStore } from "react";
import { createStoredSet } from "@/lib/storage";

const readChapters = createStoredSet("academy:read-chapters:v1");

export function useReadChapters(): { readIds: ReadonlySet<string>; mark: (id: string) => void } {
  const readIds = useSyncExternalStore(readChapters.subscribe, readChapters.read, readChapters.empty);
  const mark = useCallback((id: string) => {
    const current = readChapters.read();
    if (!current.has(id)) readChapters.write(new Set([...current, id]));
  }, []);
  return { readIds, mark };
}
