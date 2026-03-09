import Link from "next/link";

const coreAreas = [
  "Industrial Automation Solutions",
  "Electrical Drawing, Design & Installation",
  "Mechanical Fabrication and Service Works",
  "Power Industry Support Services",
  "Supply, Installation, and Servicing of Electrical Substations",
  "Electrical Panel Boards and Battery Charger Systems",
  "Maintenance and Servicing of Power Distribution Boards",
];

const values = [
  {
    title: "Technical Accuracy",
    text: "We deliver solutions grounded in engineering standards, practical application needs, and long-term reliability.",
  },
  {
    title: "Dependable Service",
    text: "From consultation to commissioning and after-sales support, we stay accountable throughout the project lifecycle.",
  },
  {
    title: "Cost-Effective Execution",
    text: "Through local manufacturing and global sourcing, we optimize quality and pricing for maximum client value.",
  },
  {
    title: "Customer-Centered Approach",
    text: "We focus on understanding the real requirement first, then delivering the most suitable solution—not just a product.",
  },
];

const timeline = [
  { year: "2018", event: "Founded in Dhaka by a group of professional engineers" },
  { year: "2019", event: "First major university laboratory equipment contracts" },
  { year: "2021", event: "Expanded into industrial power and substation solutions" },
  { year: "2023", event: "Launched hands-on automation and PLC training programs" },
  { year: "2024", event: "Serving 200+ clients across education and industry sectors" },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative px-6 sm:px-10 pt-20 pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] top-[-15%] right-[-10%]" />
          <div className="absolute top-[30%] left-[6%] w-px h-[40vh] opacity-15"
            style={{ background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="gold-line !mb-0 !w-12" />
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">About Us</span>
          </div>

          <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-tight max-w-5xl">
            Engineering Solutions Built<br />
            <em className="shimmer-gold not-italic">with Trust, Precision,</em><br />
            and Purpose.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-dim)]">
            Technical Aid is a Bangladesh-based engineering solutions provider, established in 2018 by a group of professional engineers with strong academic and industrial experience.
          </p>

          {/* Key metrics */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { value: "2018", label: "Established" },
              { value: "Dhaka", label: "Based In" },
              { value: "Edu + Industry", label: "Focus" },
            ].map((m) => (
              <div key={m.label} className="grad-border p-5">
                <p className="font-display text-xl font-semibold text-[var(--gold)]">{m.value}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)] tracking-wide uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section className="px-6 sm:px-10 py-24" style={{ background: "var(--surface-2)" }}>
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7 grad-border p-8 md:p-10">
            <span className="gold-line" />
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6">Who We Are</h2>
            <div className="space-y-5 text-[var(--text-dim)] leading-7">
              <p>
                Since our inception in Dhaka, we have been committed to strengthening Bangladesh's light engineering and technical education sectors through quality products, technical expertise, and dependable service.
              </p>
              <p>
                We specialize in the design, manufacturing, supply, and servicing of Engineering Laboratory and Training Equipment for Mechanical, Electrical, Civil, and related disciplines. Our laboratory apparatus are developed to meet the practical needs of universities, polytechnic institutes, and research organizations across Bangladesh.
              </p>
              <p>
                By combining local manufacturing capabilities with global sourcing, we ensure high-quality equipment at the most reasonable and competitive prices in the market.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 grad-border p-8 flex flex-col justify-center">
            <span className="gold-line" />
            <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">What Makes Us Different</h2>
            <ul className="space-y-3">
              {[
                "Engineering-first approach to every solution",
                "Local manufacturing + global sourcing advantage",
                "Strong support for both education and industry",
                "Consultancy, installation, and after-sales support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-dim)]">
                  <span className="mt-0.5 text-[var(--gold)] shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="px-6 sm:px-10 py-24">
        <div className="mx-auto max-w-7xl">
          <span className="gold-line" />
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-16">Our Journey</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[2.5rem] top-0 bottom-0 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))" }} />

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex gap-6 md:gap-12 items-start">
                  {/* Year node */}
                  <div className="relative z-10 flex-shrink-0 w-20 h-10 rounded-xl flex items-center justify-center border text-xs font-mono font-semibold"
                    style={{
                      background: i === timeline.length - 1 ? "var(--gold)" : "var(--surface-2)",
                      borderColor: i === timeline.length - 1 ? "var(--gold)" : "var(--border-2)",
                      color: i === timeline.length - 1 ? "var(--ink)" : "var(--gold)",
                    }}>
                    {item.year}
                  </div>
                  <div className="grad-border flex-1 px-5 py-4">
                    <p className="text-sm text-[var(--text-dim)]">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE SERVICE AREAS ─── */}
      <section className="px-6 sm:px-10 py-24" style={{ background: "var(--surface-2)" }}>
        <div className="mx-auto max-w-7xl">
          <span className="gold-line" />
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">Core Service Areas</h2>
          <p className="text-[var(--text-dim)] max-w-2xl mb-10">
            Beyond educational equipment, Technical Aid actively supports the industrial sector with a broad range of engineering and power-related services.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {coreAreas.map((item, i) => (
              <div key={item} className="card-lift grad-border flex items-center gap-4 px-5 py-4">
                <span className="font-mono text-[var(--gold)] text-xs opacity-60 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-[var(--text-dim)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW WE WORK + VALUES ─── */}
      <section className="px-6 sm:px-10 py-24">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2">
          <div className="grad-border p-8 md:p-10">
            <span className="gold-line" />
            <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">How We Work</h2>
            <div className="space-y-4 text-[var(--text-dim)] text-sm leading-7">
              <p>
                We work closely with government organizations, autonomous bodies, private industries, universities, and technical institutes. Our team provides complete technical consultancy—from product selection and system design to installation, demonstration, and after-sales support.
              </p>
              <p>
                We believe the right solution is not just about supplying equipment. It is about understanding the application requirement and delivering an optimized, reliable, and cost-effective result.
              </p>
            </div>
          </div>

          <div className="grad-border p-8 md:p-10">
            <span className="gold-line" />
            <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">Our Values</h2>
            <div className="space-y-3">
              {values.map((v) => (
                <div key={v.title} className="card-lift" style={{ background: "var(--surface-2)", borderRadius: "1rem", padding: "1rem" }}>
                  <h3 className="text-sm font-semibold text-[var(--gold)]">{v.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-dim)] leading-6">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative px-6 sm:px-10 py-24 overflow-hidden" style={{ background: "var(--surface-2)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-blob w-[700px] h-[400px] bg-[var(--gold)] opacity-[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="gold-line mx-auto block mb-6 mx-auto" style={{ margin: "0 auto 1.5rem" }} />
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight">
            Technical Aid — Empowering Engineering<br />
            <em className="shimmer-gold not-italic">Education and Industry</em>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-[var(--text-dim)] leading-7">
            Our goal is to become a trusted long-term partner in engineering education and industrial development in Bangladesh through innovative solutions, dependable service, and continuous technical support.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-semibold overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              <span className="relative z-10">Explore Services</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
                style={{ background: "var(--gold-light)" }} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border px-7 py-4 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
