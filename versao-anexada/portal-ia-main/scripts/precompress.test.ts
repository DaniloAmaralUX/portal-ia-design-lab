import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { precompress } from "./precompress.ts";

const BIG = "console.log('portal');\n".repeat(200);
let root = "";
const at = (file: string) => path.join(root, file);

beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), "portal-precompress-"));
  mkdirSync(at("assets"), { recursive: true });
  mkdirSync(at("plugins"), { recursive: true });
  writeFileSync(at("assets/app.js"), BIG);
  writeFileSync(at("plugins/pr-review.md"), "# Plugin\n".repeat(300));
  writeFileSync(at("index.html"), `<html>${"<p>page</p>".repeat(300)}</html>`);
  writeFileSync(at("assets/small.js"), "1");
  writeFileSync(at("assets/font.woff2"), Buffer.alloc(4000, 7));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("the precompression of the build", () => {
  const result = () => precompress(root);

  it("writes a .br and a .gz that open to the original, for text files of 1 KB or more", () => {
    result();
    expect(brotliDecompressSync(readFileSync(at("assets/app.js.br"))).toString()).toBe(BIG);
    expect(gunzipSync(readFileSync(at("assets/app.js.gz"))).toString()).toBe(BIG);
    expect(readFileSync(at("plugins/pr-review.md.br")).length).toBeGreaterThan(0);
  });

  it("never touches HTML, which takes a new nonce on every response", () => {
    result();
    expect(() => readFileSync(at("index.html.br"))).toThrow();
    expect(() => readFileSync(at("index.html.gz"))).toThrow();
  });

  it("leaves small and binary files alone, and does not compress its own output twice", () => {
    const first = result();
    const second = result();
    expect(() => readFileSync(at("assets/small.js.br"))).toThrow();
    expect(() => readFileSync(at("assets/font.woff2.br"))).toThrow();
    expect(() => readFileSync(at("assets/app.js.br.br"))).toThrow();
    expect(second.files).toBe(first.files);
    expect(first.files).toBe(2);
  });
});
