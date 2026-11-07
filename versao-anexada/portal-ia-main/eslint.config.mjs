import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// The features of src/features and the others each one may import, by their index only. A table with no cycle is what keeps the
// graph acyclic: a feature that needs one that depends on it moves the shared piece down to components, lib or data.
const FEATURES = {
  academy: [],
  catalog: ["install", "method"],
  changelog: [],
  explore: ["method"],
  home: ["academy", "method"],
  install: [],
  manifesto: ["method"],
  method: [],
  pages: [],
  palette: ["method"],
  publish: ["academy"],
  shell: ["palette"],
  tools: ["method"],
};

const NO_FEATURES = {
  group: ["@/features", "@/features/**", "**/features/**"],
  message: "components, lib, hooks, data, store and shared never import a feature: move the piece they share down, or pass it in as a prop.",
};
const NO_VIRTUAL = {
  group: ["virtual:*"],
  message: "A .tsx does not import a virtual module: src/data/, or a .ts of data in the feature, reads it and the component gets the value.",
};
const NO_DEEP_IMPORT = {
  group: ["@/features/*/*"],
  message: "A feature is imported only by its index (@/features/name), never by an internal path.",
};
const NO_ENUM = { selector: "TSEnumDeclaration", message: "No enum: use a union of strings and a Record." };
const NO_DYNAMIC_VIRTUAL = {
  selector: "ImportExpression[source.value=/^virtual:/]",
  message: "A .tsx does not import a virtual module: src/data/, or a .ts of data in the feature, reads it and the component gets the value.",
};
const restricted = (...patterns) => ["error", { patterns }];

const featureBlocks = Object.entries(FEATURES).flatMap(([name, uses]) => {
  const own = {
    group: [`@/features/${name}`, `@/features/${name}/**`],
    message: "Inside its own feature the import is relative (./x).",
  };
  const others = Object.keys(FEATURES)
    .filter((other) => other !== name && !uses.includes(other))
    .map((other) => ({ group: [`@/features/${other}`], message: `The ${name} feature does not depend on ${other}: no cycle between features, so move the shared piece down.` }));
  return [
    { files: [`src/features/${name}/**/*.ts`], rules: { "no-restricted-imports": restricted(own, NO_DEEP_IMPORT, ...others) } },
    { files: [`src/features/${name}/**/*.tsx`], rules: { "no-restricted-imports": restricted(own, NO_DEEP_IMPORT, NO_VIRTUAL, ...others) } },
  ];
});

export default defineConfig(
  { ignores: ["node_modules", "dist", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat["recommended-latest"],
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
      "no-console": ["error", { allow: ["error", "warn"] }],
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "no-else-return": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/only-throw-error": [
        "error",
        { allow: [{ from: "package", package: "@tanstack/router-core", name: ["NotFoundError", "Redirect"] }] },
      ],
    },
  },
  {
    // Production code only imports what the Docker image installs: Node, Hono, iron-session and openid-client, and the shared folder.
    files: ["bff/**/*.ts", "src/shared/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(?!node:|hono(/|$)|@hono/node-server(/|$)|iron-session$|openid-client$|\\./|\\.\\./src/shared/)",
              message: "The BFF and src/shared/ import only node:*, hono, @hono/node-server, iron-session, openid-client and each other: the Docker image installs nothing else.",
            },
            NO_FEATURES,
          ],
        },
      ],
    },
  },
  {
    // The layers below the features never import them (rule 1 of the structure in architecture.md).
    files: ["src/lib/**/*.ts", "src/hooks/**/*.ts", "src/data/**/*.ts", "src/store/**/*.ts", "src/components/**/*.ts"],
    rules: { "no-restricted-imports": restricted(NO_FEATURES) },
  },
  {
    files: ["src/components/**/*.tsx"],
    rules: { "no-restricted-imports": restricted(NO_FEATURES, NO_VIRTUAL) },
  },
  {
    files: ["src/routes/**/*.tsx", "src/main.tsx"],
    rules: { "no-restricted-imports": restricted(NO_DEEP_IMPORT, NO_VIRTUAL) },
  },
  ...featureBlocks,
  {
    // Size, exports and enums of the source (rules of the structure in architecture.md).
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.d.ts", "src/routeTree.gen.ts"],
    rules: {
      "max-lines": ["error", { max: 300 }],
      "no-restricted-exports": ["error", { restrictDefaultExports: { direct: true, named: true, defaultFrom: true, namedFrom: true, namespaceFrom: true } }],
      "no-restricted-syntax": ["error", NO_ENUM],
    },
  },
  {
    // The same for the import() of a virtual module, which no-restricted-imports does not see.
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.d.ts"],
    rules: { "no-restricted-syntax": ["error", NO_ENUM, NO_DYNAMIC_VIRTUAL] },
  },
  {
    // Content, not code: the courses, the lessons and the tracks of the academy are data written by hand, and the size of the file is the size of the content.
    files: ["src/**/data/courses.ts", "src/**/data/lessons.ts", "src/**/data/training.ts", "src/**/courses.ts", "src/**/lessons.ts", "src/**/training.ts"],
    rules: { "max-lines": "off" },
  },
  {
    // Plain JavaScript is not in a tsconfig, so no rule that needs types can run on it.
    files: ["**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { parserOptions: { projectService: false } },
  },
);
