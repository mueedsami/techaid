type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
};

type ContactSuccess = {
  ok: boolean;
  message?: string;
  id?: number;
};

export async function submitContactForm(payload: ContactPayload): Promise<ContactSuccess> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const res = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...payload,
      website: "",
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: any = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.errors = data?.errors || {};
    throw err;
  }

  return data;
}

// ---------- Admin APIs (via Next.js secure proxy) ----------

export type InquiryStatus = "new" | "contacted" | "closed";

export type AdminInquiry = {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  message: string;
  status: InquiryStatus;
  admin_note?: string | null;
  handled_at?: string | null;
  created_at?: string | null;
  ip_address?: string | null;
  source_page?: string | null;
};

type ListInquiriesResponse = {
  ok: boolean;
  data: AdminInquiry[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    all: number;
    new: number;
    contacted: number;
    closed: number;
  };
};

export async function adminListInquiries(params: {
  q?: string;
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<ListInquiriesResponse> {
  const url = new URL("/api/admin/inquiries", window.location.origin);

  if (params.q) url.searchParams.set("q", params.q);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.per_page) url.searchParams.set("per_page", String(params.per_page));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(data?.message || "Failed to load inquiries");
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function adminUpdateInquiry(
  id: number,
  payload: { status: InquiryStatus; admin_note?: string }
): Promise<{ ok: boolean; message?: string; data: AdminInquiry }> {
  const res = await fetch(`/api/admin/inquiries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(data?.message || "Failed to update inquiry");
    err.status = res.status;
    err.errors = data?.errors || {};
    throw err;
  }
  return data;
}

export function adminExportInquiriesCsvUrl() {
  return "/api/admin/inquiries-export";
}

export async function adminGetInquiry(
  id: number
): Promise<{ ok: boolean; data: AdminInquiry }> {
  const res = await fetch(`/api/admin/inquiries/${id}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(data?.message || "Failed to load inquiry");
    err.status = res.status;
    throw err;
  }

  return data;
}


// ---------- Public Content APIs ----------

export type ClientItem = {
  id: number;
  name: string;
  type: "University" | "Industry" | "Government" | "Institute" | "Research" | "Private" | string;
  sector?: string | null;
  summary?: string | null;
};

export type TestimonialItem = {
  id: number;
  quote: string;
  name: string;
  role?: string | null;
  company?: string | null;
  rating?: number | null;
  is_featured?: boolean;
};

const PRODUCTION_PUBLIC_API_BASE_URL = "https://techaid.madestic.com";
const DEVELOPMENT_PUBLIC_API_BASE_URL = "http://localhost:8000";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getPublicApiBaseUrl() {
  const configured = "https://techaid.madestic.com";
  return configured;
}


export async function fetchClients(params?: { type?: string }): Promise<ClientItem[]> {
  try {
    const url = new URL(`${getPublicApiBaseUrl()}/api/clients`);
    if (params?.type) url.searchParams.set("type", params.type);
    const res = await fetch(url.toString(), { 
        headers: { Accept: "application/json", "Cache-Control": "no-store" }, 
        cache: 'no-store' 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return data?.data || [];
  } catch {
    return [];
  }
}

export async function fetchTestimonials(params?: {
  featured?: boolean;
  limit?: number;
}): Promise<TestimonialItem[]> {
  try {
    const url = new URL(`${getPublicApiBaseUrl()}/api/testimonials`);
    if (params?.featured) url.searchParams.set("featured", "1");
    if (params?.limit) url.searchParams.set("limit", String(params.limit));
    const res = await fetch(url.toString(), { 
        headers: { Accept: "application/json", "Cache-Control": "no-store" }, 
        cache: 'no-store' 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return data?.data || [];
  } catch {
    return [];
  }
}

// ---------- Admin Content APIs (Clients + Testimonials) ----------

export type AdminClient = {
  id: number;
  name: string;
  type: string;
  sector?: string | null;
  summary?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AdminTestimonial = {
  id: number;
  quote: string;
  name: string;
  role?: string | null;
  company?: string | null;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export async function adminListClients(q?: string): Promise<AdminClient[]> {
  const url = new URL("/api/admin/clients", window.location.origin);
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to load clients");
  return data?.data || [];
}

export async function adminCreateClient(payload: Partial<AdminClient>) {
  const res = await fetch("/api/admin/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to create client");
  return data;
}

export async function adminUpdateClient(id: number, payload: Partial<AdminClient>) {
  const res = await fetch(`/api/admin/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update client");
  return data;
}

export async function adminDeleteClient(id: number) {
  const res = await fetch(`/api/admin/clients/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete client");
  return data;
}

export async function adminListTestimonials(q?: string): Promise<AdminTestimonial[]> {
  const url = new URL("/api/admin/testimonials", window.location.origin);
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to load testimonials");
  return data?.data || [];
}

export async function adminCreateTestimonial(payload: Partial<AdminTestimonial>) {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to create testimonial");
  return data;
}

export async function adminUpdateTestimonial(id: number, payload: Partial<AdminTestimonial>) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update testimonial");
  return data;
}

export async function adminDeleteTestimonial(id: number) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete testimonial");
  return data;
}



// ---------- Public Product APIs ----------

export type PublicProductCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type PublicProductCard = {
  id: number;
  name: string;
  slug: string;
  short_title?: string | null;
  image_url?: string | null;
  sector_tag?: string | null;
  summary?: string | null;
  is_featured?: boolean;
  category?: { id: number; name: string; slug: string } | null;
  model_code?: string | null;
};

export type PublicProductDetails = PublicProductCard & {
  description?: string | null;
  key_features: string[];
  technical_specs: { label: string; value: string }[];
  gallery_images: string[];
  educational_objectives: string[];
};

export async function fetchProductCategories(): Promise<PublicProductCategory[]> {
  try {
    const res = await fetch(`${getPublicApiBaseUrl()}/api/product-categories`, {
  headers: { Accept: "application/json", "Cache-Control": "no-store" },
  cache: "no-store",
});
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return data?.data || [];
  } catch {
    return [];
  }
}

export async function fetchProducts(params?: {
  q?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<PublicProductCard[]> {
  const url = new URL(`${getPublicApiBaseUrl()}/api/products`);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.featured) url.searchParams.set("featured", "1");
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "Cache-Control": "no-store" },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("fetchProducts failed:", res.status, data, "URL:", url.toString());
      return [];
    }

    return data?.data || [];
  } catch (error) {
    console.error("fetchProducts crashed:", error, "URL:", url.toString());
    return [];
  }
}



export async function fetchProductBySlug(slug: string): Promise<{
  product: PublicProductDetails;
  related: PublicProductCard[];
} | null> {
  try {
    const res = await fetch(`${getPublicApiBaseUrl()}/api/products/${slug}`, {
  headers: { Accept: "application/json", "Cache-Control": "no-store" },
  cache: "no-store",
});
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return data?.data;
  } catch {
    return null;
  }
}


// ---------- Admin Product CMS APIs ----------

export type AdminProductCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AdminProduct = {
  id: number;
  product_category_id?: number | null;
  name: string;
  slug: string;
  short_title?: string | null;
  image_url?: string | null;
  sector_tag?: string | null;
  summary?: string | null;
  description?: string | null;
  key_features: string[]; 
  technical_specs: { label: string; value: string }[];
  gallery_images: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category?: { id: number; name: string; slug: string } | null;
  model_code?: string | null;
  educational_objectives: string[];
};

export async function adminListProductCategories(q?: string): Promise<AdminProductCategory[]> {
  const url = new URL("/api/admin/product-categories", window.location.origin);
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to load product categories");
  return data?.data || [];
}

export async function adminCreateProductCategory(payload: Partial<AdminProductCategory>) {
  const res = await fetch("/api/admin/product-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to create product category");
  return data;
}

export async function adminUpdateProductCategory(id: number, payload: Partial<AdminProductCategory>) {
  const res = await fetch(`/api/admin/product-categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update product category");
  return data;
}

export async function adminDeleteProductCategory(id: number) {
  const res = await fetch(`/api/admin/product-categories/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete product category");
  return data;
}

export async function adminListProducts(q?: string): Promise<AdminProduct[]> {
  const url = new URL("/api/admin/products", window.location.origin);
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to load products");
  return data?.data || [];
}

export async function adminCreateProduct(payload: Partial<AdminProduct>) {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to create product");
  return data;
}

export async function adminUpdateProduct(id: number, payload: Partial<AdminProduct>) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update product");
  return data;
}

export async function adminDeleteProduct(id: number) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete product");
  return data;
}

export async function adminUploadImage(file: File): Promise<{ ok: boolean; url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to upload image");
  return data;
}

// I think things are getting broken here


export type PublicProductCategoryTreeItem = {
  id: number;
  name: string;
  slug: string;
  children: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

export async function getProductCategoryTree(): Promise<PublicProductCategoryTreeItem[]> {
  const res = await fetch(`${getPublicApiBaseUrl()}/api/product-categories/tree`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 120 },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to load product category tree");
  return data?.items || [];
}