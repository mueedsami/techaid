import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../_utils";

function getLaravelBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function getAdminKey() {
  return process.env.CONTACT_ADMIN_KEY || "";
}

export async function GET(req: NextRequest) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const adminKey = getAdminKey();
  if (!adminKey) {
    return NextResponse.json(
      { ok: false, message: "CONTACT_ADMIN_KEY is not configured on Next.js server." },
      { status: 500 }
    );
  }

  const target = new URL(`${getLaravelBaseUrl()}/api/admin/inquiries-export`);

  // Forward all incoming query params (q, status, etc.) to Laravel
  const incoming = new URL(req.url);
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  const res = await fetch(target.toString(), {
    method: "GET",
    headers: {
      Accept: "text/csv",
      "X-Admin-Key": adminKey,
    },
    cache: "no-store",
  });

  // If Laravel returns JSON (eg. 401/403/500), pass it through as JSON
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  }

  // Stream CSV through Next.js (keeps admin key out of URL/history)
  const headers = new Headers();
  const disp = res.headers.get("content-disposition");
  const ct = res.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  if (disp) headers.set("content-disposition", disp);
  headers.set("cache-control", "no-store");

  return new NextResponse(res.body, { status: res.status, headers });
}
