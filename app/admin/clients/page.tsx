import Link from "next/link";
import { fetchClients, fetchTestimonials } from "@/lib/api";

export const dynamic = "force-dynamic";

const typeBadgeStyle = (type: string) => {
  switch (type) {
    case "University":
      return { borderColor: "rgba(37,99,235,0.18)", background: "rgba(37,99,235,0.08)", color: "#1d4ed8" };
    case "Industry":
      return { borderColor: "rgba(16,185,129,0.18)", background: "rgba(16,185,129,0.08)", color: "#047857" };
    case "Government":
      return { borderColor: "rgba(245,158,11,0.18)", background: "rgba(245,158,11,0.08)", color: "#b45309" };
    case "Institute":
      return { borderColor: "rgba(139,92,246,0.18)", background: "rgba(139,92,246,0.08)", color: "#6d28d9" };
    case "Research":
      return { borderColor: "rgba(6,182,212,0.18)", background: "rgba(6,182,212,0.08)", color: "#0e7490" };
    default:
      return { borderColor: "var(--border-2)", background: "var(--surface-2)", color: "var(--text-dim)" };
  }
};

export default async function ClientsPage() {
  const [clients, testimonials] = await Promise.all([
    fetchClients().catch(() => []),
    fetchTestimonials({ limit: 6 }).catch(() => []),
  ]);

  const typeGroups = ["University", "Institute", "Industry", "Government", "Research", "Private"].reduce<Record<string, typeof clients>>((acc, t) => {
    const group = clients.filter((c) => c.type === t);
    if (group.length) acc[t] = group;
    return acc;
  }, {});

  return (
    <main className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative px-6 sm:px-10 pt-20 pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] top-[-10%] left-[-10%]" />
          <div className="absolute top-1/3 right-[10%] w-32 h-32 rounded-full border opacity-20 anim-float" style={{ borderColor: "var(--gold-border)" }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="gold-line !mb-0 !w-12" />
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">Our Clients</span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl">
            Trusted Across<br />
            <em className="shimmer-gold not-italic">Bangladesh's Leading</em><br />
            Institutions
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-dim)]">
            Technical Aid supports a diverse range of clients with engineering equipment, technical services, installation, and long-term support.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
              <span className="relative z-10">Start a Project</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: "var(--gold-light)" }} />
            </Link>
            <Link href="/services"
              className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ROW ─── */}
      <div className="px-6 sm:px-10 pb-16">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Clients", value: `${clients.length}+` },
            { label: "Universities & Institutes", value: `${(typeGroups["University"]?.length || 0) + (typeGroups["Institute"]?.length || 0)}+` },
            { label: "Industry & Government", value: `${(typeGroups["Industry"]?.length || 0) + (typeGroups["Government"]?.length || 0)}+` },
            { label: "Years of Service", value: "6+" },
          ].map((s) => (
            <div key={s.label} className="grad-border p-5 text-center">
              <p className="font-display text-3xl font-semibold shimmer-gold">{s.value}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)] tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CLIENTS BY TYPE ─── */}
      {Object.entries(typeGroups).map(([type, items]) => (
        <section key={type} className="px-6 sm:px-10 pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">{type}s</h2>
              <span className="rounded-full border px-3 py-0.5 text-xs" style={typeBadgeStyle(type)}>
                {items.length}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((client) => (
                <article key={client.id} className="card-lift grad-border p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[var(--text)] text-sm leading-5">{client.name}</h3>
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px]" style={typeBadgeStyle(client.type)}>
                      {client.type}
                    </span>
                  </div>
                  {client.sector && (
                    <p className="text-xs text-[var(--gold)] opacity-80">{client.sector}</p>
                  )}
                  {client.summary && (
                    <p className="text-sm text-[var(--text-dim)] leading-6">{client.summary}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {clients.length === 0 && (
        <div className="px-6 sm:px-10 pb-16">
          <div className="mx-auto max-w-7xl grad-border p-12 text-center">
            <p className="text-[var(--text-muted)]">Client information will be published soon.</p>
          </div>
        </div>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <section className="px-6 sm:px-10 py-24" style={{ background: "var(--surface-2)" }}>
          <div className="mx-auto max-w-7xl">
            <span className="gold-line" />
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-12">What Clients Say</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="card-lift grad-border p-6 flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: Math.min(5, t.rating || 5) }).map((_, i) => (
                      <span key={i} className="text-[var(--gold)] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-[var(--text-dim)] italic font-display flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm font-semibold text-[var(--text)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="relative px-6 sm:px-10 py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-blob w-[600px] h-[400px] bg-[var(--gold)] opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="gold-line block mb-6" style={{ margin: "0 auto 1.5rem" }} />
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Looking for a Dependable Engineering Partner?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-[var(--text-dim)] leading-7">
            Whether you need sourcing, installation, training, or servicing support — Technical Aid is ready to help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-semibold overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
              <span className="relative z-10">Contact Us</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: "var(--gold-light)" }} />
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border px-7 py-4 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}>
              About Technical Aid
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}