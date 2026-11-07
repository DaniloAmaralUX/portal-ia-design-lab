// The lists that come in as they scroll into view (`reveal-children`, in globals.css) are for what comes in from below. Each time a
// page paints, what is already on the screen is marked to show whole.
export function showWhatIsOnScreen() {
  for (const item of document.querySelectorAll<HTMLElement>(".reveal-children > *")) {
    if (item.getBoundingClientRect().top < window.innerHeight) item.dataset.shown = "";
  }
}
