"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next") || "/admin/inquiries";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.message || "Login failed.");
        return;
      }

      router.replace(nextPath);
    } catch (e: any) {
      setError(e?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 md:p-8">
          <p className="text-sm text-white/60">Admin Access</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in to Admin Panel</h1>
          <p className="mt-2 text-sm text-white/65">
            Authorized access only. Contact your system administrator if you need credentials.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} autoComplete="off" className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/80">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}