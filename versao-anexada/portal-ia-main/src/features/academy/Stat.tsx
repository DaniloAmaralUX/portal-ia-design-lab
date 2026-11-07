export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[6.5rem] flex-1 flex-col-reverse justify-end bg-card px-4 py-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="font-display text-headline font-bold tabular-nums">{value}</dd>
    </div>
  );
}
