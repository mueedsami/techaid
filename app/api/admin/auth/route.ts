import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getCookieName() {
  return process.env.ADMIN_PANEL_COOKIE_NAME || "ta_admin_session";
}

function getAdminPassword() {
  return process.env.ADMIN_PANEL_PASSWORD || "";
}

function sign(value: string) {
  // simple HMAC signature using password as secret (good enough for this phase)
  const secret = getAdminPassword();
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function makeSessionValue() {
  const ts = Date.now().toString();
  const sig = sign(ts);
  return `${ts}.${sig}`;
}

function isSecureEnv() {
  return process.env.NODE_ENV === "production";
}

export async function POST(req: NextRequest) {
  try {
    const { action, password } = await req.json().catch(() => ({}));

    const cookieName = getCookieName();
    const adminPassword = getAdminPassword();

    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, message: "ADMIN_PANEL_PASSWORD is not configured." },
        { status: 500 }
      );
    }

    // LOGIN
    if (action === "login") {
      if (!password || password !== adminPassword) {
        return NextResponse.json(
          { ok: false, message: "Invalid password." },
          { status: 401 }
        );
      }

      const sessionValue = makeSessionValue();
      const res = NextResponse.json({ ok: true, message: "Logged in." });

      res.cookies.set(cookieName, sessionValue, {
        httpOnly: true,
        secure: isSecureEnv(),
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
      });

      return res;
    }

    // LOGOUT
    if (action === "logout") {
      const res = NextResponse.json({ ok: true, message: "Logged out." });
      res.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: isSecureEnv(),
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    return NextResponse.json(
      { ok: false, message: "Invalid action." },
      { status: 400 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Auth request failed." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookieName = getCookieName();
  const adminPassword = getAdminPassword();

  // If password isn't configured, we can't validate sessions.
  if (!adminPassword) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  const sessionValue = req.cookies.get(cookieName)?.value || "";
  const parts = sessionValue.split(".");
  if (parts.length !== 2) return NextResponse.json({ ok: true, authenticated: false });

  const [tsStr, sig] = parts;
  if (!/^\d+$/.test(tsStr)) return NextResponse.json({ ok: true, authenticated: false });

  const ts = Number(tsStr);
  const maxAgeMs = 12 * 60 * 60 * 1000;
  if (!Number.isFinite(ts) || Date.now() - ts > maxAgeMs) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  const expected = sign(tsStr);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return NextResponse.json({ ok: true, authenticated: false });

  const authenticated = crypto.timingSafeEqual(a, b);
  return NextResponse.json({ ok: true, authenticated });
}

