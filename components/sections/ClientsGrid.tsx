import { ClientItem } from "@/lib/api";

function typeBadgeStyle(type: ClientItem["type"]) {
  switch (type) {
    case "University":
      return {
        border: "1px solid rgba(37,99,235,0.18)",
        background: "rgba(37,99,235,0.08)",
        color: "#1d4ed8",
      };
    case "Industry":
      return {
        border: "1px solid rgba(16,185,129,0.18)",
        background: "rgba(16,185,129,0.08)",
        color: "#047857",
      };
    case "Government":
      return {
        border: "1px solid rgba(245,158,11,0.18)",
        background: "rgba(245,158,11,0.08)",
        color: "#b45309",
      };
    case "Institute":
      return {
        border: "1px solid rgba(139,92,246,0.18)",
        background: "rgba(139,92,246,0.08)",
        color: "#6d28d9",
      };
    case "Research":
      return {
        border: "1px solid rgba(6,182,212,0.18)",
        background: "rgba(6,182,212,0.08)",
        color: "#0e7490",
      };
    default:
      return {
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        color: "var(--text-dim)",
      };
  }
}

export default function ClientsGrid({
  title = "Trusted by Institutions and Industry",
  subtitle =
    "We work with universities, institutes, industries, and organizations across Bangladesh through dependable technical support and engineering solutions.",
  items,
}: {
  title?: string;
  subtitle?: string;
  items: ClientItem[];
}) {
  return (
    <section
      className="rounded-3xl border p-6 md:p-8"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="mb-8">
        <div className="gold-line" />
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        <p
          className="mt-3 max-w-3xl text-sm leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          {subtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((client) => (
          <article
            key={client.id}
            className="card-lift group rounded-2xl border flex flex-col p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Client
                </p>
                <h3 className="text-sm font-semibold leading-snug">{client.name}</h3>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium whitespace-nowrap"
                style={typeBadgeStyle(client.type)}
              >
                {client.type}
              </span>
            </div>

            <div
              className="rounded-xl border px-3 py-2 mb-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <p
                className="text-[10px] tracking-wider uppercase mb-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Sector
              </p>
              <p className="text-sm font-medium">{client.sector || "Engineering"}</p>
            </div>

            {client.summary && (
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--text-dim)" }}
              >
                {client.summary}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
