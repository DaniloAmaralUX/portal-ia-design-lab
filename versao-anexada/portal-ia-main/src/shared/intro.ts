// The key under which the tab keeps the mark that the opening of the site played. The site writes it, so the opening plays once,
// and the login page clears it, so each sign-in opens the site with it again: the logout clears the cache, not the tab's storage.
export const INTRO_SEEN_KEY = "intro:home";
