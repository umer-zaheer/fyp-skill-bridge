type Props = { title: string; description?: string };

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm p-8">
      <h2 className="text-2xl font-semibold text-white font-serif">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">
        {description ?? "This section is part of the dashboard scaffolding. UI coming next."}
      </p>
    </div>
  );
}
