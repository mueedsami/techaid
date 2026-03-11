"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  adminGetInquiry,
  adminUpdateInquiry,
  AdminInquiry,
  InquiryStatus,
} from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminInquiryDetailsPage({ params }: Props) {
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inquiry, setInquiry] = useState<AdminInquiry | null>(null);

  const [status, setStatus] = useState<InquiryStatus>("new");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    (async () => {
      const p = await params;
      const parsed = Number(p.id);
      if (!Number.isFinite(parsed)) {
        setError("Invalid inquiry ID.");
        setLoading(false);
        return;
      }
      setId(parsed);
    })();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const res = await adminGetInquiry(id);
        setInquiry(res.data);
        setStatus(res.data.status);
        setAdminNote(res.data.admin_note || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load inquiry");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const badgeClass = useMemo(() => {
    if (status === "closed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    if (status === "contacted") return "border-blue-400/20 bg-blue-400/10 text-blue-200";
    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-200";
  }, [status]);

  const onSave = async () => {
    if (!id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await adminUpdateInquiry(id, {
        status,
        admin_note: adminNote,
      });
      setInquiry(res.data);
      setSuccess("Inquiry updated successfully.");
    } catch (e: any) {
      setError(e?.message || "Failed to update inquiry");
    } finally {
      setSaving(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Copied to clipboard.");
      setTimeout(() => setSuccess(""), 1500);
    } catch {
      setError("Could not copy.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/inquiries"
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-white/10"
            >
              ← Back to Inquiries
            </Link>
            {id && (
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                Inquiry #{id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await fetch("/api/admin/auth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "logout" }),
                });
                window.location.href = "/admin/login";
              }}
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            Loading inquiry details...
          </div>
        ) : !inquiry ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            Inquiry not found.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Lead + Message */}
            <div className="space-y-6 lg:col-span-8">
              <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/60">Lead</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                      {inquiry.name}
                    </h1>
                    <p className="mt-1 text-sm text-white/60">
                      {inquiry.company || "No company provided"}
                    </p>
                  </div>

                  <span className={`rounded-full border px-3 py-1 text-xs ${badgeClass}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <QuickAction
                    label="Email"
                    value={inquiry.email}
                    href={`mailto:${inquiry.email}`}
                    onCopy={() => copy(inquiry.email)}
                  />
                  <QuickAction
                    label="Phone"
                    value={inquiry.phone || "Not provided"}
                    href={inquiry.phone ? `tel:${inquiry.phone}` : undefined}
                    onCopy={inquiry.phone ? () => copy(inquiry.phone!) : undefined}
                  />
                  <QuickAction
                    label="Service"
                    value={inquiry.service || "Not selected"}
                    onCopy={inquiry.service ? () => copy(inquiry.service!) : undefined}
                  />
                  <QuickAction
                    label="Submitted"
                    value={formatDt(inquiry.created_at)}
                    onCopy={inquiry.created_at ? () => copy(formatDt(inquiry.created_at)) : undefined}
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Message</h2>
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-white/85">
                    {inquiry.message}
                  </p>
                </div>
              </section>
            </div>

            {/* Right: Admin panel + metadata */}
            <div className="space-y-6 lg:col-span-4">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Admin Action</h2>
                <p className="mt-1 text-sm text-white/60">
                  Update status and save follow-up notes.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-sm text-white/80">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-white/20"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-white/80">Internal Note</label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={7}
                      placeholder="Add follow-up note, quote amount, next step, etc."
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-white/20"
                    />
                  </div>

                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Metadata</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <MetaRow label="ID" value={`#${inquiry.id}`} />
                  <MetaRow label="Created" value={formatDt(inquiry.created_at)} />
                  <MetaRow label="Handled At" value={formatDt(inquiry.handled_at)} />
                  <MetaRow label="IP Address" value={inquiry.ip_address || "—"} />
                  <MetaRow
                    label="Source"
                    value={inquiry.source_page || "—"}
                    long
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6">
                <h2 className="text-base font-semibold">Quick Actions</h2>
                <div className="mt-4 grid gap-2">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    Email Lead
                  </a>
                  {inquiry.phone && (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      Call Lead
                    </a>
                  )}
                  <button
                    onClick={() =>
                      copy(
                        `Lead: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || "-"}\nService: ${inquiry.service || "-"}\n\nMessage:\n${inquiry.message}`
                      )
                    }
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-sm hover:bg-white/10"
                  >
                    Copy Full Lead Details
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function QuickAction({
  label,
  value,
  href,
  onCopy,
}: {
  label: string;
  value: string;
  href?: string;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/50">{label}</p>
      {href ? (
        <a href={href} className="mt-1 block text-sm text-white/90 hover:text-white break-words">
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm text-white/90 break-words">{value}</p>
      )}
      {onCopy && (
        <button
          onClick={onCopy}
          className="mt-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
        >
          Copy
        </button>
      )}
    </div>
  );
}

function MetaRow({
  label,
  value,
  long = false,
}: {
  label: string;
  value: string;
  long?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <p className="text-xs text-white/50">{label}</p>
      <p className={`mt-1 text-white/85 ${long ? "break-words text-xs" : "text-sm"}`}>
        {value}
      </p>
    </div>
  );
}

function formatDt(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}