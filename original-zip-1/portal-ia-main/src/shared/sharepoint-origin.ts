// The recordings of the technical breaks play from the SharePoint of the team. The origin enters the frame-src of the content security
// policy, so it has to be one SharePoint origin and nothing wider: https, a host under sharepoint.com, no path, no wildcard.
const SHAREPOINT_HOST = /^[a-z0-9-]+\.sharepoint\.com$/;

export function sharepointOriginFrom(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`SHAREPOINT_ORIGIN must be the origin of the SharePoint of the recordings, like https://empresa.sharepoint.com. Got "${value}".`);
  }
  if (url.protocol !== "https:" || !SHAREPOINT_HOST.test(url.hostname) || url.port || url.username || url.password) {
    throw new Error(`SHAREPOINT_ORIGIN must be an https origin under sharepoint.com, like https://empresa.sharepoint.com. Got "${value}".`);
  }
  if (url.pathname !== "/" || url.search || url.hash) throw new Error("SHAREPOINT_ORIGIN must be an origin, without a path, query or fragment.");
  return url.origin;
}
