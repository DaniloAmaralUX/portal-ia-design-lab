import type { Plugin } from "vite";
import { BEFORE_PAINT_SCRIPT } from "../src/lib/before-paint.ts";
import { metaContentSecurityPolicy } from "../src/shared/content-security-policy.ts";
import { buildConfig } from "./build-config.ts";

const FONTS = [/inter-latin-wght-normal.*\.woff2$/, /montserrat-latin-wght-normal.*\.woff2$/];

// What index.html needs and a static file cannot hold: the script that sets the theme before the first paint, the policy, and the preload of the two fonts of the first screen.
export function indexHtml(): Plugin {
  return {
    name: "pitang-index-html",
    transformIndexHtml(html, context) {
      const tags: { tag: string; attrs?: Record<string, string | boolean>; children?: string; injectTo: "head-prepend" | "head" }[] = [
        { tag: "script", children: BEFORE_PAINT_SCRIPT, injectTo: "head-prepend" },
      ];
      if (context.bundle) {
        // The Vite dev server updates the page through a websocket and scripts that the policy would block, so the policy only goes into the build.
        tags.unshift({ tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: metaContentSecurityPolicy(buildConfig().sharepointOrigin) }, injectTo: "head-prepend" });
        for (const name of Object.keys(context.bundle)) {
          if (FONTS.some((font) => font.test(name))) {
            tags.push({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "anonymous", href: `/${name}` }, injectTo: "head" });
          }
        }
      }
      // The encoding must come in the first 1024 bytes, so it goes before the policy and the script.
      tags.unshift({ tag: "meta", attrs: { charset: "utf-8" }, injectTo: "head-prepend" });
      return { html, tags };
    },
  };
}
