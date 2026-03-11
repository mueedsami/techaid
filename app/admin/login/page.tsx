"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
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
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 md:p-8 shadow-sm">
      <p className="text-sm text-gray-500">Admin Access</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">Sign in to Admin Panel</h1>
      <p className="mt-2 text-sm text-gray-500">
        Authorized access only. Contact your system administrator if you need credentials.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} autoComplete="off" className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
