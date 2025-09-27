export default function Section({ children }: { children: React.ReactNode }) {
  return <section className="p-6 min-h-[400px] w-[900px] bg-accent/10 rounded-2xl border-1 border-amber-500 flex flex-col gap-6 shadow-double">
    {children}
</section>;
}