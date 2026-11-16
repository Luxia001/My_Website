"use client";

import { useActionState } from "react";
import { createProject } from "./actions";

const inputClass = "w-full rounded-xl border border-sky-300 bg-white px-3 py-2.5 font-normal text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function ProjectForm() {
  const [state, action, pending] = useActionState(createProject, { error: "" });

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium">
        Project name
        <input name="name" required maxLength={100} defaultValue={state.name} className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Description
        <textarea name="description" required maxLength={2000} rows={4} defaultValue={state.description} className={inputClass} />
      </label>
      {state.error && <p role="alert" className="text-sm text-rose-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60">
        {pending ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}
