"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicProductCard } from "@/lib/api";

type Props = {
  products: PublicProductCard[];
};

export default function FeaturedProductsCarousel({ products }: Props) {
  const [index, setIndex] = useState(0);
  const total = products.length;

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  const visibleProducts = useMemo(() => {
    if (!products.length) return [] as PublicProductCard[];
    const ordered = [...products.slice(index), ...products.slice(0, index)];
    return ordered;
  }, [products, index]);

  if (!products.length) return null;

  return (
    <section className="relative px-6 sm:px-10 py-28" style={{ background: "var(--surface-2)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-blob w-[560px] h-[560px] bg-[var(--gold)] opacity-[0.03] top-[-12%] right-[-8%]" />
        <div
          className="absolute inset-x-0 top-0 h-px opacity-50"
          style={{ background: "linear-gradient(to right, transparent, var(--gold-border), transparent)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="gold-line" />
            <h2 className="font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-tight tracking-tight">
              Signature Products
            </h2>
            <p className="mt-4 text-[var(--text-dim)] leading-7">
              A curated look at premium engineering, lab, and training solutions — presented in a polished showcase built to feel more like a portfolio than a catalogue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.24em]"
              style={{ borderColor: "var(--gold-border)", color: "var(--gold)" }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="opacity-40">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>

            <button
              type="button"
              onClick={prev}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--border-2)", color: "var(--text)" }}
              aria-label="Previous products"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--gold-border)", color: "var(--gold)" }}
              aria-label="Next products"
            >
              →
            </button>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}
            >
              Browse Catalogue
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.slice(0, Math.min(3, visibleProducts.length)).map((p, cardIndex) => (
            <Link
              key={`${p.id}-${cardIndex}`}
              href={`/products/${p.slug}`}
              className="group relative overflow-hidden rounded-[28px] border bg-white/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(17,24,39,0.12)]"
              style={{
                borderColor: "var(--border)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86))",
              }}
            >
              <div className="absolute inset-x-8 top-0 h-px opacity-70" style={{ background: "linear-gradient(to right, transparent, var(--gold-border), transparent)" }} />
              <div className="aspect-[16/10] overflow-hidden relative" style={{ background: "var(--surface-2)" }}>
                {p.image_url ? (
                  <>
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.05] ${p.gallery_images && p.gallery_images.length > 0 ? "group-hover:opacity-0" : ""}`}
                    />
                    {p.gallery_images && p.gallery_images.length > 0 && (
                      <img
                        src={p.gallery_images[0]}
                        alt={`${p.name} Alternate`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                      />
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.3em]" style={{ borderColor: "var(--gold-border)", color: "var(--gold)" }}>
                      Technical Aid
                    </div>
                  </div>
                )}
              </div>

              <div className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--gold)] opacity-80">
                      {p.category?.name || "Engineering Systems"}
                    </p>
                    <h3 className="mt-2 font-display text-[1.2rem] font-semibold leading-6 text-[var(--text)]">
                      {p.name}
                    </h3>
                  </div>
                  {p.sector_tag && (
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      {p.sector_tag}
                    </span>
                  )}
                </div>

                <p className="min-h-[4.5rem] text-sm leading-7 text-[var(--text-dim)]">
                  {p.summary || "Premium technical equipment selected for performance, durability, and institutional-grade deployment."}
                </p>

                <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                    Premium Selection
                  </div>
                  <span className="text-sm font-medium text-[var(--gold)] transition-transform duration-300 group-hover:translate-x-1">
                    View Product →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
