export type EffectKind = "writes" | "code" | "runs" | "network" | "credential" | "git" | "read-only";
export type LifecycleId = "experimental" | "incubating" | "supported" | "deprecated";

export type AreaId = "produto" | "qualidade" | "engenharia" | "meio";

export type SkillBadge = { label: "Nova" | "Mudou"; version: string };

export type Area = {
  id: AreaId;
  name: string;
  audience: string;
  pitch: string;
};

export type FlowTrack = {
  title: string;
  note?: string;
  steps: string[][];
  optional?: string[];
};

// What scripts/catalogo.mjs, in the skills repository, returns for the release the portal builds from. The text of the files stays in the files.
export type ReleasePlugin = {
  name: string;
  displayName: string;
  version: string;
  description: string;
  category: string;
  keywords: string[];
  owner: string;
  area: AreaId;
  lifecycle: LifecycleId;
  creator: string;
  tagline: string;
  audience: string;
  expects: string[];
  tracks: FlowTrack[];
  intro: string;
  path: string;
  skills: string[];
  components: { skills: number; agents: number; hooks: number; mcpServers: number };
  listChars: number;
  files: string[];
  contributors: string[];
  updatedAt: string;
};

export type ReleaseSkill = {
  slug: string;
  plugin: string;
  path: string;
  title: string;
  example: string;
  output: string;
  description: string;
  manual: boolean;
  requires: string[];
  effects: EffectKind[];
  creator: string;
  listChars: number | null;
  files: string[];
  contributors: string[];
  updatedAt: string;
};

export type Release = {
  format: number;
  ref: string;
  commit: string;
  commitDate: string;
  marketplace: { name: string; description: string; ownerUrl: string };
  changelog: string;
  plugins: ReleasePlugin[];
  skills: ReleaseSkill[];
};

export type CatalogPlugin = { name: string; title: string; area: AreaId; skills: string[] };
export type CatalogSkill = { slug: string; plugin: string; title: string };
export type CatalogIndex = {
  marketplace: string;
  commit: string;
  repoUrl: string;
  channel: string;
  plugins: CatalogPlugin[];
  skills: CatalogSkill[];
};

// What the pages need: the plugins without the file list the downloads use, and no changelog.
export type Plugin = Omit<ReleasePlugin, "files">;

export type Skill = ReleaseSkill & {
  summary: string;
  whenToUse: string | null;
  whenNotToUse: string | null;
  seeAlso: string[];
  seeAlsoPlugins: string[];
  requiredBy: string[];
  order: number;
  news: SkillBadge | null;
};

// A technical break of the Academy, from the head of its file in src/content/intervals/. The text of the file loads with its page.
export type Interval = {
  slug: string;
  title: string;
  date: string;
  minutes: number | null;
  area: AreaId | null;
  summary: string;
  video: string;
};

// A lesson of a training, from the head of its file in src/content/trainings/<course>/<number>.md. It takes the area of its
// course, and the text of the file loads with its page.
export type Training = {
  course: string;
  number: number;
  title: string;
  date: string;
  minutes: number | null;
  area: AreaId | null;
  summary: string;
  video: string;
};

// A course of the trainings, from the course.md of its folder, with its lessons in order.
export type TrainingCourse = {
  slug: string;
  title: string;
  summary: string;
  area: AreaId | null;
  lessons: Training[];
};