export type ImageSize = { width: number; height: number };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
// The JPEG markers that start a frame and carry its size: SOF0 to SOF15, apart from DHT (C4), JPG (C8) and DAC (CC).
const isFrame = (marker: number) => marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

function pngSize(bytes: Uint8Array): ImageSize | null {
  if (bytes.length < 24 || !PNG_SIGNATURE.every((byte, i) => bytes[i] === byte)) return null;
  // The IHDR chunk comes first: its data starts at byte 16, with the width and then the height, 4 bytes each, big endian.
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function jpegSize(bytes: Uint8Array): ImageSize | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let at = 2;
  while (at + 4 <= bytes.length) {
    if (bytes[at] !== 0xff) return null;
    const marker = bytes[at + 1] ?? 0;
    if (marker === 0xff) {
      at += 1;
      continue;
    }
    if (isFrame(marker)) return at + 9 <= bytes.length ? { width: view.getUint16(at + 7), height: view.getUint16(at + 5) } : null;
    // A segment is its marker, then a length that counts itself and not the marker.
    at += 2 + view.getUint16(at + 2);
  }
  return null;
}

// The size of a PNG or a JPEG, read from its header, or null for anything else or for a file cut short.
export function imageSize(bytes: Uint8Array): ImageSize | null {
  const size = pngSize(bytes) ?? jpegSize(bytes);
  return size && size.width > 0 && size.height > 0 ? size : null;
}
