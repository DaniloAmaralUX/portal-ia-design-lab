// The three dots of a window bar, with no wrapper, so the gap of the bar that holds them still sets the space between them.
export function WindowDots() {
  return (
    <>
      <span className="size-2.5 rounded-full bg-window-close" />
      <span className="size-2.5 rounded-full bg-window-minimize" />
      <span className="size-2.5 rounded-full bg-window-zoom" />
    </>
  );
}
