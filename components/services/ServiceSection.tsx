"use client";

import { useEffect, useRef, useState } from "react";

export default function ServiceSection({
  id,
  number,
  title,
  intro,
  bullets,
}: {
  id: string;
  number: string;
  title: string;
  intro: string;
  bullets: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className="rounded-3xl border overflow-hidden transition-all duration-700"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        scrollMarginTop: "90px",
      }}
    >
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* left number/title block */}
        <div className="p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
          <div>
            <p className="font-display font-light select-none leading-none mb-4"
              style={{ fontSize: "clamp(4rem,8vw,6rem)", color: "var(--border-2)" }}>
              {number}
            </p>
            <h3 className="font-display text-xl md:text-2xl leading-tight">{title}</h3>
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-colors"
              style={{ color: "var(--gold)" }}
            >
              Enquire →
            </a>
          </div>
        </div>

        {/* right content */}
        <div className="p-8 md:p-10">
          <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-dim)" }}>
            {intro}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border px-4 py-3 transition-all duration-500"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-2)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(8px)",
                  transitionDelay: `${0.1 + i * 0.06}s`,
                }}
              >
                <span className="mt-0.5 shrink-0" style={{ color: "var(--gold)", fontSize: "0.55rem" }}>✦</span>
                <span className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
