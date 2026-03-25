export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchBlogBySlug } from "@/lib/api";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchBlogBySlug(slug);

  if (!data) {
    notFound();
  }

  const { blog, related } = data;

  return (
    <main className="overflow-x-hidden">
      {/* ─── HEADER ─── */}
      <section className="relative px-6 sm:px-10 pt-24 pb-12 overflow-hidden" style={{ background: "var(--surface)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-blob w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] top-[-20%] left-[-10%]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider hover-line mb-8" style={{ color: "var(--gold)" }}>
            ← Back to Updates
          </Link>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
            {blog.title}
          </h1>
          <p className="mt-6 text-sm flex items-center justify-center gap-3 uppercase tracking-widest text-[var(--text-muted)]">
            <span className="w-8 h-px bg-[var(--gold-border)]" />
            {blog.published_at ? new Date(blog.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Update'}
            <span className="w-8 h-px bg-[var(--gold-border)]" />
          </p>
        </div>
      </section>

      {/* ─── FEATURED IMAGE ─── */}
      {blog.image_url && (
        <section className="px-6 sm:px-10">
          <div className="mx-auto max-w-5xl rounded-[28px] overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.image_url} alt={blog.title} className="w-full object-cover" style={{ maxHeight: '600px' }} />
          </div>
        </section>
      )}

      {/* ─── CONTENT ─── */}
      <section className="px-6 sm:px-10 py-16">
        <div className="mx-auto max-w-3xl prose prose-neutral prose-lg lg:prose-xl whitespace-pre-wrap" style={{ color: "var(--text)" }}>
          {blog.content}
        </div>
      </section>

      {/* ─── RELATED ─── */}
      {related && related.length > 0 && (
        <section className="px-6 sm:px-10 py-20 border-t" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
          <div className="mx-auto max-w-7xl">
            <h3 className="font-display text-2xl font-semibold mb-8">More Updates</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="card-lift group grad-border overflow-hidden flex flex-col bg-[var(--surface)]"
                >
                  <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--surface-3)" }}>
                    {b.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.image_url} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <p className="text-xs text-[var(--gold)] opacity-80 mb-2">
                      {b.published_at ? new Date(b.published_at).toLocaleDateString() : 'Recent'}
                    </p>
                    <h4 className="font-semibold text-[var(--text)] line-clamp-2">{b.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
