"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PublicProductCard, TestimonialItem, ClientItem } from "@/lib/api";

/* ── Intersection observer hook ─────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Stat counter hook ───────────────────────────────────── */
function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

const STATS = [
  { value: 2018, label: "Year Founded",        suffix: "",  prefix: "" },
  { value: 500,  label: "Projects Delivered",  suffix: "+", prefix: "" },
  { value: 200,  label: "Satisfied Clients",   suffix: "+", prefix: "" },
  { value: 5,    label: "Core Service Lines",  suffix: "",  prefix: "" },
];

const SERVICES = [
  {
    id: "global-sourcing",
    number: "01",
    label: "Global Sourcing",
    icon: "◎",
    desc: "International procurement of industrial and lab equipment with full QA, supplier evaluation, and import coordination.",
    tags: ["Industrial Machinery", "Lab Equipment", "Automation Parts"],
  },
  {
    id: "supply-installation",
    number: "02",
    label: "Supply & Installation",
    icon: "⬡",
    desc: "Complete supply, installation, testing, and commissioning for electrical and power systems across Bangladesh.",
    tags: ["Substations", "LT/HT Panels", "Battery Systems"],
  },
  {
    id: "repairing-servicing",
    number: "03",
    label: "Repairing & Servicing",
    icon: "⟳",
    desc: "Repair, calibration, and preventive maintenance for lab instruments, industrial automation, and power systems.",
    tags: ["Lab Instruments", "Industrial Systems", "Calibration"],
  },
  {
    id: "training",
    number: "04",
    label: "Training",
    icon: "◈",
    desc: "Hands-on programs bridging academia and industry — PLC, SCADA, IoT, embedded systems, and power systems.",
    tags: ["PLC / SCADA", "IoT", "Power Systems"],
  },
  {
    id: "design-implementation",
    number: "05",
    label: "Design & Implementation",
    icon: "⬙",
    desc: "End-to-end electrical, mechanical CAD/CAM, PCB design, automation integration, and production-ready delivery.",
    tags: ["Electrical Design", "PCB / CAD", "Automation"],
  },
];

const WHY_POINTS = [
  { icon: "⟁", title: "Engineering-First Thinking",    body: "Every engagement starts with a deep technical assessment of your actual requirement — not a catalog selection." },
  { icon: "◎", title: "Local + Global Reach",          body: "We combine local manufacturing with international sourcing to deliver optimal quality at competitive prices." },
  { icon: "⬡", title: "Full Project Accountability",   body: "From procurement and design through installation, training, and after-sales — we remain your partner at every step." },
  { icon: "✦", title: "Six Years of Sector Depth",     body: "Deep, proven experience across education, power, industrial automation, and research since 2018." },
];

const CLIENT_NAMES = [
  "BUET","RUET","CUET","KUET","SUST","BRAC University",
  "DUET","MIST","IUT","AUST","BPDB","DESCO","PGCB","BAEC","BRTC",
];

/* ════════════════════════════════════════════════════════ */
export default function HomepageClient({
  products, testimonials, clients,
}: {
  products: PublicProductCard[];
  testimonials: TestimonialItem[];
  clients: ClientItem[];
}) {
  const brandNames = clients.length ? clients.map(c => c.name) : CLIENT_NAMES;
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProductsSection products={products} />
      <MarqueeSection brands={brandNames} />
      <WhySection />
      {testimonials.length > 0 && <TestimonialsSection items={testimonials} />}
      <CtaSection />
    </main>
  );
}

