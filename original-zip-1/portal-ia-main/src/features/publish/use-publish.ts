import { useState, type FormEvent } from "react";
import type { PublishRequest } from "./files";
import { focusFirstProblem } from "./focus-first-problem";
import { submitForReview, type Submission } from "./submit";

export function usePublish() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Submission | null>(null);

  const send = async (request: PublishRequest) => {
    if (sending) return;
    setSending(true);
    // The answer of the last try goes away while the new one is on its way, so the result section does not show an old failure.
    setResult(null);
    setResult(await submitForReview(request));
    setSending(false);
  };

  const submit = (e: FormEvent<HTMLFormElement>, problems: number, request: PublishRequest) => {
    e.preventDefault();
    setSubmitted(true);
    if (problems > 0) focusFirstProblem(e.currentTarget);
    else void send(request);
  };

  return { submitted, sending, result, submit };
}
