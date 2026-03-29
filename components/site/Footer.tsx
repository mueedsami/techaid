import Link from "next/link";

const nav = [
  { label: "Home",       href: "/" },
  { label: "Services",   href: "/services" },
  { label: "Products",   href: "/products" },
  { label: "About Us",   href: "/about" },
  { label: "Our Clients",href: "/clients" },
  { label: "Contact",    href: "/contact" },
];

const services = [
  { label: "Global Sourcing",        href: "/services#global-sourcing" },
  { label: "Supply & Installation",  href: "/services#supply-installation" },
  { label: "Repairing & Servicing",  href: "/services#repairing-servicing" },
  { label: "Training",               href: "/services#training" },
  { label: "Design & Implementation",href: "/services#design-implementation" },
  { label: "Student Projects",       href: "/services#student-projects" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
      {/* top strip */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl" style={{ color: "var(--text)" }}>Technical Aid</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Engineering Solutions · Est. 2018 · Dhaka, Bangladesh</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:scale-[1.03]"
            style={{ background: "var(--gold)", color: "var(--on-gold)" }}
          >
            Start a Project →
          </Link>
        </div>
      </div>

      {/* main grid */}
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="mb-5 inline-block transition-transform hover:-translate-y-0.5">
            <img
              src="/Logo-size.jpg"
              alt="Technical Aid logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Technical Aid is Bangladesh's trusted partner for engineering equipment, industrial automation, and technical education.
          </p>
          <div className="mt-6 space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
            <p>📞 <a href="tel:01518357567" className="hover-line hover:text-[var(--gold)] transition-colors">01518357567</a></p>
            <p>✉ <a href="mailto:info@technicalaidbd.com" className="hover-line hover:text-[var(--gold)] transition-colors">info@technicalaidbd.com</a></p>
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>House 64, Road 6, Block A, Section 12<br />Mirpur 1216, Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* pages */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-5 font-medium" style={{ color: "var(--gold)" }}>Pages</p>
          <ul className="space-y-3">
            {nav.map(n => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm hover-line transition-colors text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* services */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-5 font-medium" style={{ color: "var(--gold)" }}>Services</p>
          <ul className="space-y-3">
            {services.map(s => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-sm hover-line transition-colors text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* hours */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-5 font-medium" style={{ color: "var(--gold)" }}>Office Hours</p>
          <div className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
            <div className="flex justify-between gap-4">
              <span>Saturday – Thursday</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: "var(--text)" }}>9:00 AM – 6:00 PM</span>
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>Friday: Closed</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Emergency support available on request</p>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Technical Aid. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Dhaka, Bangladesh · Engineering Solutions Since 2018
          </p>
        </div>
      </div>
    </footer>
  );
}
