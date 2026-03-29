"use client";

import { FormEvent, useMemo, useState } from "react";
import { submitContactForm } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initialForm: FormState = { name: "", email: "", company: "", phone: "", service: "", message: "" };

const serviceOptions = [
  "Global Sourcing",
  "Supply & Installation",
  "Repairing & Servicing",
  "Training",
  "Design & Implementation",
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const mapUrl = useMemo(() => {
    const query = encodeURIComponent("House No 64, Road 6, Block A, Section 12, Mirpur 1216, Dhaka, Bangladesh");
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, []);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors((prev) => ({ ...prev, [key]: [] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    setFieldErrors({});
    try {
      const res = await submitContactForm(form);
      if (res.ok) {
        setSuccessMsg(res.message || "Your message has been sent successfully.");
        setForm(initialForm);
      } else {
        setErrorMsg("Failed to submit form. Please try again.");
      }
    } catch (err: any) {
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
        setErrorMsg("Please fix the highlighted fields.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: keyof FormState) => fieldErrors[name]?.[0];

  return (
    <main className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative px-6 sm:px-10 pt-20 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob w-[700px] h-[500px] bg-[var(--gold)] opacity-[0.04] top-0 left-1/2 -translate-x-1/2" />
          <div className="absolute top-[40%] left-[5%] w-px h-[30vh] opacity-15"
            style={{ background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }} />
          <div className="absolute bottom-[20%] right-[8%] w-24 h-24 rounded-full border opacity-20 anim-float"
            style={{ borderColor: "var(--gold-border)" }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="gold-line !mb-0 !w-12" />
            <span className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase font-medium">Contact Us</span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl">
            Let&rsquo;s Build Your Next<br />
            <em className="shimmer-gold not-italic">Engineering Solution</em><br />
            with Confidence.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-dim)]">
            Whether you need sourcing, installation, servicing, training, or a complete technical implementation — our team is ready to support you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:01518357567"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold overflow-hidden"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
              <span className="relative z-10">Call Now</span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: "var(--gold-light)" }} />
            </a>
            <a href="mailto:info@technicalaidbd.com"
              className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-2)", color: "var(--text-dim)" }}>
              Email Us
            </a>
            <a href="https://wa.me/8801518357567" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:scale-[1.03]"
              style={{ borderColor: "#25D366", color: "#25D366", background: "rgba(37, 211, 102, 0.05)" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12.031 0C5.385 0 0 5.388 0 12.037c0 2.126.55 4.195 1.597 6.01L.062 23.633l5.725-1.503a11.966 11.966 0 0 0 6.244 1.745h.005C18.665 23.875 24 18.514 24 11.85 24 8.63 22.75 5.586 20.472 3.322 18.204 1.056 15.163 0 12.031 0zm-.005 21.87h-.002a9.962 9.962 0 0 1-5.074-1.39l-.364-.216-3.771.99.999-3.68-.237-.377A9.974 9.974 0 0 1 2.052 11.85c0-5.503 4.476-9.981 9.978-9.981 2.668 0 5.174 1.038 7.059 2.924 1.884 1.886 2.923 4.39 2.923 7.058 0 5.503-4.476 9.98-9.978 9.98l-.008.039zm5.474-7.48c-.3-.15-1.776-.879-2.053-.979s-.477-.15-.677.15c-.2.301-.776.979-.952 1.18s-.353.225-.653.075c-.3-.15-1.268-.468-2.417-1.488-.895-.794-1.5-1.774-1.676-2.074-.176-.301-.019-.463.131-.613.135-.135.3-.351.451-.526.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.927-2.231-.243-.585-.49-.505-.677-.514-.176-.009-.377-.01-.577-.01s-.526.075-.802.376c-.276.301-1.053 1.026-1.053 2.502s1.078 2.88 1.228 3.08c.15.2 2.133 3.376 5.148 4.67.625 1.57.175 2.738-.354 3.268-.53.53-1.698.979-3.268.354z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ─── MAIN GRID ─── */}
      <section className="px-6 sm:px-10 pb-20">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-5">

            <div className="grad-border p-7">
              <span className="gold-line" />
              <h2 className="font-display text-xl font-semibold tracking-tight mb-6">Contact Information</h2>
              <div className="space-y-4">
                <InfoCard label="Phone" value="01518357567" href="tel:01518357567" />
                <InfoCard label="Email" value="info@technicalaidbd.com" href="mailto:info@technicalaidbd.com" />
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                  <p className="text-xs text-[var(--text-muted)] mb-2">Address</p>
                  <p className="text-sm leading-6 text-[var(--text-dim)]">
                    House No:- 64, Road: 6, Block A,<br />Section 12, Mirpur 1216,<br />Dhaka, Bangladesh
                  </p>
                  <a href={mapUrl} target="_blank" rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--gold)] hover:underline">
                    Open in Maps →
                  </a>
                </div>
              </div>
            </div>

            <div className="grad-border p-7">
              <h3 className="font-display text-base font-semibold mb-5">Service Lines</h3>
              <ul className="space-y-2">
                {serviceOptions.map((s) => (
                  <li key={s} className="flex items-center gap-3 py-2 border-b last:border-0 text-sm text-[var(--text-dim)]"
                    style={{ borderColor: "var(--border)" }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--gold)" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniMetric title="Location" value="Dhaka" />
              <MiniMetric title="Days" value="Sat–Thu" />
              <MiniMetric title="Support" value="On-site" />
            </div>
          </div>

          {/* RIGHT COLUMN — FORM */}
          <div className="lg:col-span-8">
            <div className="grad-border p-7 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
                <div>
                  <span className="gold-line" />
                  <h2 className="font-display text-2xl font-semibold tracking-tight">Send a Message</h2>
                  <p className="mt-1 text-sm text-[var(--text-dim)]">
                    Share your requirement and our team will respond as soon as possible.
                  </p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--gold-border)", color: "var(--gold)", background: "var(--gold-glow)" }}>
                  Technical Consultation
                </span>
              </div>

              {successMsg && (
                <div className="mb-6 rounded-xl border px-5 py-4 text-sm" style={{ borderColor: "rgba(16,185,129,0.22)", background: "rgba(16,185,129,0.08)", color: "#065f46" }}>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 rounded-xl border px-5 py-4 text-sm" style={{ borderColor: "rgba(239,68,68,0.22)", background: "rgba(239,68,68,0.08)", color: "#991b1b" }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full Name" required value={form.name}
                    onChange={(v) => onChange("name", v)} placeholder="Your full name" error={fieldError("name")} />
                  <Field label="Email Address" required type="email" value={form.email}
                    onChange={(v) => onChange("email", v)} placeholder="you@company.com" error={fieldError("email")} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Company / Organization" value={form.company}
                    onChange={(v) => onChange("company", v)} placeholder="Company name" error={fieldError("company")} />
                  <Field label="Phone Number" value={form.phone}
                    onChange={(v) => onChange("phone", v)} placeholder="01518357567" error={fieldError("phone")} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-dim)" }}>Service Interest</label>
                  <select
                    value={form.service}
                    onChange={(e) => onChange("service", e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold-border)]"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: form.service ? "var(--text)" : "var(--text-muted)" }}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s} style={{ background: "var(--surface-2)" }}>{s}</option>
                    ))}
                  </select>
                  {fieldError("service") && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{fieldError("service")}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                    Project / Requirement Details <span style={{ color: "#b91c1c" }}>*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                    rows={7}
                    placeholder="Tell us what you need (equipment type, project scope, issue details, installation requirement, timeline, etc.)"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold-border)] resize-none"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: "var(--text)" }}
                  />
                  {fieldError("message") && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{fieldError("message")}</p>}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[var(--text-muted)]">
                    By submitting, you agree to be contacted regarding your inquiry.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--gold)", color: "var(--on-gold)" }}
                  >
                    <span className="relative z-10">{submitting ? "Sending..." : "Send Message"}</span>
                    {!submitting && <span className="relative z-10 transition-transform group-hover:translate-x-0.5">→</span>}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: "var(--gold-light)" }} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section className="px-6 sm:px-10 pb-20">
        <div className="mx-auto max-w-7xl grad-border p-4">
          <div className="mb-4 px-2">
            <h2 className="font-display text-xl font-semibold">Find Us on Map</h2>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              Technical Aid, Mirpur, Dhaka — visit us for project consultation and technical support.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <iframe
              title="Technical Aid Location Map"
              src="https://www.google.com/maps?q=House%20No%2064,%20Road%206,%20Block%20A,%20Section%2012,%20Mirpur%201216,%20Dhaka,%20Bangladesh&output=embed"
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </main>
  );
}

function Field({ label, value, onChange, placeholder, error, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-dim)" }}>
        {label} {required && <span style={{ color: "#b91c1c" }}>*</span>}
      </label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold-border)]"
        style={{ background: "var(--surface-2)", borderColor: "var(--border-2)", color: "var(--text)" }}
      />
      {error && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}

function InfoCard({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      {href ? (
        <a href={href} className="text-sm hover:text-[var(--gold)] transition-colors" style={{ color: "var(--text-dim)" }}>{value}</a>
      ) : (
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>{value}</p>
      )}
    </div>
  );
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="grad-border p-4 text-center">
      <p className="text-xs text-[var(--text-muted)] mb-1">{title}</p>
      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{value}</p>
    </div>
  );
}