/* ── HERO ─────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* ambient blobs */}
      <div className="glow-blob" style={{ width: 700, height: 700, top: "-20%", left: "-18%", background: "var(--gold-glow)", opacity: 0.5 }} />
      <div className="glow-blob" style={{ width: 400, height: 400, bottom: "5%", right: "-12%", background: "rgba(255,255,255,0.025)" }} />

      {/* rotating geometric ornament */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block" aria-hidden style={{ opacity: 0.07 }}>
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" style={{ animation: "rotateSlow 80s linear infinite" }}>
          <circle cx="210" cy="210" r="205" stroke="white" strokeWidth="0.6"/>
          <circle cx="210" cy="210" r="160" stroke="white" strokeWidth="0.6"/>
          <circle cx="210" cy="210" r="110" stroke="white" strokeWidth="0.6"/>
          <circle cx="210" cy="210" r="60"  stroke="white" strokeWidth="0.6"/>
          <line x1="5"   y1="210" x2="415" y2="210" stroke="white" strokeWidth="0.4"/>
          <line x1="210" y1="5"   x2="210" y2="415" stroke="white" strokeWidth="0.4"/>
          <line x1="60"  y1="60"  x2="360" y2="360" stroke="white" strokeWidth="0.3"/>
          <line x1="360" y1="60"  x2="60"  y2="360" stroke="white" strokeWidth="0.3"/>
          <polygon points="210,10 400,340 20,340" stroke="white" strokeWidth="0.3" fill="none"/>
        </svg>
      </div>

      {/* static inner ornament */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block" aria-hidden style={{ opacity: 0.12 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <rect x="10" y="10" width="140" height="140" stroke="#c9a84c" strokeWidth="0.8"/>
          <rect x="30" y="30" width="100" height="100" stroke="#c9a84c" strokeWidth="0.5"/>
          <circle cx="80" cy="80" r="30" stroke="#c9a84c" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* eyebrow */}
          <div className="anim-fade-up anim-delay-1 flex items-center gap-3 mb-7">
            <div style={{ width: 36, height: 2, background: "var(--gold)" }} />
            <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: "var(--gold)" }}>
              Engineering Solutions · Est. 2018 · Dhaka
            </span>
          </div>

          {/* headline */}
          <h1 className="anim-fade-up anim-delay-2 font-display leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "var(--text)" }}>
            Where Precision<br />
            <em className="not-italic shimmer-gold">Meets Purpose.</em>
          </h1>

          {/* sub */}
          <p className="anim-fade-up anim-delay-3 mt-7 text-lg md:text-xl leading-relaxed font-light max-w-2xl"
            style={{ color: "var(--text-dim)" }}>
            Technical Aid is Bangladesh's trusted partner for engineering equipment, industrial automation, and technical education — delivering reliable solutions from concept to commissioning.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up anim-delay-4 mt-10 flex flex-wrap gap-4">
            <Link href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
              style={{ background: "var(--gold)", color: "var(--on-gold)", boxShadow: "0 8px 32px rgba(201,168,76,0.25)" }}>
              Start a Project
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-medium transition-all duration-300 hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text)" }}>
              Browse Products
            </Link>
          </div>

          {/* trust row */}
          <div className="anim-fade-up anim-delay-5 mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            {["500+ Projects Delivered", "200+ Clients", "Education + Industry", "Since 2018"].map(b => (
              <span key={b} className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--gold)", fontSize: "0.6rem" }}>✦</span> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="anim-fade-in anim-delay-7 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0.35 }}>
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>Scroll</span>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
      </div>
    </section>
  );
}

/* ── STATS ───────────────────────────────────────────────── */
function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const count = useCounter(stat.value, 1600, active);
  return (
    <div className="py-12 px-8 text-center">
      <p className="font-display font-medium" style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", color: "var(--gold)" }}>
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </p>
      <p className="mt-2 text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "var(--text-muted)" }}>
        {stat.label}
      </p>
    </div>
  );
}

