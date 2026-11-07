import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { imageSize } from "./image-size.ts";

const IMAGES = path.resolve(import.meta.dirname, "../src/content/guides/img");
const read = (name: string) => new Uint8Array(readFileSync(path.join(IMAGES, name)));

describe("the size of a figure, read from its header", () => {
  it.each([
    ["estudo-de-caso-1.png", { width: 536, height: 723 }],
    ["estudo-de-caso-2.jpg", { width: 526, height: 748 }],
    ["estudo-de-caso-3.png", { width: 642, height: 251 }],
    ["estudo-de-caso-4.png", { width: 933, height: 767 }],
    ["sdd-1.png", { width: 514, height: 454 }],
    ["sdd-2.png", { width: 189, height: 306 }],
  ])("reads %s", (name, size) => {
    expect(imageSize(read(name))).toEqual(size);
  });

  it("skips the segments before the frame of a JPEG, such as an APP1 with EXIF", () => {
    const app1 = [0xff, 0xe1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
    const frame = [0xff, 0xc2, 0x00, 0x11, 0x08, 0x01, 0x2c, 0x02, 0x58, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01];
    expect(imageSize(new Uint8Array([0xff, 0xd8, ...app1, ...frame]))).toEqual({ width: 600, height: 300 });
  });

  it("gives null for a file that is not a PNG or a JPEG, or is cut short", () => {
    expect(imageSize(new TextEncoder().encode("<svg></svg>"))).toBeNull();
    expect(imageSize(read("sdd-1.png").slice(0, 20))).toBeNull();
    expect(imageSize(read("estudo-de-caso-2.jpg").slice(0, 12))).toBeNull();
    expect(imageSize(new Uint8Array([0xff, 0xd8, 0xff]))).toBeNull();
    expect(imageSize(new Uint8Array())).toBeNull();
  });

  it("gives null for a size of zero", () => {
    const png = read("sdd-1.png").slice(0, 24);
    new DataView(png.buffer).setUint32(16, 0);
    expect(imageSize(png)).toBeNull();
  });
});
