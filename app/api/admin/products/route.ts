import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../_utils";

const getLaravelBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const getAdminKey = () => process.env.CONTACT_ADMIN_KEY || "";

async function proxy(req: NextRequest, method: "GET" | "POST") {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const key = getAdminKey();
  if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

  const incoming = new URL(req.url);
  const target = new URL(`${getLaravelBaseUrl()}/api/admin/products`);
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
}

export const GET = (req: NextRequest) => proxy(req, "GET");
export const POST = (req: NextRequest) => proxy(req, "POST");