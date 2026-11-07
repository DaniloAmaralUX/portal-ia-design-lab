import { useCallback, useSyncExternalStore } from "react";
import { createStoredSet } from "@/lib/storage";

const completedCourses = createStoredSet("academy:completed-courses:v1");

export function useCompletedCourses(): { completed: ReadonlySet<string>; toggle: (course: string) => void } {
  const completed = useSyncExternalStore(completedCourses.subscribe, completedCourses.read, completedCourses.empty);
  const toggle = useCallback((course: string) => {
    const next = new Set(completedCourses.read());
    if (next.has(course)) next.delete(course);
    else next.add(course);
    completedCourses.write(next);
  }, []);
  return { completed, toggle };
}
