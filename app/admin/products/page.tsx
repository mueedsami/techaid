"use client";

export const dynamic = "force-dynamic";

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
  adminUploadImage,
} from "@/lib/api";

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    brochure_url: "",
    sort_order: 0,
    is_featured: true,
    is_active: true,
    gallery_images: [] as string[],
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
        brochure_url: newItem.brochure_url || null,
        summary: newItem.summary || null,
        description: newItem.description || null,
        key_features: newItem.key_features_text ? newItem.key_features_text.split("\n").filter(Boolean) : undefined,
        educational_objectives: newItem.educational_objectives_text ? newItem.educational_objectives_text.split("\n").filter(Boolean) : undefined,
        technical_specs: newItem.technical_specs_text ? newItem.technical_specs_text.split("\n").filter(Boolean).map((l) => { const [label, ...rest] = l.split(":"); return { label: label.trim(), value: rest.join(":").trim() }; }) : undefined,
        gallery_images: newItem.gallery_images.length > 0 ? newItem.gallery_images : undefined,
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
        brochure_url: "",
        sort_order: 0,
        is_featured: true,
        is_active: true,
        gallery_images: [],
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const saveItem = async (id: number, payload: Partial<AdminProduct> & { educational_objectives?: string }) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateProduct(id, payload as any);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    try {
      const res = await adminUploadImage(file);
      if (res.ok && res.url) {
        setNewItem({ ...newItem, image_url: res.url });
        setSuccess("Image uploaded successfully.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = ""; // Reset input
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
            className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
          <button
            onClick={load}
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              setQ("");
              setTimeout(load, 0);
            }}
            className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm"
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
            <label className="mb-1 block text-xs text-gray-500">Category</label>
            <select
              value={newItem.product_category_id}
              onChange={(e) => setNewItem({ ...newItem, product_category_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
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
            label="Brochure URL"
            value={newItem.brochure_url}
            onChange={(v) => setNewItem({ ...newItem, brochure_url: v })}
          />

          <AdminInput
            label="Sort Order"
            type="number"
            value={String(newItem.sort_order)}
            onChange={(v) => setNewItem({ ...newItem, sort_order: Number(v || 0) })}
          />

          <div className="md:col-span-2 flex flex-col gap-2">
            <AdminInput
              label="Image URL"
              value={newItem.image_url}
              onChange={(v) => setNewItem({ ...newItem, image_url: v })}
            />
            <div className="flex items-center gap-4">
              <label className="cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                {uploadingImage ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {newItem.image_url && (
                <div className="h-12 w-12 overflow-hidden rounded border border-gray-200">
                  <img src={newItem.image_url} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Gallery Images</label>
            <div className="flex flex-wrap items-center gap-4">
              {newItem.gallery_images.map((url, i) => (
                <div key={i} className="relative group h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img src={url} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, gallery_images: newItem.gallery_images.filter((_, index) => index !== i) })}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center rounded-full bg-red-500/90 h-6 w-6 text-white hover:bg-red-600 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 p-2 text-center text-sm transition-colors">
                {uploadingImage ? "..." : "+ Add"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setUploadingImage(true);
                    try {
                      const newUrls = [...newItem.gallery_images];
                      for (let i = 0; i < files.length; i++) {
                        const res = await adminUploadImage(files[i]);
                        if (res.ok && res.url) newUrls.push(res.url);
                      }
                      setNewItem({ ...newItem, gallery_images: newUrls });
                      setSuccess("Gallery images uploaded.");
                    } catch (err: any) {
                      setError(err?.message || "Failed to upload");
                    } finally {
                      setUploadingImage(false);
                      if (e.target) e.target.value = "";
                    }
                  }}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Summary</label>
          <textarea
            value={newItem.summary}
            onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Description</label>
          <textarea
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Key Features (one per line)</label>
            <textarea
              value={newItem.key_features_text}
              onChange={(e) => setNewItem({ ...newItem, key_features_text: e.target.value })}
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
              placeholder={`Advanced digital interface\nData logging capability\nIndustrial-grade build`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Educational Objectives (one per line)
            </label>
            <textarea
              value={newItem.educational_objectives_text}
              onChange={(e) =>
                setNewItem({ ...newItem, educational_objectives_text: e.target.value })
              }
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
              placeholder={`Calculate heat transfer rate\nDetermine effectiveness\nApply NTU method`}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">
            Technical Specs (one per line: Label: Value)
          </label>
          <textarea
            value={newItem.technical_specs_text}
            onChange={(e) => setNewItem({ ...newItem, technical_specs_text: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
            placeholder={`Power Supply: 220V AC\nDisplay: Digital PID\nMaterial: Stainless Steel fittings`}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={newItem.is_featured}
              onChange={(e) => setNewItem({ ...newItem, is_featured: e.target.checked })}
            />
            Featured
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
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
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm"
          >
            {creating ? "Adding..." : "Add Product"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Products">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No products found.</p>
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
  onSave: (id: number, payload: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    ...item,
    gallery_images: item.gallery_images || [],
    key_features_text: (item.key_features || []).join("\n"),
    educational_objectives_text: (item.educational_objectives || []).join("\n"),
    technical_specs_text: (item.technical_specs || [])
      .map((s) => `${s.label || ""}: ${s.value || ""}`.trim())
      .join("\n"),
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setDraft({
      ...item,
      gallery_images: item.gallery_images || [],
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
      brochure_url: draft.brochure_url || null,
      summary: draft.summary || null,
      description: draft.description || null,
      key_features: draft.key_features_text ? draft.key_features_text.split("\n").filter(Boolean) : undefined,
      educational_objectives: draft.educational_objectives_text ? draft.educational_objectives_text.split("\n").filter(Boolean) : undefined,
      technical_specs: draft.technical_specs_text ? draft.technical_specs_text.split("\n").filter(Boolean).map((l) => { const [label, ...rest] = l.split(":"); return { label: label.trim(), value: rest.join(":").trim() }; }) : undefined,
      gallery_images: draft.gallery_images.length > 0 ? draft.gallery_images : [],
      is_featured: !!draft.is_featured,
      is_active: !!draft.is_active,
      sort_order: Number(draft.sort_order || 0),
    }),
    [draft]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">#{item.id}</p>
          <p className="text-xs text-gray-500">{item.name}</p>
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
            className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Category</label>
          <select
            value={draft.product_category_id || ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                product_category_id: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <AdminInput label="Product Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        <AdminInput label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
        <AdminInput label="Short Title" value={draft.short_title || ""} onChange={(v) => setDraft({ ...draft, short_title: v })} />
        <AdminInput label="Model Code" value={draft.model_code || ""} onChange={(v) => setDraft({ ...draft, model_code: v })} />
        <AdminInput label="Sector Tag" value={draft.sector_tag || ""} onChange={(v) => setDraft({ ...draft, sector_tag: v })} />
        <AdminInput label="Brochure URL" value={draft.brochure_url || ""} onChange={(v) => setDraft({ ...draft, brochure_url: v })} />
        <AdminInput label="Sort Order" type="number" value={String(draft.sort_order || 0)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })} />

        <div className="md:col-span-2 flex flex-col gap-2">
            <AdminInput label="Image URL" value={draft.image_url || ""} onChange={(v) => setDraft({ ...draft, image_url: v })} />
            <div className="flex items-center gap-4">
              <label className="cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                {uploadingImage ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImage(true);
                    try {
                      const res = await adminUploadImage(file);
                      if (res.ok && res.url) {
                        setDraft({ ...draft, image_url: res.url });
                      } else {
                        alert("Failed to upload image");
                      }
                    } catch (err: any) {
                      alert(err?.message || "Failed to upload image");
                    } finally {
                      setUploadingImage(false);
                      if (e.target) e.target.value = "";
                    }
                  }}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {draft.image_url && (
                <div className="h-12 w-12 overflow-hidden rounded border border-gray-200 bg-white">
                  <img src={draft.image_url} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 mt-4 text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700">Gallery Images</label>
            <div className="flex flex-wrap items-center gap-4">
              {draft.gallery_images.map((url, i) => (
                <div key={i} className="relative group h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img src={url} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, gallery_images: draft.gallery_images.filter((_, index) => index !== i) })}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center rounded-full bg-red-500/90 h-6 w-6 text-white hover:bg-red-600 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 p-2 text-center text-sm transition-colors">
                {uploadingImage ? "..." : "+ Add"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setUploadingImage(true);
                    try {
                      const newUrls = [...draft.gallery_images];
                      for (let i = 0; i < files.length; i++) {
                        const res = await adminUploadImage(files[i]);
                        if (res.ok && res.url) newUrls.push(res.url);
                      }
                      setDraft({ ...draft, gallery_images: newUrls });
                    } catch (err: any) {
                      alert(err?.message || "Failed to upload image");
                    } finally {
                      setUploadingImage(false);
                      if (e.target) e.target.value = "";
                    }
                  }}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">Summary</label>
        <textarea
          value={draft.summary || ""}
          onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Key Features (one per line)</label>
          <textarea
            value={draft.key_features_text}
            onChange={(e) => setDraft({ ...draft, key_features_text: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Educational Objectives (one per line)
          </label>
          <textarea
            value={draft.educational_objectives_text}
            onChange={(e) =>
              setDraft({ ...draft, educational_objectives_text: e.target.value })
            }
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">
          Technical Specs (Label: Value)
        </label>
        <textarea
          value={draft.technical_specs_text}
          onChange={(e) => setDraft({ ...draft, technical_specs_text: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!draft.is_featured}
            onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
          />
          Featured
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
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