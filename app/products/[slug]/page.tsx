import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await fetchProductBySlug(slug);

  if (!data) notFound();

  const { product, related } = data;

  return (
    <main>

      {/* ─── BREADCRUMB ─── */}
      <div className="px-4 pt-6 pb-2">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/products" className="hover:text-[var(--gold)] transition-colors">Products</Link>
          <span>/</span>
          <span style={{ color: "var(--text-dim)" }}>{product.name}</span>
        </div>
      </div>

      {/* ─── HERO GRID ─── */}
      <section className="px-4 pt-8 pb-12">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Images */}
          <div className="grad-border p-4 overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden rounded-xl" style={{ background: "var(--surface-2)" }}>
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Product Image
                </div>
              )}
            </div>

            {product.gallery_images?.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.gallery_images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="grad-border p-7 md:p-8 flex flex-col">
            <div>
              <p className="text-xs tracking-widest text-[var(--gold)] uppercase opacity-80 mb-3">
                {product.category?.name || "Product"}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight leading-tight text-[var(--text)]">
                {product.name}
              </h1>
              {product.short_title && (
                <p className="mt-2 text-[var(--text-dim)]">{product.short_title}</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.sector_tag && (
                <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}>
                  {product.sector_tag}
                </span>
              )}
              {product.model_code && (
                <span className="rounded-full border px-3 py-1 text-xs font-mono" style={{ borderColor: "var(--gold-border)", color: "var(--gold)", background: "var(--gold-glow)" }}>
                  {product.model_code}
                </span>
              )}
              {product.is_featured && (
                <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "rgba(201,168,76,0.3)", color: "var(--gold)", background: "var(--gold-glow)" }}>
                  Featured
                </span>
              )}
            </div>

            <div className="mt-6 h-px w-12" style={{ background: "var(--gold)" }} />

            <p className="mt-5 text-sm leading-7 text-[var(--text-dim)] flex-1">
              {product.description || product.summary || "Product details will be updated soon."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold overflow-hidden"
                style={{ background: "var(--gold)", color: "var(--on-gold)" }}
              >
                <span className="relative z-10">Get a quote</span>
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: "var(--gold-light)" }} />
              </Link>
              {product.brochure_url && (
                <a
                  href={product.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:bg-black/5"
                  style={{ borderColor: "var(--gold-border)", color: "var(--gold)" }}
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-all hover:bg-black/5"
                style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}
              >
                ← All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES + SPECS ─── */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
          {/* Key Features */}
          <div className="grad-border p-7">
            <p className="text-xs tracking-widest text-[var(--gold)] uppercase opacity-70 mb-4">Key Features</p>
            {product.key_features?.length ? (
              <ul className="space-y-3">
                {product.key_features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-dim)]">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--gold)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No feature list added yet.</p>
            )}
          </div>

          {/* Technical Specs */}
          <div className="grad-border p-7">
            <p className="text-xs tracking-widest text-[var(--gold)] uppercase opacity-70 mb-4">Technical Specifications</p>
            {product.technical_specs?.length ? (
              <div className="space-y-2">
                {product.technical_specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-4 py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs text-[var(--text-muted)] pt-0.5">{s.label || "Spec"}</p>
                    <p className="text-sm text-[var(--text-dim)]">{s.value || "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No technical specs added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── EDUCATIONAL OBJECTIVES ─── */}
      {product.educational_objectives?.length > 0 && (
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-7xl grad-border p-7">
            <p className="text-xs tracking-widest text-[var(--gold)] uppercase opacity-70 mb-4">Educational Objectives</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {product.educational_objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[var(--text-dim)] py-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <span className="font-mono text-[var(--gold)] text-xs opacity-60 shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  {obj}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RELATED ─── */}
      {related?.length > 0 && (
        <section className="px-4 py-16" style={{ background: "var(--surface-2)" }}>
          <div className="mx-auto max-w-7xl">
            <span className="gold-line" />
            <h2 className="font-display text-2xl font-semibold tracking-tight mb-8">Related Products</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="card-lift grad-border p-5"
                >
                  <p className="text-xs text-[var(--gold)] opacity-80 mb-2">{p.category?.name || "General"}</p>
                  <h3 className="font-semibold text-[var(--text)] text-sm">{p.name}</h3>
                  {p.summary && (
                    <p className="mt-2 text-xs text-[var(--text-dim)] line-clamp-2 leading-5">{p.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}