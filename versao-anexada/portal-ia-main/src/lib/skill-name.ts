const NAME = "pg-[a-z0-9]+(?:-[a-z0-9]+)*";

export function skillNamesIn(text: string): string[] {
  return text.match(new RegExp(`\\b${NAME}`, "g")) ?? [];
}

export function splitAtSkillNames(text: string): string[] {
  return text.split(new RegExp(`(\\b${NAME})`, "g"));
}

export function exactSkillName(text: string): string | undefined {
  return new RegExp(`^/?(?:[a-z0-9-]+:)?(${NAME})$`).exec(text.trim())?.[1];
}
