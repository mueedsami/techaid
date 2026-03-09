import Link from "next/link";
import { fetchProductCategories, fetchProducts } from "@/lib/api";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const sp = (await searchParams) || {};
  const q = sp.q?.trim() || "";
  const category = sp.category?.trim() || "";

  const [categories, products] = await Promise.all([
    fetchProductCategories(),
    fetchProducts({ q: q || undefined, category: category || undefined }),
  ]);

  return (
    <main className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative px-6 sm:px-10 pt-20 pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob w-[500px] h-[500px] bg-[var(--gold)] opacity-[0.04] top-[-15%] right-[-5%]" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="gold-line !mb-0 !w-12" />
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">Products</span>
          </div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight max-w-4xl">
            Engineering Products &amp;<br />
            <em className="shimmer-gold not-italic">Technical Solutions Portfolio</em>
          </h1>
          <p className="mt-6 max-w-2xl text-[var(--text-dim)] leading-7">
            Explore selected products, training systems, and engineering solution modules delivered by Technical Aid across education and industry sectors.
          </p>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <div className="sticky top-[64px] z-40 px-4 py-3 border-b" style={{ background: "var(--nav-bg)", backdropFilter: "blur(16px)", borderColor: "var(--border)", boxShadow: "var(--nav-shadow)" }}>
        <div className="mx-auto max-w-7xl">
          <form className="flex flex-wrap items-center gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="flex-1 min-w-[180px] rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold-border)]"
              style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: "var(--text)" }}
            />
            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: category ? "var(--text)" : "var(--text-muted)" }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              Apply
            </button>
            {(q || category) && (
              <Link href="/products" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: "var(--text-muted)" }}>
                Clear
              </Link>
            )}
          </form>

          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/products"
                className="rounded-full border px-3 py-1 text-xs transition-all"
                style={{
                  borderColor: !category ? "var(--gold-border)" : "var(--border)",
                  background: !category ? "var(--gold-glow)" : "transparent",
                  color: !category ? "var(--gold)" : "var(--text-muted)",
                }}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${encodeURIComponent(c.slug)}`}
                  className="rounded-full border px-3 py-1 text-xs transition-all"
                  style={{
                    borderColor: category === c.slug ? "var(--gold-border)" : "var(--border)",
                    background: category === c.slug ? "var(--gold-glow)" : "transparent",
                    color: category === c.slug ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── GRID ─── */}
      <section className="px-6 sm:px-10 py-12">
        <div className="mx-auto max-w-7xl">
          {products.length === 0 ? (
            <div className="grad-border p-16 text-center">
              <p className="text-[var(--text-muted)]">No products found for this filter.</p>
              <Link href="/products" className="mt-4 inline-block text-sm text-[var(--gold)] hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {products.length} product{products.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="card-lift group grad-border overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--surface-2)" }}>
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Product Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs text-[var(--gold)] opacity-80">{p.category?.name || "General"}</p>
                        {p.sector_tag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                            {p.sector_tag}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-[var(--text)] leading-5">{p.name}</h3>
                      {p.summary && (
                        <p className="mt-3 text-sm text-[var(--text-dim)] line-clamp-2 leading-6 flex-1">{p.summary}</p>
                      )}
                      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                        <span className="text-xs text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </span>
                        {p.is_featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: "rgba(201,168,76,0.3)", color: "var(--gold)", background: "var(--gold-glow)" }}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </main>
  );
}
