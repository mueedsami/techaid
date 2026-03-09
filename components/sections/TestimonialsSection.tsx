import { TestimonialItem } from "@/lib/api";

export default function TestimonialsSection({
  title = "What Clients Say",
  subtitle = "A few words from organizations we have supported with sourcing, technical solutions, and implementation.",
  items,
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  items: TestimonialItem[];
  compact?: boolean;
}) {
  return (
    <section className="rounded-3xl border p-6 md:p-8"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
      <div className="mb-8">
        <div className="gold-line" />
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{subtitle}</p>
      </div>

      <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "lg:grid-cols-3"}`}>
        {items.map((t) => {
          const rating = Math.max(1, Math.min(5, Number(t.rating || 5)));
          return (
            <article key={t.id} className="card-lift rounded-2xl border flex flex-col p-5"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex gap-0.5 mb-4" style={{ color: "var(--gold)" }}>
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} style={{ fontSize: "0.85rem" }}>★</span>
                ))}
              </div>
              <p className="font-display italic text-base leading-relaxed flex-1" style={{ color: "var(--text-dim)" }}>
                "{t.quote}"
              </p>
              <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ background: "var(--gold-glow)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