function StatsSection() {
  const { ref, visible } = useReveal(0.2);
  return (
    <div ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: "var(--border)" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="transition-all duration-700"
              style={{
                transitionDelay: `${i * 120}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              }}>
              <StatItem stat={s} active={visible} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SERVICES ────────────────────────────────────────────── */
function ServicesSection() {
  const { ref, visible } = useReveal(0.08);
  const [active, setActive] = useState(0);
  const svc = SERVICES[active];

  return (
    <section ref={ref} className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* heading */}
        <div className="mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}>
          <div className="gold-line" />
          <h2 className="font-display tracking-tight" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>What We Do</h2>
          <p className="mt-4 max-w-lg text-lg font-light" style={{ color: "var(--text-dim)" }}>
            Five core service lines built for reliability, precision, and lasting value across education and industry.
          </p>
        </div>

        {/* interactive panel */}
        <div className="rounded-3xl overflow-hidden grad-border"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: "opacity 0.8s 0.2s ease, transform 0.8s 0.2s ease",
          }}>
          <div className="grid lg:grid-cols-[320px_1fr]">
            {/* list */}
            <div style={{ background: "var(--surface-2)", borderRight: "1px solid var(--border)" }}>
              {SERVICES.map((s, i) => (
                <button key={s.id} onClick={() => setActive(i)}
                  className="w-full text-left flex items-center gap-4 px-6 py-5 transition-all duration-200 relative"
                  style={{
                    borderBottom: i < SERVICES.length - 1 ? `1px solid var(--border)` : "none",
                    background: active === i ? "var(--surface-3)" : "transparent",
                    borderLeft: active === i ? "3px solid var(--gold)" : "3px solid transparent",
                  }}>
                  <span className="text-xl shrink-0 transition-colors duration-200" style={{ color: active === i ? "var(--gold)" : "var(--text-muted)" }}>
                    {s.icon}
                  </span>
                  <div>
                    <span className="block text-[10px] mb-0.5 font-medium tracking-wider" style={{ color: active === i ? "var(--gold-dim)" : "var(--text-muted)" }}>
                      {s.number}
                    </span>
                    <span className="text-sm font-medium transition-colors duration-200" style={{ color: active === i ? "var(--text)" : "var(--text-dim)" }}>
                      {s.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* detail pane */}
            <div className="p-10 md:p-14 flex flex-col justify-between min-h-[360px]" style={{ background: "var(--surface-3)" }}>
              <div>
                <p className="font-display font-light select-none mb-1" style={{ fontSize: "clamp(4rem,8vw,7rem)", color: "var(--border-2)", lineHeight: 1 }}>
                  {svc.number}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl" style={{ color: "var(--gold)" }}>{svc.icon}</span>
                  <h3 className="font-display text-2xl md:text-3xl">{svc.label}</h3>
                </div>
                <p className="mt-5 text-base leading-relaxed max-w-lg" style={{ color: "var(--text-dim)" }}>{svc.desc}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {svc.tags.map(t => (
                    <span key={t} className="rounded-full px-3 py-1 text-xs border" style={{ borderColor: "var(--gold-border)", color: "var(--gold)", background: "var(--gold-glow)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/services#${svc.id}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover-line self-start"
                style={{ color: "var(--gold)" }}>
                Explore this service →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {SERVICES.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: active === i ? 24 : 8, height: 8, background: active === i ? "var(--gold)" : "var(--border-2)" }} />
            ))}
          </div>
          <Link href="/services" className="text-sm hover-line" style={{ color: "var(--text-dim)" }}>
            View full service breakdown →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── PRODUCTS ────────────────────────────────────────────── */
function ProductCard({ p, delay, visible }: { p: PublicProductCard; delay: number; visible: boolean }) {
  return (
    <Link href={`/products/${p.slug}`}
      className="card-lift group rounded-2xl border overflow-hidden flex flex-col"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ${delay}ms ease, transform 0.65s ${delay}ms ease, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}>
      <div className="aspect-[16/10] overflow-hidden relative" style={{ background: "var(--surface-3)" }}>
        {p.image_url ? (
          <img src={p.image_url} alt={p.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="font-display text-5xl font-medium" style={{ color: "var(--border-2)" }}>TA</span>
          </div>
        )}
        {p.is_featured && (
          <span className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider"
            style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
            Featured
          </span>
        )}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(11,18,32,0.55) 0%, transparent 60%)" }} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)" }}>
          {p.category?.name || "Product"}
        </p>
        <h3 className="font-medium leading-snug mb-2" style={{ fontSize: "0.9375rem" }}>{p.name}</h3>
        {p.model_code && (
          <p className="text-xs mb-3 font-medium" style={{ color: "var(--gold-dim)" }}>Model: {p.model_code}</p>
        )}
        <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: "var(--text-dim)" }}>
          {p.summary || "Engineering product by Technical Aid."}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[var(--gold)]"
            style={{ color: "var(--text-muted)" }}>
            View details <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
          {p.sector_tag && (
            <span className="text-[10px] rounded-full px-2 py-0.5 border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {p.sector_tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductsSection({ products }: { products: PublicProductCard[] }) {
  const { ref, visible } = useReveal(0.08);
  return (
    <section ref={ref} className="py-28 md:py-36" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}>
          <div>
            <div className="gold-line" />
            <h2 className="font-display tracking-tight" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>Featured Products</h2>
            <p className="mt-4 text-lg font-light max-w-lg" style={{ color: "var(--text-dim)" }}>
              Engineering training systems and industrial equipment trusted by institutions nationwide.
            </p>
          </div>
          <Link href="/products" className="text-sm font-medium hover-line shrink-0" style={{ color: "var(--gold)" }}>
            View all products →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grad-border p-16 text-center">
            <p className="font-display text-2xl mb-3">Products coming soon</p>
            <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>Our catalog is being updated. Contact us for a custom inquiry.</p>
            <Link href="/contact"
              className="inline-flex rounded-full px-7 py-3 text-sm font-semibold transition-all hover:scale-[1.04]"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
              Get in touch
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={i * 90} visible={visible} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── MARQUEE ─────────────────────────────────────────────── */
function MarqueeSection({ brands }: { brands: string[] }) {
  const doubled = [...brands, ...brands];
  return (
    <div className="py-16 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <p className="text-center text-[10px] tracking-[0.35em] uppercase mb-8 font-medium" style={{ color: "var(--text-muted)" }}>
        Trusted by institutions and industries across Bangladesh
      </p>
      <div className="flex">
        <div className="marquee-track flex shrink-0 items-center gap-6 pr-6">
          {doubled.map((b, i) => (
            <span key={i} className="shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-dim)", background: "var(--surface)" }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── WHY US ──────────────────────────────────────────────── */
function WhySection() {
  const { ref, visible } = useReveal(0.1);
  return (
    <section ref={ref} className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
          {/* left */}
          <div className="transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-24px)" }}>
            <div className="gold-line" />
            <h2 className="font-display tracking-tight leading-tight" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Why Engineers<br />Choose Technical Aid
            </h2>
            <p className="mt-6 text-lg font-light leading-relaxed max-w-md" style={{ color: "var(--text-dim)" }}>
              For over six years we have built lasting relationships with universities, industrial enterprises, and government bodies across Bangladesh — not by selling products, but by solving real engineering problems.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/about"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all hover:bg-black/5"
                style={{ borderColor: "var(--border-2)", color: "var(--text)" }}>
                Learn our story →
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.04]"
                style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
                Talk to us
              </Link>
            </div>
          </div>

          {/* right grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_POINTS.map((p, i) => (
              <div key={p.title}
                className="card-lift grad-border p-6"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.65s ${0.1 + i * 0.1}s ease, transform 0.65s ${0.1 + i * 0.1}s ease, box-shadow 0.3s ease`,
                }}>
                <span className="text-2xl block mb-4" style={{ color: "var(--gold)" }}>{p.icon}</span>
                <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ────────────────────────────────────────── */
function TestimonialsSection({ items }: { items: TestimonialItem[] }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <section ref={ref} className="py-28 md:py-36" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}>
          <div className="gold-line" />
          <h2 className="font-display tracking-tight" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>Client Voices</h2>
          <p className="mt-4 text-lg font-light" style={{ color: "var(--text-dim)" }}>Words from institutions and teams we have served.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((t, i) => (
            <div key={t.id}
              className="rounded-2xl border flex flex-col p-7"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.65s ${i * 0.12}s ease, transform 0.65s ${i * 0.12}s ease`,
              }}>
              <div className="flex gap-0.5 mb-5" style={{ color: "var(--gold)" }}>
                {Array.from({ length: Math.min(5, t.rating || 5) }).map((_, j) => (
                  <span key={j} style={{ fontSize: "0.9rem" }}>★</span>
                ))}
              </div>
              <p className="font-display italic text-lg leading-relaxed flex-1" style={{ color: "var(--text-dim)" }}>
                "{t.quote}"
              </p>
              <div className="mt-6 pt-5 flex items-center gap-3.5" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{ background: "var(--gold-glow)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/clients" className="text-sm hover-line" style={{ color: "var(--text-dim)" }}>
            See all client stories →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────── */
function CtaSection() {
  const { ref, visible } = useReveal(0.2);
  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="glow-blob" style={{ width: 600, height: 600, top: "-30%", left: "-15%", background: "var(--gold-glow)", opacity: 0.35 }} />
      <div className="glow-blob" style={{ width: 300, height: 300, bottom: "-10%", right: "-8%", background: "var(--gold-glow)", opacity: 0.2 }} />

      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <div className="transition-all duration-900"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transitionDuration: "0.9s" }}>
          {/* large bg letters */}
          <p className="font-display font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none whitespace-nowrap"
            style={{ fontSize: "clamp(8rem,20vw,18rem)", color: "var(--surface)", lineHeight: 1, zIndex: -1 }}>
            TA
          </p>

          <div className="gold-line mx-auto" />
          <h2 className="font-display tracking-tight leading-tight" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
            Ready to Build<br />
            <em className="not-italic shimmer-gold">Something Great?</em>
          </h2>
          <p className="mt-6 text-lg font-light max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Tell us your engineering challenge. Our team will respond with a practical, cost-effective plan within 24 hours.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
              style={{ background: "var(--gold)", color: "var(--on-gold)", boxShadow: "0 8px 40px rgba(201,168,76,0.28)" }}>
              Start a Conversation
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2 rounded-full border px-9 py-4 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text)" }}>
              Browse Products
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3">
            <a href="tel:01518357567" className="flex items-center gap-2 text-sm hover-line transition-colors" style={{ color: "var(--text-muted)" }}>
              📞 01518357567
            </a>
            <a href="mailto:info@technicalaidbd.com" className="flex items-center gap-2 text-sm hover-line transition-colors" style={{ color: "var(--text-muted)" }}>
              ✉ info@technicalaidbd.com
            </a>
            <span className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              📍 Mirpur, Dhaka
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
