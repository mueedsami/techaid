"use client";

import Image from "next/image";
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
  { label: "Student Projects",        hash: "student-projects" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const [servicesOpen, setServicesOpen]     = useState(false);
  const [productsOpen, setProductsOpen]     = useState(false);
  const [servicesPinned, setServicesPinned] = useState(false);
  const [productsPinned, setProductsPinned] = useState(false);
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
      if (servicesRef.current && !servicesRef.current.contains(t)) {
        setServicesOpen(false);
        setServicesPinned(false);
      }
      if (productsRef.current && !productsRef.current.contains(t)) {
        setProductsOpen(false);
        setProductsPinned(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  // Close on route change
  useEffect(() => {
    setServicesOpen(false);
    setProductsOpen(false);
    setServicesPinned(false);
    setProductsPinned(false);
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
    <>
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
        <Link href="/" className="group flex items-center gap-3.5">
          <Image
            src="/Logo-size.jpg"
            alt="Technical Aid logo"
            width={120}
            height={120}
            quality={100}
            unoptimized
            className="h-[56px] w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
            priority
          />
          <div className="leading-none">
            <span className="font-display block text-[1.02rem] font-semibold tracking-[0.03em]" style={{ color: "var(--text)" }}>
              Technical Aid
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
              Engineering Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" style={navLinkStyle("/")}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = isActive("/") ? "var(--text)" : "var(--text-dim)")}>
            Home
          </Link>

          {/* Services dropdown */}
          <div className="relative" ref={servicesRef} onMouseLeave={() => { if (!servicesPinned) setServicesOpen(false); }}>
            <button
              onClick={() => {
                const nextPinned = !servicesPinned;
                setServicesPinned(nextPinned);
                setServicesOpen(nextPinned);
                setProductsOpen(false);
                setProductsPinned(false);
              }}
              onMouseEnter={() => setServicesOpen(true)}
              className="flex items-center gap-1 transition-colors"
              style={{ ...navLinkStyle("/services"), background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseOut={e => (e.currentTarget.style.color = isActive("/services") ? "var(--text)" : "var(--text-dim)")}
            >
              Services
              <span style={{ fontSize: "0.5rem", opacity: 0.5, transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 mt-4 w-60 rounded-2xl overflow-hidden transition-all"
                style={{ backgroundColor: "#ffffff", zIndex: 99999, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.25), 0 0 30px rgba(0,0,0,0.05)" }}>
                <div className="p-2">
                  {SERVICES.map((s) => (
                    <Link key={s.hash} href={`/services#${s.hash}`}
                      className="block rounded-xl px-4 py-3 text-[0.85rem] font-medium transition-all"
                      style={{ color: "var(--text)" }}
                      onMouseOver={e => { e.currentTarget.style.background = "var(--surface-2)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products mega dropdown */}
          <div className="relative" ref={productsRef} onMouseLeave={() => { if (!productsPinned) setProductsOpen(false); }}>
            <button
              onClick={() => {
                const nextPinned = !productsPinned;
                setProductsPinned(nextPinned);
                setProductsOpen(nextPinned);
                setServicesOpen(false);
                setServicesPinned(false);
              }}
              onMouseEnter={() => setProductsOpen(true)}
              className="flex items-center gap-1 transition-colors"
              style={{ ...navLinkStyle("/products"), background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseOut={e => (e.currentTarget.style.color = isActive("/products") ? "var(--text)" : "var(--text-dim)")}
            >
              Products
              <span style={{ fontSize: "0.5rem", opacity: 0.5, transition: "transform 0.2s", transform: productsOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {productsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-max min-w-[650px] max-w-[800px] rounded-2xl transition-all"
                 style={{ backgroundColor: "#ffffff", zIndex: 99999, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.25), 0 0 30px rgba(0,0,0,0.05)" }}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex flex-col">
                      <span className="text-[1.15rem] font-display font-semibold" style={{ color: "var(--text)" }}>Our Products</span>
                      <span className="text-[0.85rem] mt-1" style={{ color: "var(--text-muted)" }}>Browse our comprehensive range of engineering solutions</span>
                    </div>
                    <Link href="/products"
                      onClick={() => { setProductsOpen(false); setProductsPinned(false); }}
                      className="rounded-full px-5 py-2 text-xs font-semibold transition-all shadow-sm"
                      style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                      onMouseOver={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}>
                      View All Products
                    </Link>
                  </div>
                  
                  {catsLoading ? (
                    <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading categories...</p>
                  ) : productCats.length === 0 ? (
                    <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No categories available.</p>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                      {productCats.map((cat) => (
                        <div key={cat.id} className="flex flex-col">
                          <Link href={`/products?category=${cat.slug}`}
                            onClick={() => { setProductsOpen(false); setProductsPinned(false); }}
                            className="text-sm font-semibold mb-3 transition-colors hover:opacity-70"
                            style={{ color: "var(--text)" }}>
                            {cat.name}
                          </Link>
                          {cat.children && cat.children.length > 0 && (
                            <div className="flex flex-col gap-2.5 border-l-2 pl-3.5 ml-1" style={{ borderColor: "var(--border)" }}>
                              {cat.children.map((sub) => (
                                <Link key={sub.id} href={`/products?category=${sub.slug}`}
                                  onClick={() => { setProductsOpen(false); setProductsPinned(false); }}
                                  className="text-[13px] transition-colors"
                                  style={{ color: "var(--text-dim)" }}
                                  onMouseOver={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.fontWeight = "600"; }}
                                  onMouseOut={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.fontWeight = "inherit"; }}>
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
          <Link href="/blogs" style={navLinkStyle("/blogs")}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = isActive("/blogs") ? "var(--text)" : "var(--text-dim)")}>
            Blogs
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
          style={{ borderColor: "var(--border)", color: "var(--text)", background: "transparent", opacity: 1 }}
          aria-label="Toggle menu">
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", opacity: 1 }}>
            {mobileOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

    </header>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-[64px] left-0 right-0 overflow-y-auto max-h-[80vh] shadow-2xl"
          style={{ background: "#ffffff", borderBottom: "1px solid var(--border)", zIndex: 9999 }}>
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
            <MobileLink href="/blogs"   label="Blogs"       close={() => setMobileOpen(false)} active={isActive("/blogs")} />
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
    </>
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