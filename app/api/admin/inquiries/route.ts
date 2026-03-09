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

  try {
    const adminKey = getAdminKey();
    if (!adminKey) {
      return NextResponse.json(
        { ok: false, message: "CONTACT_ADMIN_KEY is not configured on Next.js server." },
        { status: 500 }
      );
    }

    const incoming = new URL(req.url);
    const target = new URL(`${getLaravelBaseUrl()}/api/admin/inquiries`);
    incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

    const res = await fetch(target.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Admin-Key": adminKey,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Proxy request failed." },
      { status: 500 }
    );
  }
}