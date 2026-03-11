import { NextRequest, NextResponse } from "next/server";
import { getAdminKey, getLaravelBaseUrl, requireAdminSession } from "../_utils";

async function proxy(req: NextRequest, method: "GET" | "POST") {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  try {
    const key = getAdminKey();
    if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

    const incoming = new URL(req.url);
    const target = new URL(`${getLaravelBaseUrl(req)}/api/admin/product-categories`);
    incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

    const res = await fetch(target.toString(), {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Admin-Key": key,
      },
      body: method === "POST" ? JSON.stringify(await req.json()) : undefined,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}

export const GET = (req: NextRequest) => proxy(req, "GET");
export const POST = (req: NextRequest) => proxy(req, "POST");