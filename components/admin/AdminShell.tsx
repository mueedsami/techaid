"use client";

import Link from "next/link";
import { ReactNode } from "react";

type AdminTab =
  | "inquiries"
  | "clients"
  | "testimonials"
  | "product-categories"
  | "products";

export default function AdminShell({
  title,
  subtitle = "Admin",
  activeTab,
  children,
}: {
  title: string;
  subtitle?: string;
  activeTab: AdminTab;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div
          className="mb-6 rounded-3xl border p-6"
          style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <NavBtn href="/admin/inquiries" label="Inquiries" active={activeTab === "inquiries"} />
              <NavBtn href="/admin/clients" label="Clients" active={activeTab === "clients"} />
              <NavBtn href="/admin/testimonials" label="Testimonials" active={activeTab === "testimonials"} />
              <NavBtn
                href="/admin/product-categories"
                label="Product Categories"
                active={activeTab === "product-categories"}
              />
              <NavBtn href="/admin/products" label="Products" active={activeTab === "products"} />

              <button
                onClick={async () => {
                  await fetch("/api/admin/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "logout" }),
                  });
                  window.location.href = "/admin/login";
                }}
                className="rounded-xl border px-3 py-2 text-sm transition-colors"
                style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}

function NavBtn({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border px-3 py-2 text-sm transition-colors"
      style={
        active
          ? {
              borderColor: "var(--gold-border)",
              background: "var(--gold-glow)",
              color: "var(--gold)",
            }
          : {
              borderColor: "var(--border)",
              background: "var(--surface-2)",
              color: "var(--text-dim)",
            }
      }
    >
      {label}
    </Link>
  );
}
