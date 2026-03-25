export const dynamic = "force-dynamic";

import Link from "next/link";
import { fetchBlogs } from "@/lib/api";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = (await searchParams) || {};
  const q = sp.q?.trim() || "";

  const blogs = await fetchBlogs({ q: q || undefined });

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
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">News & Updates</span>
          </div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight max-w-4xl">
            Technical Insights &amp;<br />
            <em className="shimmer-gold not-italic">Company Journals</em>
          </h1>
          <p className="mt-6 max-w-2xl text-[var(--text-dim)] leading-7">
            Stay updated with our latest engineering projects, educational system deployments, and industry news at Technical Aid.
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
              placeholder="Search articles..."
              className="flex-1 min-w-[180px] rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold-border)]"
              style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: "var(--text)" }}
            />
            <button
              type="submit"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              Search
            </button>
            {q && (
              <Link href="/blogs" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: "var(--text-muted)" }}>
                Clear
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* ─── GRID ─── */}
      <section className="px-6 sm:px-10 py-12">
        <div className="mx-auto max-w-7xl">
          {blogs.length === 0 ? (
            <div className="grad-border p-16 text-center">
              <p className="text-[var(--text-muted)]">No articles found.</p>
              <Link href="/blogs" className="mt-4 inline-block text-sm text-[var(--gold)] hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="card-lift group grad-border overflow-hidden flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--surface-2)" }}>
                    {b.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">TA Update</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <p className="text-xs text-[var(--gold)] opacity-80 mb-3">
                      {b.published_at ? new Date(b.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </p>
                    <h3 className="font-semibold text-lg text-[var(--text)] leading-snug">{b.title}</h3>
                    {b.summary && (
                      <p className="mt-3 text-sm text-[var(--text-dim)] line-clamp-3 leading-relaxed flex-1">{b.summary}</p>
                    )}
                    <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] transition-transform group-hover:translate-x-1">
                        Read Article →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
