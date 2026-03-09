import Link from "next/link";
import ServiceSection from "@/components/services/ServiceSection";
import ServicesIndex from "@/components/services/ServicesIndex";

const services = [
  {
    id: "global-sourcing",
    number: "01",
    title: "Global Sourcing",
    intro: "Reliable, cost-effective, and timely access to high-quality machinery, equipment, and engineering solutions from international markets.",
    bullets: [
      "Industrial & engineering machinery",
      "Laboratory & research equipment",
      "Electrical, mechanical & automation components",
      "Spare parts and replacement items",
      "Customized and application-specific equipment",
      "Supplier identification & technical evaluation",
      "Negotiation, QA, import coordination & local delivery",
    ],
  },
  {
    id: "supply-installation",
    number: "02",
    title: "Supply & Installation",
    intro: "Complete supply, installation, testing, and commissioning for electrical and power systems across Bangladesh.",
    bullets: [
      "Battery charger systems (industrial/substation)",
      "Electrical sub-station equipment",
      "LT/HT panels, PDB, control & protection panels",
      "Transformer installation and associated equipment",
      "MCC, ATS, generator synchronization",
      "Cable laying, termination, earthing & safety compliance",
      "Design, drawings, load calculation, maintenance support",
    ],
  },
  {
    id: "repairing-servicing",
    number: "03",
    title: "Repairing & Servicing",
    intro: "Comprehensive repairs, servicing, and preventive maintenance for industrial systems and engineering laboratory instruments.",
    bullets: [
      "Engineering lab equipment (mechanical/electrical/civil/research)",
      "Industrial automation systems",
      "LT/HT panels, PDB, battery charger systems",
      "Substation equipment & protection systems",
      "MCC, transformers, switchgear, motors & drives",
      "Calibration, inspection, thermal checking & performance verification",
      "Fast response to minimize downtime",
    ],
  },
  {
    id: "training",
    number: "04",
    title: "Training",
    intro: "Industry-oriented training programs with hands-on kits to bridge academic learning and real-world applications.",
    bullets: [
      "Industrial automation (PLC, VFD, HMI, SCADA, BMS)",
      "Control panel design & instrumentation integration",
      "Power systems (substation ops, relays, panels, drawings)",
      "Embedded systems (Arduino, ESP32, STM32, Raspberry Pi)",
      "IoT system development and data monitoring",
      "Mechanical skills (maintenance, hydraulics, pneumatics)",
      "Customized programs for universities and industries",
    ],
  },
  {
    id: "design-implementation",
    number: "05",
    title: "Design & Implementation",
    intro: "End-to-end engineering design and execution—electrical, electronics/PCB, mechanical CAD/CAM, and automation integration.",
    bullets: [
      "Electrical design (SLD, load calc, panel layout, cable sizing)",
      "Earthing & lightning protection design",
      "Electronics/PCB: schematic, layout, prototypes, debugging",
      "Mechanical CAD/CAM, simulation, layouts, plant planning",
      "Manufacturing support: CNC, laser cutting, 3D printing",
      "Automation: PLC control, SCADA, IoT monitoring solutions",
      "Commissioning and production-ready delivery",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div
          className="glow-blob"
          style={{ width: 600, height: 600, top: "-25%", left: "-15%", background: "var(--gold-glow)", opacity: 0.4 }}
        />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <div style={{ width: 36, height: 2, background: "var(--gold)" }} />
            <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: "var(--gold)" }}>Services</span>
          </div>
          <h1
            className="font-display leading-[1.06] tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
          >
            Engineering solutions<br />
            <em className="not-italic shimmer-gold">built for performance.</em>
          </h1>
          <p className="mt-6 text-lg font-light max-w-2xl leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Five core service lines — designed to reduce risk, improve reliability, and deliver measurable value across education and industry.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all hover:scale-[1.04]"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}
            >
              Discuss a Project →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text)" }}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── STICKY INDEX ────────────────────────────────── */}
      <ServicesIndex items={services.map(({ id, title }) => ({ id, title }))} />

      {/* ── SERVICE SECTIONS ────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-8">
        {services.map((s) => (
          <ServiceSection key={s.id} {...s} />
        ))}
      </div>

      {/* ── CLOSING CTA ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div
          className="grad-border p-10 md:p-14 text-center"
        >
          <div className="gold-line mx-auto" />
          <h2 className="font-display text-2xl md:text-4xl mb-4 tracking-tight">Need a custom solution?</h2>
          <p className="text-lg font-light max-w-xl mx-auto mb-8" style={{ color: "var(--text-dim)" }}>
            Tell us what you're building — our team will recommend the most reliable and cost-effective approach.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:scale-[1.04]"
            style={{ background: "var(--gold)", color: "var(--on-gold)" }}
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </main>
  );
}
