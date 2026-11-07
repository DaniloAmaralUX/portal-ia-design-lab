import { useId, useState, type FormEvent } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Button } from "../primitives";
export function PortalSearch() {
  const id = useId();
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); window.location.assign(`/explorar${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`); }
  return <form role="search" onSubmit={submit} className="proto-search"><Search size={18} aria-hidden /><label htmlFor={id} className="sr-only">Buscar no portal</label><input id={id} value={query} onChange={event => setQuery(event.target.value)} placeholder="O que você quer fazer com IA?" /><Button type="submit" size="icon" aria-label="Buscar"><ArrowUpRight /></Button></form>;
}
