import { useCallback, useSyncExternalStore } from "react";
import { areas } from "@/data/areas";
import type { AreaId } from "@/data/types";
import { createStoredValue } from "@/lib/storage";
import { oneOf } from "@/lib/utils";

const AREA_IDS = areas.map((a) => a.id);
const myArea = createStoredValue<AreaId>("portal:my-area:v1", (raw) => oneOf(raw, AREA_IDS) ?? null);

// The area of the person's role, kept only in this browser. Only the choice on the home page sets it.
export function useMyArea(): { area: AreaId | null; choose: (area: AreaId | null) => void } {
  const area = useSyncExternalStore(myArea.subscribe, myArea.read, myArea.empty);
  const choose = useCallback((next: AreaId | null) => myArea.write(next), []);
  return { area, choose };
}
