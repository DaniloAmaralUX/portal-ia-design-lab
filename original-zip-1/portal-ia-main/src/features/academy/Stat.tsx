export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[6.5rem] flex-1 flex-col-reverse justify-end bg-card px-5 py-4">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="font-display text-headline font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
