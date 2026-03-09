"use client";

import { useState, useEffect } from "react";

export default function ServicesIndex({
  items,
}: {
  items: Array<{ id: string; title: string }>;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      for (const item of [...items].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(item.id);
          return;
        }
      }
      setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <div
      className="sticky top-[64px] z-40 border-b overflow-x-auto"
      style={{ background: "var(--nav-bg)", borderColor: "var(--border)", backdropFilter: "blur(12px)", boxShadow: "var(--nav-shadow)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-1 py-3 min-w-max">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="rounded-full px-4 py-1.5 text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: active === it.id ? "var(--gold)" : "transparent",
                color: active === it.id ? "var(--on-gold)" : "var(--text-dim)",
                border: active === it.id ? "none" : "1px solid var(--border)",
              }}
            >
              {it.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
