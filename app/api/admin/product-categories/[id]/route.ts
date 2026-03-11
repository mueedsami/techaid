import { NextRequest, NextResponse } from "next/server";
import { getAdminKey, getLaravelBaseUrl, requireAdminSession } from "../../_utils";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  try {
    const key = getAdminKey();
    if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

    const { id } = await ctx.params;
    const res = await fetch(`${getLaravelBaseUrl(req)}/api/admin/product-categories/${id}`, {
      method: "PATCH",
      headers: { Accept: "application/json", "Content-Type": "application/json", "X-Admin-Key": key },
      body: JSON.stringify(await req.json()),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  try {
    const key = getAdminKey();
    if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

    const { id } = await ctx.params;
    const res = await fetch(`${getLaravelBaseUrl(req)}/api/admin/product-categories/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json", "X-Admin-Key": key },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Proxy failed" }, { status: 500 });
  }
}