import Link from "next/link";
import FeaturedProductsCarousel from "@/components/sections/FeaturedProductsCarousel";
import { fetchProducts, fetchTestimonials, fetchClients, fetchBlogs } from "@/lib/api";

const services = [
  {
    id: "global-sourcing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Sourcing",
    desc: "Precision-matched machinery and components from international markets.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "supply-installation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Supply & Installation",
    desc: "Complete electrical systems — substations, panels, transformers.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "repairing-servicing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m-1.76-1.76l-1.3-1.3a5.25 5.25 0 10-7.42 7.42l1.3 1.3m1.76 1.76L11.42 15.17zm0 0l-5.83-5.83M10.5 12h.008v.008H10.5V12zm-3 0h.008v.008H7.5V12z" />
      </svg>
    ),
    title: "Repairing & Servicing",
    desc: "Preventive maintenance and rapid repair for industrial systems.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "training",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Training",
    desc: "Hands-on automation and power systems programs for engineers.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "design-implementation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
      </svg>
    ),
    title: "Design & Implementation",
    desc: "Electrical, PCB, mechanical CAD/CAM and automation from concept to production.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "student-projects",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: "Student Projects",
    desc: "Mentorship and hardware access for university engineering projects and research.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop",
  },
];

const stats = [
  { value: "2018",    label: "Founded" },
  { value: "500+",    label: "Projects Delivered" },
  { value: "200+",    label: "Clients Served" },
  { value: "5",       label: "Service Lines" },
];

const clientTypes = ["University", "Institute", "Industry", "Government", "Research"];

