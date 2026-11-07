// The Markdown of a guide calls a figure of the site as an image, ![what it shows](figura/name): the text stays Markdown, with no
// HTML of its own, and the figure follows the theme and the width of the screen. A scheme like figura:name would not do, because
// react-markdown empties the address of any protocol it does not know.
const PREFIX = "figura/";

export function figureName(src: string): string | null {
  return src.startsWith(PREFIX) && src.length > PREFIX.length ? src.slice(PREFIX.length) : null;
}

// The figures a Markdown text calls, each alone on its line, as the guide writes them.
export function figuresIn(source: string): string[] {
  return [...source.matchAll(/^!\[[^\]]+\]\(([^)\s]+)\)$/gm)].flatMap(([, src = ""]) => {
    const name = figureName(src);
    return name ? [name] : [];
  });
}
