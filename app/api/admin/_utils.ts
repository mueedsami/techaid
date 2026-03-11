import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
const PRODUCTION_LARAVEL_BASE_URL = "https://techaid.madestic.com";
const DEVELOPMENT_LARAVEL_BASE_URL = "http://localhost:8000";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getConfiguredLaravelBaseUrl() {
  const configured =
    process.env.LARAVEL_API_BASE_URL ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (configured && configured.trim()) {
    return normalizeBaseUrl(configured.trim());
  }

  return process.env.NODE_ENV === "development"
    ? DEVELOPMENT_LARAVEL_BASE_URL
    : PRODUCTION_LARAVEL_BASE_URL;
}

export function getCookieName() {
  return process.env.ADMIN_PANEL_COOKIE_NAME || "ta_admin_session";
}

export function getAdminPassword() {
  return process.env.ADMIN_PANEL_PASSWORD || "";
}

export function getLaravelBaseUrl(req?: NextRequest) {
  const configured = getConfiguredLaravelBaseUrl();

  try {
    const configuredUrl = new URL(configured);

    if (req) {
      const incomingUrl = new URL(req.url);
      if (configuredUrl.host === incomingUrl.host) {
        const fallbackUrl = new URL(PRODUCTION_LARAVEL_BASE_URL);
        if (fallbackUrl.host !== incomingUrl.host) {
          return normalizeBaseUrl(fallbackUrl.toString());
        }

        throw new Error(
          `Laravel base URL resolves to the current frontend host (${incomingUrl.host}). ` +
            `Set LARAVEL_API_BASE_URL or API_BASE_URL to the Laravel backend domain.`
        );
      }
    }

    if (
      process.env.NODE_ENV === "production" &&
      configuredUrl.host.toLowerCase().endsWith(".vercel.app")
    ) {
      return PRODUCTION_LARAVEL_BASE_URL;
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Invalid Laravel API base URL configuration.");
  }

  return configured;
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

  if (Date.now() - ts > MAX_AGE_MS) return false;

  const expected = sign(tsStr);

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