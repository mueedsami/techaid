import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../_utils";

function getLaravelBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}
function getAdminKey() {
  return process.env.CONTACT_ADMIN_KEY || "";
}

async function proxy(req: NextRequest, method: "GET" | "POST") {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const key = getAdminKey();
  if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

  const incoming = new URL(req.url);
  const target = new URL(`${getLaravelBaseUrl()}/api/admin/clients`);
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

export async function GET(req: NextRequest) {
  try {
    return await proxy(req, "GET");
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await proxy(req, "POST");
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}