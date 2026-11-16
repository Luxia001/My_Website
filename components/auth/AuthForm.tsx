"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/auth/actions";

const inputClass =
  "w-full rounded-lg border border-sky-300 bg-white px-3.5 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

export default function AuthForm({
  mode,
  registered = false,
  invite,
}: {
  mode: "login" | "signup";
  registered?: boolean;
  invite?: string;
}) {
  const signingUp = mode === "signup";
  const [state, submit, pending] = useActionState(signingUp ? signup : login, { error: "" });

  return (
    <main className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {signingUp ? "Create an account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {signingUp ? "Already have an account? " : "New here? "}
          <Link className="font-semibold text-sky-700 underline underline-offset-4" href={`${signingUp ? "/login" : "/signup"}${invite ? `?invite=${invite}` : ""}`}>
            {signingUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {registered && !state.error && (
          <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            Account created. Sign in with your email and password.
          </p>
        )}
        <form action={submit} className="mt-6 grid gap-4">
          {invite && <input type="hidden" name="invite" value={invite} />}
          {signingUp && (
            <label className="grid gap-1.5 text-sm font-medium">
              Name
              <input className={inputClass} name="name" autoComplete="name" maxLength={80} defaultValue={state.name} required />
            </label>
          )}
          <label className="grid gap-1.5 text-sm font-medium">
            Email
            <input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} defaultValue={state.email} required />
          </label>
          {signingUp && (
            <label className="grid gap-1.5 text-sm font-medium">
              Phone (optional)
              <input className={inputClass} name="phone" type="tel" autoComplete="tel" maxLength={32} defaultValue={state.phone} />
            </label>
          )}
          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <input
              className={inputClass}
              name="password"
              type="password"
              autoComplete={signingUp ? "new-password" : "current-password"}
              aria-describedby={signingUp ? "password-hint" : undefined}
              minLength={signingUp ? 8 : undefined}
              maxLength={128}
              required
            />
            {signingUp && <span id="password-hint" className="font-normal text-slate-600">Use at least 8 characters.</span>}
          </label>
          {state.error && (
            <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{state.error}</p>
          )}
          <button type="submit" disabled={pending} className="mt-1 rounded-lg bg-sky-700 px-4 py-2.5 font-semibold text-white hover:bg-sky-800 disabled:opacity-60">
            {pending ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
