"use client";

import { useActionState, useState, type ReactNode } from "react";
import { updateProject, type Operation } from "../actions";

export function ProjectAction({ id, operation, label, children, compact = false }: {
  id: string;
  operation: Operation;
  label: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(updateProject, {});
  const [copied, setCopied] = useState(false);
  const invite = state.invite;

  return (
    <form action={action} className={compact ? "grid gap-2" : "grid gap-4"}>
      <input type="hidden" name="_projectId" value={id} />
      <input type="hidden" name="_operation" value={operation} />
      {children}
      <button className={compact ? "btn btn-sm btn-outline" : "btn bg-sky-700 text-white hover:bg-sky-800"} disabled={pending}>
        {pending ? "กำลังบันทึก…" : label}
      </button>
      {state.error && <p role="alert" className="text-sm text-rose-700">{state.error}</p>}
      {invite && (
        <div className="grid gap-2 text-sm">
          <a className="break-all text-sky-700 underline" href={invite}>เปิดลิงก์เชิญ (ใช้ได้ 7 วัน)</a>
          <button type="button" className="btn btn-sm btn-outline" onClick={async () => {
            try { await navigator.clipboard.writeText(new URL(invite, window.location.origin).href); setCopied(true); }
            catch { window.prompt("คัดลอกลิงก์เชิญ", new URL(invite, window.location.origin).href); }
          }}>{copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</button>
        </div>
      )}
    </form>
  );
}
