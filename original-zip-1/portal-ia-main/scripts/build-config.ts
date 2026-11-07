import path from "node:path";
import { loadEnv } from "vite";
import { sharepointOriginFrom } from "../src/shared/sharepoint-origin.ts";

type Environment = Record<string, string | undefined>;

export type BuildConfig = {
  skillsDir: string;
  skillsRef: string;
  repoUrl: string;
  channel: string;
  // True in a CI, where the skills checkout has to be exactly a commit.
  ci: boolean;
  // The origin of the recordings of the technical breaks, the only one the policy lets into an iframe. The build stops without it
  // when a break exists (scripts/intervals.ts).
  sharepointOrigin: string | null;
};

// The only variables the build reads. Everything else in the environment or in the .env stays out of the build.
export const BUILD_VARIABLES = ["SKILLS_DIR", "SKILLS_REF", "SKILLS_REPO_URL", "SKILLS_CHANNEL", "CI", "SHAREPOINT_ORIGIN"] as const;

const SITE = path.resolve(import.meta.dirname, "..");
const REF = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;

function optional(env: Environment, name: string): string {
  return env[name]?.trim() ?? "";
}

function branchFrom(env: Environment, name: string, fallback: string): string {
  const value = optional(env, name) || fallback;
  if (!REF.test(value) || value.includes("..") || value.endsWith("/") || value.endsWith(".lock")) {
    throw new Error(`${name} must be the name of a git branch or tag, like stable. Got "${value}".`);
  }
  return value;
}

// The clone URL the commands and the managed settings show. The portal never clones with it, so it carries no credential.
function repoUrlFrom(env: Environment): string {
  const value = optional(env, "SKILLS_REPO_URL");
  if (!value) throw new Error("Missing environment variable SKILLS_REPO_URL, the https clone URL of the skills repository. See .env.example.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`SKILLS_REPO_URL must be an absolute URL, like https://gitlab.example.com/group/skills.git. Got "${value}".`);
  }
  if (url.protocol !== "https:") throw new Error("SKILLS_REPO_URL must use https.");
  if (url.username || url.password) throw new Error("SKILLS_REPO_URL must not carry a credential: the commands and the pages show it to everyone.");
  if (url.search || url.hash || !url.pathname.endsWith(".git")) throw new Error("SKILLS_REPO_URL must be the clone URL, ending in .git, without a query or fragment.");
  return url.href;
}

export function readBuildConfig(env: Environment): BuildConfig {
  return {
    skillsDir: path.resolve(SITE, optional(env, "SKILLS_DIR") || "../skills"),
    skillsRef: optional(env, "SKILLS_REF") ? branchFrom(env, "SKILLS_REF", "") : "",
    repoUrl: repoUrlFrom(env),
    channel: branchFrom(env, "SKILLS_CHANNEL", "stable"),
    ci: optional(env, "CI") === "true",
    sharepointOrigin: optional(env, "SHAREPOINT_ORIGIN") ? sharepointOriginFrom(optional(env, "SHAREPOINT_ORIGIN")) : null,
  };
}

// The environment of the process wins over the .env, as in Vite. Only the keys above leave this function, so nothing else of the
// .env can reach the build.
export function loadBuildEnvironment(root: string): Environment {
  const loaded = loadEnv("", root, "");
  return Object.fromEntries(BUILD_VARIABLES.map((name) => [name, loaded[name]]));
}

let current: BuildConfig | undefined;

// The same reading for the build, the dev server, the unit tests and the browser tests.
export function buildConfig(): BuildConfig {
  return (current ??= readBuildConfig(loadBuildEnvironment(SITE)));
}
