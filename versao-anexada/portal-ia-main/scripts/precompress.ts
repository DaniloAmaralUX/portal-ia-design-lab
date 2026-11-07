import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

// HTML is left out on purpose: the BFF puts a new nonce in every page, so it cannot be served from a fixed file.
const TEXT = new Set([".js", ".css", ".json", ".txt", ".md", ".svg", ".ts", ".yaml", ".yml", ".sh", ".diff", ".py", ".feature"]);
const MIN_BYTES = 1024;

function* files(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) yield* files(file);
    else yield file;
  }
}

export function precompress(root: string): { files: number; bytes: number; brotliBytes: number } {
  let count = 0;
  let bytes = 0;
  let brotliBytes = 0;
  for (const file of files(root)) {
    if (!TEXT.has(path.extname(file)) || statSync(file).size < MIN_BYTES) continue;
    const body = readFileSync(file);
    const variants: [string, Buffer][] = [
      [".br", brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })],
      [".gz", gzipSync(body, { level: 9 })],
    ];
    for (const [extension, compressed] of variants) {
      if (compressed.length >= body.length) continue;
      writeFileSync(file + extension, compressed);
      if (extension === ".br") brotliBytes += compressed.length;
    }
    bytes += body.length;
    count += 1;
  }
  return { files: count, bytes, brotliBytes };
}

if (import.meta.main) {
  const root = path.resolve(import.meta.dirname, "../dist/client");
  const { files: count, bytes, brotliBytes } = precompress(root);
  console.warn(`Precompressed ${count} files in ${root}: ${(bytes / 1024 / 1024).toFixed(1)} MB, ${(brotliBytes / 1024 / 1024).toFixed(1)} MB with brotli.`);
}
