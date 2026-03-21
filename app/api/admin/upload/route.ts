import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, getLaravelBaseUrl, getAdminKey } from "../_utils";

async function proxy(req: NextRequest, method: "POST") {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const key = getAdminKey();
  if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

  const target = new URL(`${getLaravelBaseUrl(req)}/api/admin/upload`);

  const buffer = await req.arrayBuffer();
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Admin-Key": key,
  };

  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const contentLength = req.headers.get("content-length");
  if (contentLength) headers["Content-Length"] = contentLength;

  const userAgent = req.headers.get("user-agent");
  if (userAgent) {
    headers["User-Agent"] = userAgent;
  } else {
    headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
  }

  const origin = req.headers.get("origin");
  if (origin) headers["Origin"] = origin;

  const referer = req.headers.get("referer");
  if (referer) headers["Referer"] = referer;

  const res = await fetch(target.toString(), {
    method,
    headers,
    body: buffer,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export const POST = (req: NextRequest) => proxy(req, "POST");
