import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../../_utils";

function getLaravelBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

function getAdminKey() {
  return process.env.CONTACT_ADMIN_KEY || "";
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdminSession(_req);
  if (unauthorized) return unauthorized;

  try {
    const adminKey = getAdminKey();
    if (!adminKey) {
      return NextResponse.json(
        { ok: false, message: "CONTACT_ADMIN_KEY is not configured on Next.js server." },
        { status: 500 }
      );
    }

    const { id } = await context.params;
    const res = await fetch(`${getLaravelBaseUrl()}/api/admin/inquiries/${id}`, {
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const body = await req.json();

    const baseUrl = getLaravelBaseUrl();
    const res = await fetch(`${baseUrl}/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify(body),
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