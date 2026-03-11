"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminInput from "@/components/admin/AdminInput";
import {
  AdminTestimonial,
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminListTestimonials,
  adminUpdateTestimonial,
} from "@/lib/api";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newItem, setNewItem] = useState({
    quote: "",
    name: "",
    role: "",
    company: "",
    rating: 5,
    is_featured: true,
    is_active: true,
    sort_order: 0,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListTestimonials(q.trim() || undefined);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createItem = async () => {
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      await adminCreateTestimonial(newItem);
      setSuccess("Testimonial added.");
      setNewItem({
        quote: "",
        name: "",
        role: "",
        company: "",
        rating: 5,
        is_featured: true,
        is_active: true,
        sort_order: 0,
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create testimonial");
    } finally {
      setCreating(false);
    }
  };

  const updateRow = async (id: number, patch: Partial<AdminTestimonial>) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateTestimonial(id, patch);
      setSuccess(`Testimonial #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update testimonial");
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = async (id: number) => {
    if (!window.confirm(`Delete testimonial #${id}?`)) return;
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminDeleteTestimonial(id);
      setSuccess(`Testimonial #${id} deleted.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete testimonial");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Testimonials" activeTab="testimonials">
      <AdminSectionCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search testimonials..."
            className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          />
          <button onClick={load} className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm hover:bg-gray-200">
            Search
          </button>
          <button
            onClick={() => {
              setQ("");
              setTimeout(load, 0);
            }}
            className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </AdminSectionCard>

      {error && <AdminAlert type="error" text={error} />}
      {success && <AdminAlert type="success" text={success} />}

      <AdminSectionCard title="Add New Testimonial">
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Name" value={newItem.name} onChange={(v) => setNewItem({ ...newItem, name: v })} />
          <AdminInput label="Role" value={newItem.role} onChange={(v) => setNewItem({ ...newItem, role: v })} />
          <AdminInput label="Company" value={newItem.company} onChange={(v) => setNewItem({ ...newItem, company: v })} />
          <AdminInput
            label="Sort Order"
            type="number"
            value={String(newItem.sort_order)}
            onChange={(v) => setNewItem({ ...newItem, sort_order: Number(v || 0) })}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Rating</label>
            <select
              value={newItem.rating}
              onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={newItem.is_featured}
              onChange={(e) => setNewItem({ ...newItem, is_featured: e.target.checked })}
            />
            Featured (homepage)
          </label>

          <label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={newItem.is_active}
              onChange={(e) => setNewItem({ ...newItem, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Quote</label>
          <textarea
            value={newItem.quote}
            onChange={(e) => setNewItem({ ...newItem, quote: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={createItem}
            disabled={creating}
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium hover:bg-gray-200 disabled:opacity-60"
          >
            {creating ? "Adding..." : "Add Testimonial"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Testimonials">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No testimonials found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <TestimonialRow
                key={item.id}
                item={item}
                saving={savingId === item.id}
                onSave={updateRow}
                onDelete={deleteRow}
              />
            ))}
          </div>
        )}
      </AdminSectionCard>
    </AdminShell>
  );
}

function TestimonialRow({
  item,
  saving,
  onSave,
  onDelete,
}: {
  item: AdminTestimonial;
  saving: boolean;
  onSave: (id: number, patch: Partial<AdminTestimonial>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState(item);
  useEffect(() => setDraft(item), [item]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">#{item.id}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(item.id)}
            disabled={saving}
            className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-100 disabled:opacity-60"
          >
            Delete
          </button>
          <button
            onClick={() => onSave(item.id, draft)}
            disabled={saving}
            className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminInput label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        <AdminInput label="Role" value={draft.role || ""} onChange={(v) => setDraft({ ...draft, role: v })} />
        <AdminInput label="Company" value={draft.company || ""} onChange={(v) => setDraft({ ...draft, company: v })} />
        <AdminInput
          label="Sort Order"
          type="number"
          value={String(draft.sort_order ?? 0)}
          onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })}
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Rating</label>
          <select
            value={draft.rating}
            onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!draft.is_featured}
            onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
          />
          Featured
        </label>

        <label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Active
        </label>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">Quote</label>
        <textarea
          value={draft.quote}
          onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
        />
      </div>
    </div>
  );
}