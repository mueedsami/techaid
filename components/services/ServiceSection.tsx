"use client";

import { useEffect, useRef, useState } from "react";

export default function ServiceSection({
  id,
  number,
  title,
  intro,
  bullets,
  linkText = "Enquire →",
  linkUrl = "/contact",
  image,
}: {
  id: string;
  number: string;
  title: string;
  intro: string;
  bullets?: string[];
  linkText?: string;
  linkUrl?: string;
  image?: string;
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
        <div className="relative p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r overflow-hidden group"
          style={{ borderColor: "var(--border)", background: "#f4f8ff" }}>
          {image && (
            <>
              <div
                className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply"
                style={{
                  backgroundImage: `url('${image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                }}
              />
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#f4f8ff] via-[#f4f8ff]/70 to-transparent" />
            </>
          )}
          <div className="relative z-10">
            <p className="font-display font-light select-none leading-none mb-4"
              style={{ fontSize: "clamp(4rem,8vw,6rem)", color: "var(--border-2)" }}>
              {number}
            </p>
            <h3 className="font-display text-xl md:text-2xl leading-tight">{title}</h3>
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <a
              href={linkUrl}
              target={linkUrl.startsWith("http") ? "_blank" : undefined}
              rel={linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-colors"
              style={{ color: "var(--gold)" }}
            >
              {linkText}
            </a>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-dim)" }}>
            {intro}
          </p>
          {bullets && bullets.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
