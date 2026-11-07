type Directives = Record<string, readonly string[]>;

const DIRECTIVES: Directives = {
  "default-src": ["'self'"],
  // TanStack Start inlines the hydration and scroll restoration scripts, and the site inlines the theme script that runs before paint.
  "script-src": ["'self'", "'unsafe-inline'"],
  // sonner injects a <style> tag, and React writes animation delays into style attributes.
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  // Vite inlines small font files into the CSS as data: URLs.
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "object-src": ["'none'"],
  // No <base> tag exists in the site, and one injected into a page would redirect every relative address.
  "base-uri": ["'none'"],
  "form-action": ["'self'"],
};

// The recordings of the technical breaks play in an iframe from the SharePoint of the team (SHAREPOINT_ORIGIN, checked by
// sharepoint-origin.ts). Without it, no frame directive is added, and default-src keeps every iframe from outside out.
function withFrames(directives: Directives, sharepointOrigin: string | null): Directives {
  return sharepointOrigin ? { ...directives, "frame-src": [sharepointOrigin] } : directives;
}

function buildPolicy(directives: Directives): string {
  return Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(" "))
    .join("; ");
}

export function metaContentSecurityPolicy(sharepointOrigin: string | null): string {
  return buildPolicy(withFrames(DIRECTIVES, sharepointOrigin));
}

// The BFF swaps 'unsafe-inline' for a per-response nonce, and frame-ancestors only works in a response header.
export function serverDirectives<Source>(nonceSource: Source, sharepointOrigin: string | null): Record<string, readonly (string | Source)[]> {
  return { ...withFrames(DIRECTIVES, sharepointOrigin), "script-src": ["'self'", nonceSource], "frame-ancestors": ["'none'"] };
}

// The files of the plugins in /acervo are handed out as they are, and their HTML and JavaScript are not the site's: sandboxed and with
// nothing allowed to load, they cannot run on the portal's origin, whatever the person opens. fetch and download do not read this policy.
export const ACERVO_DIRECTIVES: Directives = { sandbox: [], "default-src": ["'none'"] };
export const ACERVO_CONTENT_SECURITY_POLICY = buildPolicy(ACERVO_DIRECTIVES);

export function serverContentSecurityPolicy(nonce: string, sharepointOrigin: string | null): string {
  return buildPolicy(serverDirectives(`'nonce-${nonce}'`, sharepointOrigin));
}
