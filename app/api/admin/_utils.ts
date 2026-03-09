import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours

export function getCookieName() {
  return process.env.ADMIN_PANEL_COOKIE_NAME || "ta_admin_session";
}

export function getAdminPassword() {
  return process.env.ADMIN_PANEL_PASSWORD || "";
}

export function getLaravelBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

export function getAdminKey() {
  return process.env.CONTACT_ADMIN_KEY || "";
}

function sign(value: string) {
  const secret = getAdminPassword();
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function isValidAdminSession(sessionValue?: string | null) {
  const secret = getAdminPassword();
  if (!secret) return false;
  if (!sessionValue) return false;

  const parts = sessionValue.split(".");
  if (parts.length !== 2) return false;

  const [tsStr, sig] = parts;
  if (!tsStr || !sig) return false;
  if (!/^\d+$/.test(tsStr)) return false;

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;

  // expiry
  if (Date.now() - ts > MAX_AGE_MS) return false;

  const expected = sign(tsStr);

  // timing-safe compare
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function requireAdminSession(req: NextRequest) {
  const cookieName = getCookieName();
  const session = req.cookies.get(cookieName)?.value;
  if (!isValidAdminSession(session)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }
  return null;
}
