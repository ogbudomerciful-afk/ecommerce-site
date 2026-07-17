import StoreShell from "@/components/store-shell";

export default function BusinessPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <StoreShell view="business">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <div className="mt-6 space-y-4 text-slate-600">{children}</div>
        </div>
      </div>
    </StoreShell>
  );
}
