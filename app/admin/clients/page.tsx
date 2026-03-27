"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminInput from "@/components/admin/AdminInput";
import {
  adminCreateClient,
  adminDeleteClient,
  adminListClients,
  adminUpdateClient,
  AdminClient,
} from "@/lib/api";

const CLIENT_TYPES = ["University", "Industry", "Government", "Institute", "Research", "Private"];

export default function AdminClientsPage() {
  const [items, setItems] = useState<AdminClient[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    type: "University",
    sector: "",
    summary: "",
    sort_order: 0,
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListClients(q.trim() || undefined);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createClient = async () => {
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      await adminCreateClient(newItem);
      setSuccess("Client added.");
      setNewItem({
        name: "",
        type: "University",
        sector: "",
        summary: "",
        sort_order: 0,
        is_active: true,
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create client");
    } finally {
      setCreating(false);
    }
  };

  const updateRow = async (id: number, patch: Partial<AdminClient>) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateClient(id, patch);
      setSuccess(`Client #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update client");
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = async (id: number) => {
    if (!window.confirm(`Delete client #${id}?`)) return;
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminDeleteClient(id);
      setSuccess(`Client #${id} deleted.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete client");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Clients" activeTab="clients">
      <AdminSectionCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients..."
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

      <AdminSectionCard title="Add New Client">
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Client Name" value={newItem.name} onChange={(v) => setNewItem({ ...newItem, name: v })} />
          <div>
            <label className="mb-1 block text-xs text-gray-500">Type</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
            >
              {CLIENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <AdminInput label="Sector" value={newItem.sector} onChange={(v) => setNewItem({ ...newItem, sector: v })} />
          <AdminInput
            label="Sort Order"
            type="number"
            value={String(newItem.sort_order)}
            onChange={(v) => setNewItem({ ...newItem, sort_order: Number(v || 0) })}
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Summary</label>
          <textarea
            value={newItem.summary}
            onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
          />
        </div>

        <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={newItem.is_active}
            onChange={(e) => setNewItem({ ...newItem, is_active: e.target.checked })}
          />
          Active
        </label>

        <div className="mt-4">
          <button
            onClick={createClient}
            disabled={creating}
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium hover:bg-gray-200 disabled:opacity-60"
          >
            {creating ? "Adding..." : "Add Client"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Clients">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No clients found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ClientRow
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

function ClientRow({
  item,
  saving,
  onSave,
  onDelete,
}: {
  item: AdminClient;
  saving: boolean;
  onSave: (id: number, patch: Partial<AdminClient>) => Promise<void>;
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
        <div>
          <label className="mb-1 block text-xs text-gray-500">Type</label>
          <select
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          >
            {CLIENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <AdminInput label="Sector" value={draft.sector || ""} onChange={(v) => setDraft({ ...draft, sector: v })} />
        <AdminInput
          label="Sort Order"
          type="number"
          value={String(draft.sort_order ?? 0)}
          onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })}
        />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">Summary</label>
        <textarea
          value={draft.summary || ""}
          onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm outline-none focus:border-gray-300"
        />
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={!!draft.is_active}
          onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
        />
        Active
      </label>
    </div>
  );
}