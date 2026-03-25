"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminInput from "@/components/admin/AdminInput";
import {
  AdminBlog,
  adminCreateBlog,
  adminDeleteBlog,
  adminListBlogs,
  adminUpdateBlog,
  adminUploadImage,
} from "@/lib/api";

export default function AdminBlogsPage() {
  const [items, setItems] = useState<AdminBlog[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newItem, setNewItem] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image_url: "",
    sort_order: 0,
    is_active: true,
    published_at: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListBlogs(q.trim() || undefined);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load blogs");
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
      if (!newItem.title || !newItem.content) throw new Error("Title and Content are required.");
      
      await adminCreateBlog({
        title: newItem.title,
        slug: newItem.slug || undefined,
        summary: newItem.summary || null,
        content: newItem.content,
        image_url: newItem.image_url || null,
        sort_order: Number(newItem.sort_order || 0),
        is_active: newItem.is_active,
        published_at: newItem.published_at || null,
      });

      setSuccess("Blog published.");
      setNewItem({
        title: "",
        slug: "",
        summary: "",
        content: "",
        image_url: "",
        sort_order: 0,
        is_active: true,
        published_at: "",
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to create blog");
    } finally {
      setCreating(false);
    }
  };

  const saveItem = async (id: number, payload: Partial<AdminBlog>) => {
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminUpdateBlog(id, payload);
      setSuccess(`Blog #${id} updated.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update blog");
    } finally {
      setSavingId(null);
    }
  };

  const removeItem = async (id: number) => {
    if (!window.confirm(`Delete blog #${id}?`)) return;
    setSavingId(id);
    setError("");
    setSuccess("");
    try {
      await adminDeleteBlog(id);
      setSuccess(`Blog #${id} deleted.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete blog");
    } finally {
      setSavingId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, draftSetter?: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    try {
      const res = await adminUploadImage(file);
      if (res.ok && res.url) {
        if (isNew) {
          setNewItem((prev) => ({ ...prev, image_url: res.url }));
        } else if (draftSetter) {
          draftSetter(res.url);
        }
        setSuccess("Image uploaded successfully.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <AdminShell title="Blogs" activeTab="blogs">
      <AdminSectionCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs..."
            className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
          <button onClick={load} className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm">
            Search
          </button>
          <button onClick={() => { setQ(""); setTimeout(load, 0); }} className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm">
            Reset
          </button>
        </div>
      </AdminSectionCard>

      {error && <AdminAlert type="error" text={error} />}
      {success && <AdminAlert type="success" text={success} />}

      <AdminSectionCard title="Create New Blog">
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Title *" value={newItem.title} onChange={(v) => setNewItem({ ...newItem, title: v })} />
          <AdminInput label="Slug (optional)" value={newItem.slug} onChange={(v) => setNewItem({ ...newItem, slug: v })} />
          
          <AdminInput
            label="Published Date"
            type="datetime-local"
            value={newItem.published_at}
            onChange={(v) => setNewItem({ ...newItem, published_at: v })}
          />
          <AdminInput label="Sort Order" type="number" value={String(newItem.sort_order)} onChange={(v) => setNewItem({ ...newItem, sort_order: Number(v || 0) })} />
          
          <div className="md:col-span-2 flex flex-col gap-2">
            <AdminInput label="Banner Image URL" value={newItem.image_url} onChange={(v) => setNewItem({ ...newItem, image_url: v })} />
            <div className="flex items-center gap-4">
              <label className="cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                {uploadingImage ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={uploadingImage} className="hidden" />
              </label>
              {newItem.image_url && (
                <div className="h-12 w-12 overflow-hidden rounded border border-gray-200">
                  <img src={newItem.image_url} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Summary (short preview)</label>
          <textarea
            value={newItem.summary}
            onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-500">Body Content * (HTML / Plain Text)</label>
            <label className="cursor-pointer text-xs text-[var(--gold)] hover:underline">
              {uploadingImage ? "Uploading..." : "+ Insert Image/Video"}
              <input type="file" accept="image/*,video/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingImage(true);
                try {
                  const res = await adminUploadImage(file);
                  if (res.ok && res.url) {
                    const tag = file.type.startsWith('video/')
                      ? `<video src="${res.url}" controls class="w-full rounded-xl my-4 aspect-video"></video>`
                      : `<img src="${res.url}" alt="Blog Media" class="w-full rounded-xl my-4" />`;
                    setNewItem((prev) => ({ ...prev, content: prev.content + "\n\n" + tag }));
                    setSuccess("Media inserted into content.");
                  }
                } catch (err: any) {
                  setError(err?.message || "Failed to upload media");
                } finally {
                  setUploadingImage(false);
                  if (e.target) e.target.value = "";
                }
              }} disabled={uploadingImage} className="hidden" />
            </label>
          </div>
          <textarea
            value={newItem.content}
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            rows={10}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm font-mono"
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={newItem.is_active} onChange={(e) => setNewItem({ ...newItem, is_active: e.target.checked })} />
            Published/Active
          </label>
        </div>

        <div className="mt-4">
          <button onClick={createItem} disabled={creating} className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm">
            {creating ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Manage Blogs">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No blogs found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <BlogRow
                key={item.id}
                item={item}
                saving={savingId === item.id}
                onSave={saveItem}
                onDelete={removeItem}
                handleImageUpload={handleImageUpload}
              />
            ))}
          </div>
        )}
      </AdminSectionCard>
    </AdminShell>
  );
}

function BlogRow({
  item,
  saving,
  onSave,
  onDelete,
  handleImageUpload,
}: {
  item: AdminBlog;
  saving: boolean;
  onSave: (id: number, payload: Partial<AdminBlog>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, draftSetter?: (url: string) => void) => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    title: item.title,
    slug: item.slug,
    summary: item.summary || "",
    content: item.content,
    image_url: item.image_url || "",
    sort_order: item.sort_order,
    is_active: !!item.is_active,
    published_at: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setDraft({
      title: item.title,
      slug: item.slug,
      summary: item.summary || "",
      content: item.content,
      image_url: item.image_url || "",
      sort_order: item.sort_order,
      is_active: !!item.is_active,
      published_at: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : "",
    });
  }, [item]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">#{item.id} - {item.title}</p>
          <p className="text-xs text-gray-500">{new Date(item.published_at || "").toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onDelete(item.id)} disabled={saving} className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200">
            Delete
          </button>
          <button onClick={() => onSave(item.id, draft as any)} disabled={saving} className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminInput label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <AdminInput label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
        <AdminInput label="Published Date" type="datetime-local" value={draft.published_at} onChange={(v) => setDraft({ ...draft, published_at: v })} />
        <AdminInput label="Sort Order" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v || 0) })} />

        <div className="md:col-span-2 flex flex-col gap-2">
          <AdminInput label="Image URL" value={draft.image_url} onChange={(v) => setDraft({ ...draft, image_url: v })} />
          <div className="flex items-center gap-4">
            <label className="cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
              {uploadingImage ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={async (e) => {
                setUploadingImage(true);
                await handleImageUpload(e, false, (url) => setDraft((p) => ({ ...p, image_url: url })));
                setUploadingImage(false);
              }} disabled={uploadingImage} className="hidden" />
            </label>
            {draft.image_url && (
              <div className="h-12 w-12 overflow-hidden rounded border border-gray-200">
                <img src={draft.image_url} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-gray-500">Summary</label>
        <textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} rows={2} className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm" />
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs text-gray-500">Body Content</label>
          <label className="cursor-pointer text-xs text-[var(--gold)] hover:underline">
            {uploadingImage ? "Uploading..." : "+ Insert Image/Video"}
            <input type="file" accept="image/*,video/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploadingImage(true);
              try {
                const res = await adminUploadImage(file);
                if (res.ok && res.url) {
                  const tag = file.type.startsWith('video/')
                    ? `<video src="${res.url}" controls class="w-full rounded-xl my-4 aspect-video"></video>`
                    : `<img src="${res.url}" alt="Blog Media" class="w-full rounded-xl my-4" />`;
                  setDraft((prev) => ({ ...prev, content: prev.content + "\n\n" + tag }));
                }
              } catch (err) {
                console.error("Failed to upload media");
              } finally {
                setUploadingImage(false);
                if (e.target) e.target.value = "";
              }
            }} disabled={uploadingImage} className="hidden" />
          </label>
        </div>
        <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={6} className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm font-mono" />
      </div>

      <div className="mt-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
          Published/Active
        </label>
      </div>
    </div>
  );
}
