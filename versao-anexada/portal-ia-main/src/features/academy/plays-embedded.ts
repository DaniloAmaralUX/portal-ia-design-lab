type BrowserInfo = { userAgent: string; userAgentData?: { brands: { brand: string }[] } };

// Only Edge signs SharePoint in with the work account of Windows and hands its cookies to the iframe by default. The other
// browsers open the player without the session, and the login of Microsoft refuses to open in an iframe.
export function playsEmbedded(browser: BrowserInfo): boolean {
  return browser.userAgentData?.brands.some((b) => b.brand === "Microsoft Edge") ?? /\bEdg\//.test(browser.userAgent);
}
