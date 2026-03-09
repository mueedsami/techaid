import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "../../_utils";

function getLaravelBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}
function getAdminKey() {
  return process.env.CONTACT_ADMIN_KEY || "";
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  try {
    const key = getAdminKey();
    if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

    const { id } = await context.params;
    const res = await fetch(`${getLaravelBaseUrl()}/api/admin/clients/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Admin-Key": key,
      },
      body: JSON.stringify(await req.json()),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdminSession(_req);
  if (unauthorized) return unauthorized;

  try {
    const key = getAdminKey();
    if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

    const { id } = await context.params;
    const res = await fetch(`${getLaravelBaseUrl()}/api/admin/clients/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-Admin-Key": key,
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}