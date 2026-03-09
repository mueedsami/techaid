"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getProductCategoryTree, PublicProductCategoryTreeItem } from "@/lib/api";

const SERVICES = [
  { label: "Global Sourcing",         hash: "global-sourcing" },
  { label: "Supply & Installation",   hash: "supply-installation" },
  { label: "Repairing & Servicing",   hash: "repairing-servicing" },
  { label: "Training",                hash: "training" },
  { label: "Design & Implementation", hash: "design-implementation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const [servicesOpen, setServicesOpen]     = useState(false);
  const [productsOpen, setProductsOpen]     = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobServices, setMobServices]       = useState(false);
  const [mobProducts, setMobProducts]       = useState(false);
  const [productCats, setProductCats]       = useState<PublicProductCategoryTreeItem[]>([]);
  const [catsLoading, setCatsLoading]       = useState(false);
  const [activeCat, setActiveCat]           = useState<number | null>(null);

  const servicesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Load product category tree
  useEffect(() => {
    let mounted = true;
    setCatsLoading(true);
    getProductCategoryTree()
      .then((items) => {
        if (!mounted) return;
        setProductCats(items || []);
        if (items?.length) setActiveCat(items[0].id);
      })
      .catch(() => mounted && setProductCats([]))
      .finally(() => mounted && setCatsLoading(false));
    return () => { mounted = false; };
  }, []);

    // Subtle elevation on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

// Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(t)) setServicesOpen(false);
      if (productsRef.current && !productsRef.current.contains(t)) setProductsOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  // Close on route change
  useEffect(() => {
    setServicesOpen(false);
    setProductsOpen(false);
    setMobileOpen(false);
    setMobServices(false);
    setMobProducts(false);
  }, [pathname]);

  const activeParent = productCats.find((p) => p.id === activeCat) || productCats[0] || null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinkStyle = (href: string): React.CSSProperties => ({
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: isActive(href) ? "var(--text)" : "var(--text-dim)",
    transition: "color 0.2s",
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 64,
        background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.76)",
        boxShadow: scrolled ? "var(--nav-shadow)" : "none",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div style={{ width: 24, height: 24, border: "1px solid var(--gold)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--gold)", fontFamily: "serif" }}>TA</span>
          </div>
          <span className="font-display text-base font-medium tracking-wide" style={{ color: "var(--text)" }}>
            Technical Aid
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" style={navLinkStyle("/")}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = isActive("/") ? "var(--text)" : "var(--text-dim)")}>
            Home
          </Link>

          {/* Services dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => { setServicesOpen(v => !v); setProductsOpen(false); }}
              className="flex items-center gap-1 transition-colors"
              style={{ ...navLinkStyle("/services"), background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseOut={e => (e.currentTarget.style.color = isActive("/services") ? "var(--text)" : "var(--text-dim)")}
            >
              Services
              <span style={{ fontSize: "0.5rem", opacity: 0.5, transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 mt-3 w-60 rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                <div className="p-1.5">
                  {SERVICES.map((s) => (
                    <Link key={s.hash} href={`/services#${s.hash}`}
                      className="block rounded-xl px-3 py-2.5 text-xs transition-all"
                      style={{ color: "var(--text-dim)" }}
                      onMouseOver={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-dim)"; }}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products mega dropdown */}
          <div className="relative" ref={productsRef} onMouseLeave={() => setProductsOpen(false)}>
            <button
              onClick={() => { setProductsOpen(v => !v); setServicesOpen(false); }}
              onMouseEnter={() => setProductsOpen(true)}
              className="flex items-center gap-1 transition-colors"
              style={{ ...navLinkStyle("/products"), background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseOut={e => (e.currentTarget.style.color = isActive("/products") ? "var(--text)" : "var(--text-dim)")}
            >
              Products
              <span style={{ fontSize: "0.5rem", opacity: 0.5 }}>▾</span>
            </button>
            {productsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[680px] rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                <div className="grid grid-cols-[220px_1fr]">
                  <div className="p-2" style={{ borderRight: "1px solid var(--border)", background: "var(--surface-2)" }}>
                    <Link href="/products"
                      className="mb-2 block rounded-xl border px-3 py-2 text-xs font-medium"
                      style={{ borderColor: "var(--border)", color: "var(--text)", background: "var(--surface-3)" }}>
                      View All Products
                    </Link>
                    {catsLoading ? (
                      <p className="px-3 py-2 text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
                    ) : productCats.length === 0 ? (
                      <p className="px-3 py-2 text-xs" style={{ color: "var(--text-muted)" }}>No categories</p>
                    ) : (
                      productCats.map((cat) => (
                        <button key={cat.id} type="button"
                          onMouseEnter={() => setActiveCat(cat.id)}
                          onClick={() => setActiveCat(cat.id)}
                          className="mb-0.5 block w-full rounded-xl px-3 py-2 text-left text-xs transition-all"
                          style={{
                            background: activeCat === cat.id ? "var(--surface-3)" : "transparent",
                            color: activeCat === cat.id ? "var(--text)" : "var(--text-dim)",
                            borderLeft: activeCat === cat.id ? "2px solid var(--gold)" : "2px solid transparent",
                          }}>
                          {cat.name}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="p-4">
                    {!activeParent ? (
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>No categories found.</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold">{activeParent.name}</h3>
                          <Link href={`/products?category=${activeParent.slug}`}
                            className="text-[10px] hover-line" style={{ color: "var(--gold)" }}>
                            View all →
                          </Link>
                        </div>
                        {activeParent.children?.length ? (
                          <div className="grid grid-cols-2 gap-2">
                            {activeParent.children.map((sub) => (
                              <Link key={sub.id} href={`/products?category=${sub.slug}`}
                                className="rounded-xl border px-3 py-2 text-xs transition-all"
                                style={{ borderColor: "var(--border)", color: "var(--text-dim)", background: "var(--surface-2)" }}
                                onMouseOver={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--gold-border)"; }}
                                onMouseOut={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border p-3 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                            No subcategories yet.
                            <Link href={`/products?category=${activeParent.slug}`}
                              className="block mt-2 hover-line" style={{ color: "var(--text-dim)" }}>
                              Browse {activeParent.name} →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/about" style={navLinkStyle("/about")}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = isActive("/about") ? "var(--text)" : "var(--text-dim)")}>
            About Us
          </Link>
          <Link href="/clients" style={navLinkStyle("/clients")}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = isActive("/clients") ? "var(--text)" : "var(--text-dim)")}>
            Clients
          </Link>
        </nav>

        {/* Desktop CTA */}
        <Link href="/contact"
          className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all hover:scale-[1.04]"
          style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
          Get in Touch
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden rounded-xl border px-3 py-1.5 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--text)", background: "transparent" }}
          aria-label="Toggle menu">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[64px] left-0 right-0 overflow-y-auto max-h-[80vh] shadow-2xl"
          style={{ background: "rgba(255,255,255,0.92)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(14px)" }}>
          <div className="px-4 py-3 space-y-1">
            <MobileLink href="/" label="Home" close={() => setMobileOpen(false)} active={isActive("/")} />

            {/* Mobile Services */}
            <button onClick={() => setMobServices(v => !v)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: "var(--text-dim)", background: "transparent", border: "none", cursor: "pointer" }}>
              <span>Services</span>
              <span style={{ fontSize: "0.5rem", opacity: 0.5 }}>{mobServices ? "▴" : "▾"}</span>
            </button>
            {mobServices && (
              <div className="ml-3 rounded-xl border p-2 space-y-1" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                {SERVICES.map(s => (
                  <Link key={s.hash} href={`/services#${s.hash}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs"
                    style={{ color: "var(--text-dim)" }}>
                    {s.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Products */}
            <button onClick={() => setMobProducts(v => !v)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: "var(--text-dim)", background: "transparent", border: "none", cursor: "pointer" }}>
              <span>Products</span>
              <span style={{ fontSize: "0.5rem", opacity: 0.5 }}>{mobProducts ? "▴" : "▾"}</span>
            </button>
            {mobProducts && (
              <div className="ml-3 rounded-xl border p-2" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                <Link href="/products" onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border px-3 py-2 text-xs font-medium mb-2"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                  View All Products
                </Link>
                {catsLoading ? (
                  <p className="px-3 py-1 text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
                ) : (
                  productCats.map(cat => (
                    <div key={cat.id} className="mb-2">
                      <Link href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 text-xs font-medium"
                        style={{ color: "var(--text)" }}>
                        {cat.name}
                      </Link>
                      {cat.children?.map(sub => (
                        <Link key={sub.id} href={`/products?category=${sub.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-5 py-1 text-xs"
                          style={{ color: "var(--text-muted)" }}>
                          └ {sub.name}
                        </Link>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}

            <MobileLink href="/about"   label="About Us"    close={() => setMobileOpen(false)} active={isActive("/about")} />
            <MobileLink href="/clients" label="Our Clients" close={() => setMobileOpen(false)} active={isActive("/clients")} />
            <MobileLink href="/contact" label="Contact Us"  close={() => setMobileOpen(false)} active={isActive("/contact")} />

            <div className="pt-2 pb-1">
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="block text-center rounded-full py-3 text-sm font-semibold"
                style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
                Get in Touch →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, label, close, active }: { href: string; label: string; close: () => void; active: boolean }) {
  return (
    <Link href={href} onClick={close}
      className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
      style={{ color: active ? "var(--text)" : "var(--text-dim)", background: active ? "var(--surface-2)" : "transparent" }}>
      {label}
    </Link>
  );
}