export default async function HomePage() {
  const [featuredProducts, testimonials, clients, blogsList] = await Promise.all([
    fetchProducts({ featured: true, limit: 6 }).catch(() => []),
    fetchTestimonials({ featured: true, limit: 3 }).catch(() => []),
    fetchClients().catch(() => []),
    fetchBlogs({ limit: 3 }).catch(() => []),
  ]);

  const clientTypeGroups = clientTypes.reduce<Record<string, number>>((acc, t) => {
    acc[t] = clients.filter((c) => c.type === t).length;
    return acc;
  }, {});

  const recentClients = clients.slice(0, 10);
  const marqueeClients = recentClients.length > 0
    ? [...recentClients, ...recentClients, ...recentClients].slice(0, 24)
    : [];

  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-4 pt-20 pb-16">

        {/* Background geometry */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Background Image and Textures */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
              alt="Engineering background texture"
              className="w-full h-full object-cover object-center opacity-15 md:opacity-20 mix-blend-luminosity"
            />
            {/* Subtle Gradient Overlays for integration */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/90 via-transparent to-[var(--bg)]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-transparent opacity-80" />
            
            {/* Grain Texture */}
            <div className="absolute inset-0 mix-blend-overlay opacity-[0.15]"
              style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')" }}
            />
          </div>

          <div className="absolute inset-0 z-10">
            {/* Gold glow blobs */}
            <div className="glow-blob w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] top-[-10%] left-[-10%]" />
            <div className="glow-blob w-[400px] h-[400px] bg-[var(--gold)] opacity-[0.03] bottom-[5%] right-[-5%]" />

            {/* Fine grid */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "64px 64px"
              }}
            />

            {/* Diagonal gold accent line */}
            <div className="absolute top-[20%] right-[8%] w-px h-[45vh] opacity-20"
              style={{ background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }}
            />
            <div className="absolute bottom-[15%] left-[12%] w-[35vw] h-px opacity-10"
              style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
            />

            {/* Floating ring */}
            <div className="absolute top-[18%] right-[15%] w-32 h-32 rounded-full border border-[var(--gold-border)] opacity-30 anim-float" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-[20%] left-[8%] w-20 h-20 rounded-full border border-[var(--gold-border)] opacity-20 anim-float" style={{ animationDelay: "2.5s" }} />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          {/* Overline */}
          <div className="anim-fade-up flex items-center gap-3 mb-8">
            <span className="gold-line !mb-0 !w-12" />
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">
              Bangladesh's Engineering Partner
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display anim-fade-up anim-delay-1 text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[1.05] tracking-tight max-w-5xl">
            Engineering Solutions<br />
            <em className="shimmer-gold not-italic">Built to Last.</em>
          </h1>

          <p className="anim-fade-up anim-delay-2 mt-8 max-w-2xl text-lg leading-8 text-[var(--text-dim)]">
            Technical Aid delivers world-class engineering equipment, industrial solutions, and technical education support across Bangladesh — combining global sourcing with local expertise since 2018.
          </p>

          <div className="anim-fade-up anim-delay-3 mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-sm font-semibold tracking-wide overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              <span className="relative z-10">Start a Project</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
                style={{ background: "var(--gold-light)" }} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-2xl border px-7 py-4 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}
            >
              View Products <span className="opacity-60">→</span>
            </Link>
          </div>

          {/* Stats row */}
          <div className="anim-fade-up anim-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="grad-border p-5">
                <p className="font-display text-3xl font-semibold shimmer-gold">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)] tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE CLIENT STRIP
      ══════════════════════════════════════════════════ */}
      {marqueeClients.length > 0 && (
        <div className="relative border-y py-5 overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="absolute left-0 top-0 w-20 h-full z-10"
            style={{ background: "linear-gradient(to right, var(--bg), transparent)" }} />
          <div className="absolute right-0 top-0 w-20 h-full z-10"
            style={{ background: "linear-gradient(to left, var(--bg), transparent)" }} />

          <div className="flex w-max marquee-track gap-10 items-center pr-10">
            {marqueeClients.map((c, i) => (
              <div key={i} className="flex shrink-0 items-center justify-center p-3 opacity-90 transition-all hover:opacity-100 hover:scale-[1.03]">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} className="h-10 w-auto object-contain max-w-[140px]" />
                ) : (
                  <span className="whitespace-nowrap text-base font-display font-semibold text-[var(--text-muted)] p-2">
                    {c.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        // <section className="px-6 sm:px-10 py-28" style={{ background: "var(--surface-2)" }}>
        //   <div className="mx-auto max-w-7xl">
        //     <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        //       <div>
        //         <span className="gold-line" />
        //         <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
        //           Featured Products
        //         </h2>
        //         <p className="mt-4 max-w-xl text-[var(--text-dim)]">
        //           Engineering laboratory equipment and technical systems designed for education and industry.
        //         </p>
        //       </div>
        //       <Link
        //         href="/products"
        //         className="hover-line self-start text-sm text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
        //       >
        //         View all products →
        //       </Link>
        //     </div>

        //     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        //       {featuredProducts.map((p) => (
        //         <Link
        //           key={p.id}
        //           href={`/products/${p.slug}`}
        //           className="card-lift group grad-border overflow-hidden flex flex-col"
        //         >
        //           <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--surface-2)" }}>
        //             {p.image_url ? (
        //               // eslint-disable-next-line @next/next/no-img-element
        //               <img
        //                 src={p.image_url}
        //                 alt={p.name}
        //                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        //               />
        //             ) : (
        //               <div className="w-full h-full flex items-center justify-center">
        //                 <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Product</span>
        //               </div>
        //             )}
        //           </div>

        //           <div className="flex flex-col flex-1 p-5">
        //             <div className="flex items-start justify-between gap-2 mb-2">
        //               <p className="text-xs text-[var(--gold)] opacity-80 tracking-wide">
        //                 {p.category?.name || "Engineering"}
        //               </p>
        //               {p.sector_tag && (
        //                 <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full border text-[var(--text-muted)]"
        //                   style={{ borderColor: "var(--border)" }}>
        //                   {p.sector_tag}
        //                 </span>
        //               )}
        //             </div>
        //             <h3 className="font-semibold text-[var(--text)] leading-5 text-[0.95rem]">{p.name}</h3>
        //             {p.summary && (
        //               <p className="mt-3 text-sm text-[var(--text-dim)] line-clamp-2 leading-6 flex-1">{p.summary}</p>
        //             )}
        //             <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        //               <span className="text-xs text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
        //                 View Details →
        //               </span>
        //             </div>
        //           </div>
        //         </Link>
        //       ))}
        //     </div>
        //   </div>
        // </section>
        <FeaturedProductsCarousel products={featuredProducts} />
      )}

      {/* ══════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════ */}
      <section className="relative px-6 sm:px-10 py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob w-[500px] h-[500px] bg-[var(--gold)] opacity-[0.025] top-[20%] left-[50%] -translate-x-1/2" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="gold-line" />
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
                Five Ways We<br />Deliver Value
              </h2>
            </div>
            <Link
              href="/services"
              className="hover-line self-start md:self-auto text-sm text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
            >
              All service lines →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {services.map((s, i) => (
              <Link
                key={s.id}
                href={`/services#${s.id}`}
                className="group relative overflow-hidden flex flex-col gap-4 rounded-2xl min-h-[260px] md:min-h-[280px]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {/* Heavy dark gradient to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-[var(--bg)]/50 mix-blend-multiply opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-[#000]/20 opacity-80" />
                </div>

                {/* Content over image */}
                <div className="relative z-10 p-6 flex flex-col h-full border border-white/10 rounded-2xl transition-colors group-hover:border-white/40 hover:bg-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-white font-display bg-black/40 p-2 rounded-lg backdrop-blur-md">{s.icon}</span>
                    <span className="text-xs text-white/60 font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-sm">0{i + 1}</span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-[1.1rem] font-semibold text-white tracking-wide">{s.title}</h3>
                    <p className="mt-2 text-[0.85rem] leading-[1.6] text-white/70 drop-shadow-sm">{s.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t flex items-center justify-between border-white/10">
                    <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-semibold">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* CTA card - Spans 2 rows in the right-most column */}
            <div className="lg:col-start-4 lg:row-start-1 lg:row-span-2 p-8 flex flex-col justify-between rounded-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.98))", border: "1px solid var(--border)" }}>
              {/* Ornamental geometry */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-[100px] opacity-10 pointer-events-none rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white blur-[80px] opacity-5 pointer-events-none rounded-full" />
              
              <div className="relative z-10 space-y-4">
                <p className="inline-block text-[10px] tracking-[0.2em] text-white uppercase font-semibold border border-white/30 px-3 py-1.5 rounded-full bg-white/10">
                  Custom Requirement?
                </p>
                <h3 className="font-display text-[1.75rem] md:text-3xl font-semibold leading-tight text-white mb-2">
                  Tell us what you need to build
                </h3>
                <p className="text-sm md:text-[0.95rem] text-white/60 leading-relaxed max-w-[90%]">
                  Our engineers assess your specific industrial or research requirements and propose the most reliable, cost-effective solution.
                </p>
              </div>
              <div className="relative z-10 mt-10 md:mt-16">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] bg-white text-slate-900"
                >
                  Contact Engineers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CLIENT TRUST SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative px-6 sm:px-10 py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-blob w-[700px] h-[700px] bg-[var(--gold)] opacity-[0.025] bottom-[-20%] right-[-15%]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Left: text */}
            <div>
              <span className="gold-line" />
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
                Trusted Across<br />Bangladesh's<br />
                <em className="shimmer-gold not-italic">Leading Institutions</em>
              </h2>
              <p className="mt-6 text-[var(--text-dim)] leading-7 max-w-lg">
                From flagship public universities to industrial manufacturing plants and government organizations — Technical Aid has delivered engineering solutions that work in the real world.
              </p>

              {/* Type breakdown */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(clientTypeGroups).filter(([, v]) => v > 0).map(([type, count]) => (
                  <div key={type} className="grad-border p-4">
                    <p className="text-xl font-display font-semibold text-[var(--gold)]">{count}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{type}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/clients"
                className="mt-8 inline-flex items-center gap-2 hover-line text-sm text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
              >
                See all clients →
              </Link>
            </div>

            {/* Right: testimonials */}
            <div className="space-y-4">
              {testimonials.length > 0 ? (
                testimonials.map((t, i) => (
                  <div
                    key={t.id}
                    className="grad-border p-6"
                    style={{ transform: `translateX(${i % 2 === 1 ? "1.5rem" : "0"})` }}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: Math.min(5, t.rating || 5) }).map((_, j) => (
                        <span key={j} className="text-[var(--gold)] text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-[var(--text-dim)] text-sm leading-7 italic font-display">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm font-semibold text-[var(--text)]">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {[t.role, t.company].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                /* Placeholder if no testimonials yet */
                <div className="grad-border p-8 text-center">
                  <p className="text-[var(--text-muted)] text-sm">Client testimonials coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY TECHNICAL AID
      ══════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-10 py-28" style={{ background: "var(--surface-2)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="gold-line mx-auto" style={{ display: "block", margin: "0 auto 1rem" }} />
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
              Why Engineers and<br />Institutions Choose Us
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Engineering-First",
                body: "Every solution is evaluated by engineers who understand the application, not just the product catalogue.",
              },
              {
                num: "02",
                title: "Global + Local",
                body: "International sourcing capability combined with local manufacturing means better quality at competitive prices.",
              },
              {
                num: "03",
                title: "Full Lifecycle",
                body: "From consultancy and design to installation, commissioning, training, and ongoing maintenance.",
              },
              {
                num: "04",
                title: "Trusted Track Record",
                body: "Over 200 clients and 500 projects delivered across education, industry, and the power sector since 2018.",
              },
            ].map((item) => (
              <div key={item.num} className="card-lift grad-border p-7">
                <p className="font-mono text-[var(--gold)] text-xs opacity-60 mb-4">{item.num}</p>
                <h3 className="font-semibold text-[var(--text)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-dim)] leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST BLOGS
      ══════════════════════════════════════════════════ */}
      {blogsList.length > 0 && (
        <section className="px-6 sm:px-10 py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <span className="gold-line" />
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
                  Latest Updates
                </h2>
                <p className="mt-4 max-w-xl text-[var(--text-dim)]">
                  Recent activities, project highlights, and technical insights from Technical Aid.
                </p>
              </div>
              <Link
                href="/blogs"
                className="hover-line self-start md:self-auto text-sm text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
              >
                View all blogs →
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogsList.slice(0, 3).map((b: any) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="card-lift group grad-border overflow-hidden flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--surface-2)" }}>
                    {b.image_url ? (
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
                      <p className="mt-3 text-sm text-[var(--text-dim)] line-clamp-2 leading-relaxed flex-1">{b.summary}</p>
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
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative px-6 sm:px-10 py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-blob w-[800px] h-[600px] bg-[var(--gold)] opacity-[0.045] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "64px 64px"
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="gold-line mx-auto" style={{ display: "block", margin: "0 auto 1.5rem" }} />
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight">
            Ready to Build<br />
            <em className="shimmer-gold not-italic">Something Exceptional?</em>
          </h2>
          <p className="mt-6 text-lg text-[var(--text-dim)] max-w-2xl mx-auto leading-8">
            Whether you need a single piece of lab equipment or a complete industrial power system — our team is ready to scope, source, and deliver.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 rounded-2xl px-8 py-5 text-base font-semibold tracking-wide overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              <span className="relative z-10">Start a Conversation</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
                style={{ background: "var(--gold-light)" }} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border px-8 py-5 text-base font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}
            >
              About Technical Aid
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
