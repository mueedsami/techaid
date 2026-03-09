"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminInput from "@/components/admin/AdminInput";
import {
  AdminProduct,
  AdminProductCategory,
  adminCreateProduct,
  adminDeleteProduct,
  adminListProductCategories,
  adminListProducts,
  adminUpdateProduct,
} from "@/lib/api";

const toLines = (value?: string) =>
  value ? value.split("\n").map((s) => s.trim()).filter(Boolean) : undefined;

const toSpecPairs = (value?: string) =>
  value
    ? value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return {
            label: label?.trim() || "",
            value: rest.join(":").trim() || "",
          };
        })
        .filter((item) => item.label && item.value)
    : undefined;

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newItem, setNewItem] = useState({
    product_category_id: "",
    name: "",
    slug: "",
    short_title: "",
    model_code: "",
    image_url: "",
    sector_tag: "",
    summary: "",
    description: "",
    key_features_text: "",
    educational_objectives_text: "",
    technical_specs_text: "",
    sort_order: 0,
    is_featured: true,
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [products, cats] = await Promise.all([
        adminListProducts(q.trim() || undefined),
        adminListProductCategories(),
      ]);
      setItems(products);
      setCategories(cats);
    } catch (e: any) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createItem = async () => {
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      await adminCreateProduct({
        product_category_id: newItem.product_category_id
          ? Number(newItem.product_category_id)
          : null,
        name: newItem.name,
        slug: newItem.slug || undefined,
        short_title: newItem.short_title || null,
        model_code: newItem.model_code || null,
        image_url: newItem.image_url || null,
        sector_tag: newItem.sector_tag || null,
        summary: newItem.summary || null,
        description: newItem.description || null,
        key_features: toLines(newItem.key_features_text),
        educational_objectives: toLines(newItem.educational_objectives_text),
        technical_specs: toSpecPairs(newItem.technical_specs_text),
        sort_order: Number(newItem.sort_order || 0),
        is_featured: newItem.is_featured,
        is_active: newItem.is_active,
      });

      setSuccess("Product added.");
      setNewItem({
        product_category_id: "",
        name: "",
        slug: "",
        short_title: "",
        model_code: "",
        image_url: "",
        sector_tag: "",
        summary: "",
        description: "",
        key_features_text: "",
        educational_objectives_text: "",
        technical_specs_text: "",
        sort_order: 0,
        is_featured: true,
        is_active: true,
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const saveItem = async (id: number, payload: Partial<AdminProduct>) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateProduct(id, payload);
      setSuccess(`Product #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update product");
    } finally {
      setSavingId(null);
    }
  };

  const removeItem = async (id: number) => {
    if (!window.confirm(`Delete product #${id}?`)) return;
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminDeleteProduct(id);
      setSuccess(`Product #${id} deleted.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete product");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Products" activeTab="products">
      <AdminSectionCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          />
          <button
            onClick={load}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              setQ("");
              setTimeout(load, 0);
            }}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm"
          >
            Reset
          </button>
        </div>
      </AdminSectionCard>

      {error && <AdminAlert type="error" text={error} />}
      {success && <AdminAlert type="success" text={success} />}

      <AdminSectionCard title="Add New Product">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-white/60">Category</label>
            <select
              value={newItem.product_category_id}
              onChange={(e) =>
                setNewItem({ ...newItem, product_category_id: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <AdminInput
            label="Product Name"
            value={newItem.name}
            onChange={(v) => setNewItem({ ...newItem, name: v })}
          />

          <AdminInput
            label="Slug (optional)"
            value={newItem.slug}
            onChange={(v) => setNewItem({ ...newItem, slug: v })}
          />

          <AdminInput
            label="Short Title"
            value={newItem.short_title}
            onChange={(v) => setNewItem({ ...newItem, short_title: v })}
          />

          <AdminInput
            label="Model Code"
            value={newItem.model_code}
            onChange={(v) => setNewItem({ ...newItem, model_code: v })}
          />

          <AdminInput
            label="Sector Tag"
            value={newItem.sector_tag}
            onChange={(v) => setNewItem({ ...newItem, sector_tag: v })}
          />

          <AdminInput
            label="Sort Order"
            type="number"
            value={String(newItem.sort_order)}
            onChange={(v) => setNewItem({ ...newItem, sort_order: Number(v || 0) })}
          />

          <div className="md:col-span-2">
            <AdminInput
              label="Image URL"
              value={newItem.image_url}
              onChange={(v) => setNewItem({ ...newItem, image_url: v })}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-white/60">Summary</label>
          <textarea
            value={newItem.summary}
            onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-white/60">Description</label>
          <textarea
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-white/60">
              Key Features (one per line)
            </label>
            <textarea
              value={newItem.key_features_text}
              onChange={(e) =>
                setNewItem({ ...newItem, key_features_text: e.target.value })
              }
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
              placeholder={`Advanced digital interface\nData logging capability\nIndustrial-grade build`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/60">
              Educational Objectives (one per line)
            </label>
            <textarea
              value={newItem.educational_objectives_text}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  educational_objectives_text: e.target.value,
                })
              }
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
              placeholder={`Calculate heat transfer rate\nDetermine effectiveness\nApply NTU method`}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-white/60">
            Technical Specs (one per line: Label: Value)
          </label>
          <textarea
            value={newItem.technical_specs_text}
            onChange={(e) =>
              setNewItem({ ...newItem, technical_specs_text: e.target.value })
            }
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
            placeholder={`Power Supply: 220V AC\nDisplay: Digital PID\nMaterial: Stainless Steel fittings`}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={newItem.is_featured}
              onChange={(e) =>
                setNewItem({ ...newItem, is_featured: e.target.checked })
              }
            />
            Featured
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={newItem.is_active}
              onChange={(e) => setNewItem({ ...newItem, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="mt-4">
          <button
            onClick={createItem}
            disabled={creating}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm"
          >
            {creating ? "Adding..." : "Add Product"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Products">
        {loading ? (
          <p className="text-sm text-white/60">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/60">No products found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ProductRow
                key={item.id}
                item={item}
                categories={categories}
                saving={savingId === item.id}
                onSave={saveItem}
                onDelete={removeItem}
              />
            ))}
          </div>
        )}
      </AdminSectionCard>
    </AdminShell>
  );
}

function ProductRow({
  item,
  categories,
  saving,
  onSave,
  onDelete,
}: {
  item: AdminProduct;
  categories: AdminProductCategory[];
  saving: boolean;
  onSave: (id: number, payload: Partial<AdminProduct>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    ...item,
    key_features_text: (item.key_features || []).join("\n"),
    educational_objectives_text: (item.educational_objectives || []).join("\n"),
    technical_specs_text: (item.technical_specs || [])
      .map((s) => `${s.label || ""}: ${s.value || ""}`.trim())
      .join("\n"),
  });

  useEffect(() => {
    setDraft({
      ...item,
      key_features_text: (item.key_features || []).join("\n"),
      educational_objectives_text: (item.educational_objectives || []).join("\n"),
      technical_specs_text: (item.technical_specs || [])
        .map((s) => `${s.label || ""}: ${s.value || ""}`.trim())
        .join("\n"),
    });
  }, [item]);

  const savePayload = useMemo(
    () => ({
      product_category_id: draft.product_category_id || null,
      name: draft.name,
      slug: draft.slug,
      short_title: draft.short_title || null,
      model_code: draft.model_code || null,
      image_url: draft.image_url || null,
      sector_tag: draft.sector_tag || null,
      summary: draft.summary || null,
      description: draft.description || null,
      key_features: toLines(draft.key_features_text),
      educational_objectives: toLines(draft.educational_objectives_text),
      technical_specs: toSpecPairs(draft.technical_specs_text),
      is_featured: !!draft.is_featured,
      is_active: !!draft.is_active,
      sort_order: Number(draft.sort_order || 0),
    }),
    [draft]
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
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
            onClick={() => onSave(item.id, savePayload)}
            disabled={saving}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/60">Category</label>
          <select
            value={draft.product_category_id || ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                product_category_id: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <AdminInput
          label="Product Name"
          value={draft.name}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />
        <AdminInput
          label="Slug"
          value={draft.slug}
          onChange={(v) => setDraft({ ...draft, slug: v })}
        />
        <AdminInput
          label="Short Title"
          value={draft.short_title || ""}
          onChange={(v) => setDraft({ ...draft, short_title: v })}
        />
        <AdminInput
          label="Model Code"
          value={draft.model_code || ""}
          onChange={(v) => setDraft({ ...draft, model_code: v })}
        />
        <AdminInput
          label="Sector Tag"
          value={draft.sector_tag || ""}
          onChange={(v) => setDraft({ ...draft, sector_tag: v })}
        />
        <AdminInput
          label="Sort Order"
          type="number"
          value={String(draft.sort_order || 0)}
          onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })}
        />

        <div className="md:col-span-2">
          <AdminInput
            label="Image URL"
            value={draft.image_url || ""}
            onChange={(v) => setDraft({ ...draft, image_url: v })}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-white/60">Summary</label>
        <textarea
          value={draft.summary || ""}
          onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-white/60">Description</label>
        <textarea
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/60">
            Key Features (one per line)
          </label>
          <textarea
            value={draft.key_features_text}
            onChange={(e) => setDraft({ ...draft, key_features_text: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-white/60">
            Educational Objectives (one per line)
          </label>
          <textarea
            value={draft.educational_objectives_text}
            onChange={(e) =>
              setDraft({ ...draft, educational_objectives_text: e.target.value })
            }
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-white/60">
          Technical Specs (Label: Value)
        </label>
        <textarea
          value={draft.technical_specs_text}
          onChange={(e) => setDraft({ ...draft, technical_specs_text: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={!!draft.is_featured}
            onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
          />
          Featured
        </label>

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
  );
}