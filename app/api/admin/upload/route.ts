import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, getLaravelBaseUrl, getAdminKey } from "../_utils";

async function proxy(req: NextRequest, method: "POST") {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const key = getAdminKey();
  if (!key) return NextResponse.json({ ok: false, message: "Missing CONTACT_ADMIN_KEY" }, { status: 500 });

  const target = new URL(`${getLaravelBaseUrl(req)}/api/admin/upload`);

  const formData = await req.formData();

  const res = await fetch(target.toString(), {
    method,
    headers: {
      Accept: "application/json",
      "X-Admin-Key": key,
    },
    body: formData,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export const POST = (req: NextRequest) => proxy(req, "POST");
