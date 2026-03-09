import { NextRequest, NextResponse } from "next/server";

const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours

function getCookieName() {
  return process.env.ADMIN_PANEL_COOKIE_NAME || "ta_admin_session";
}

function getAdminPassword() {
  return process.env.ADMIN_PANEL_PASSWORD || "";
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isValidSession(sessionValue?: string | null) {
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
  if (Date.now() - ts > MAX_AGE_MS) return false;

  const expected = await hmacSha256Hex(secret, tsStr);
  return timingSafeEqualHex(expected, sig);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow auth endpoint + login page
  if (pathname.startsWith("/api/admin/auth") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Only protect admin pages + admin API routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const cookieName = getCookieName();
  const sessionValue = req.cookies.get(cookieName)?.value;
  const ok = await isValidSession(sessionValue);

  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
