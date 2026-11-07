// The problems render after the submit handler returns, so the focus waits for the next frame to find the first field marked.
export function focusFirstProblem(form: HTMLFormElement): void {
  requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}
