import { ReactNode } from "react";

export default function AdminSectionCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="mb-4 rounded-3xl border p-4 md:p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
    >
      {title && (
        <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
