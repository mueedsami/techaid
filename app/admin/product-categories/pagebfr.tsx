"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminInput from "@/components/admin/AdminInput";
import {
  AdminProductCategory,
  adminCreateProductCategory,
  adminDeleteProductCategory,
  adminListProductCategories,
  adminUpdateProductCategory,
} from "@/lib/api";

const SUGGESTED_CATEGORIES = [
  "Heat Transfer",
  "Fluid Mechanics",
  "Fluid Machineries",
  "Theory of Machines",
  "Control Automation",
  "Electrical & Electronics",
  "Custom Machines & Tools",
];

export default function AdminProductCategoriesPage() {
  const [items, setItems] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListProductCategories();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const existingNames = useMemo(
    () => new Set(items.map((i) => i.name.trim().toLowerCase())),
    [items]
  );

  const createCategory = async () => {
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      await adminCreateProductCategory({
        name,
        slug: slug || undefined,
        sort_order: Number(sortOrder || 0),
        is_active: isActive,
      });
      setSuccess("Category added.");
      setName("");
      setSlug("");
      setSortOrder(0);
      setIsActive(true);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const quickAddCategory = async (catName: string) => {
    if (existingNames.has(catName.toLowerCase())) return;
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      await adminCreateProductCategory({
        name: catName,
        sort_order: items.length + 1,
        is_active: true,
      });
      setSuccess(`Added "${catName}"`);
      await load();
    } catch (e: any) {
      setError(e?.message || `Failed to add "${catName}"`);
    } finally {
      setCreating(false);
    }
  };

  const saveCategory = async (id: number, payload: Partial<AdminProductCategory>) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateProductCategory(id, payload);
      setSuccess(`Category #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update category");
    } finally {
      setSavingId(null);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm(`Delete category #${id}?`)) return;
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminDeleteProductCategory(id);
      setSuccess(`Category #${id} deleted.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete category");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Product Categories" activeTab="product-categories">
      {error && <AdminAlert type="error" text={error} />}
      {success && <AdminAlert type="success" text={success} />}

      <AdminSectionCard title="Quick Add Suggested Categories">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_CATEGORIES.map((cat) => {
            const exists = existingNames.has(cat.toLowerCase());
            return (
              <button
                key={cat}
                onClick={() => quickAddCategory(cat)}
                disabled={exists || creating}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  exists
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {exists ? `✓ ${cat}` : `+ ${cat}`}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-white/55">
          One click to add your real catalog categories.
        </p>
      </AdminSectionCard>

      <AdminSectionCard title="Add Category Manually">
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Category Name" value={name} onChange={setName} />
          <AdminInput label="Slug (optional)" value={slug} onChange={setSlug} />
          <AdminInput
            label="Sort Order"
            type="number"
            value={String(sortOrder)}
            onChange={(v) => setSortOrder(Number(v || 0))}
          />

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active
            </label>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={createCategory}
            disabled={creating || !name.trim()}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm"
          >
            {creating ? "Adding..." : "Add Category"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Categories">
        {loading ? (
          <p className="text-sm text-white/60">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/60">No categories yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CategoryRow
                key={item.id}
                item={item}
                saving={savingId === item.id}
                onSave={saveCategory}
                onDelete={deleteCategory}
              />
            ))}
          </div>
        )}
      </AdminSectionCard>
    </AdminShell>
  );
}

function CategoryRow({
  item,
  saving,
  onSave,
  onDelete,
}: {
  item: AdminProductCategory;
  saving: boolean;
  onSave: (id: number, payload: Partial<AdminProductCategory>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState(item);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">#{item.id}</p>
          <p className="text-xs text-white/55">{item.name}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onDelete(item.id)}
            disabled={saving}
            className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200"
          >
            Delete
          </button>
          <button
            onClick={() =>
              onSave(item.id, {
                name: draft.name,
                slug: draft.slug || undefined,
                sort_order: Number(draft.sort_order || 0),
                is_active: !!draft.is_active,
              })
            }
            disabled={saving}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminInput
          label="Name"
          value={draft.name}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />
        <AdminInput
          label="Slug"
          value={draft.slug || ""}
          onChange={(v) => setDraft({ ...draft, slug: v })}
        />
        <AdminInput
          label="Sort Order"
          type="number"
          value={String(draft.sort_order || 0)}
          onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })}
        />
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={!!draft.is_active}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>
      </div>
    </div>
  );
}