"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import {
  AdminInquiry,
  InquiryStatus,
  adminListInquiries,
  adminUpdateInquiry,
} from "@/lib/api";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<AdminInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | InquiryStatus>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListInquiries({
        q: q.trim() || undefined,
        status: status || undefined,
      });
      setItems(data.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const url = new URL("/api/admin/inquiries-export", origin);
    if (q.trim()) url.searchParams.set("q", q.trim());
    if (status) url.searchParams.set("status", status);
    return url.pathname + url.search;
  }, [q, status]);

  const updateRow = async (
    id: number,
    payload: { status: InquiryStatus; admin_note?: string }
  ) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateInquiry(id, payload);
      setSuccess(`Inquiry #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update inquiry");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Inquiries" activeTab="inquiries">
      <AdminSectionCard>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, company, message..."
            className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | InquiryStatus)}
            className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={load}
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm hover:bg-gray-200"
          >
            Search
          </button>

          <button
            onClick={() => {
              setQ("");
              setStatus("");
              setTimeout(load, 0);
            }}
            className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={exportUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >
            Export CSV
          </a>
        </div>
      </AdminSectionCard>

      {error && <AdminAlert type="error" text={error} />}
      {success && <AdminAlert type="success" text={success} />}

      <AdminSectionCard title="Manage Inquiries">
        {loading ? (
          <p className="text-sm text-gray-500">Loading inquiries...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No inquiries found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((inq) => (
              <InquiryRow
                key={inq.id}
                item={inq}
                saving={savingId === inq.id}
                onSave={updateRow}
              />
            ))}
          </div>
        )}
      </AdminSectionCard>
    </AdminShell>
  );
}

function InquiryRow({
  item,
  saving,
  onSave,
}: {
  item: AdminInquiry;
  saving: boolean;
  onSave: (
    id: number,
    payload: { status: InquiryStatus; admin_note?: string }
  ) => Promise<void>;
}) {
  const [draftStatus, setDraftStatus] = useState<InquiryStatus>(item.status);
  const [draftNote, setDraftNote] = useState(item.admin_note || "");

  useEffect(() => {
    setDraftStatus(item.status);
    setDraftNote(item.admin_note || "");
  }, [item]);

  const badgeClass =
    item.status === "closed"
      ? "border-emerald-600/30 bg-emerald-50 text-emerald-700"
      : item.status === "contacted"
      ? "border-blue-600/30 bg-blue-50 text-blue-700"
      : "border-yellow-600/30 bg-yellow-50 text-yellow-700";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      {/* top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">#{item.id}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass}`}>
              {item.status.toUpperCase()}
            </span>
            <Link
              href={`/admin/inquiries/${item.id}`}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              Open
            </Link>
          </div>

          <p className="mt-1 text-sm text-gray-900">
            {item.name} · {item.email}
            {item.phone ? ` · ${item.phone}` : ""}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {item.company || "No company"} {item.service ? `· ${item.service}` : ""}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Submitted: {formatDt(item.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={saving}
            onClick={() =>
              onSave(item.id, { status: draftStatus, admin_note: draftNote })
            }
            className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* message preview */}
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-400">Message</p>
        <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-700">
          {item.message}
        </p>
      </div>

      {/* controls */}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Status</label>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as InquiryStatus)}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">Internal Note</label>
          <textarea
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            rows={3}
            placeholder="Add follow-up note..."
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          />
        </div>
      </div>
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