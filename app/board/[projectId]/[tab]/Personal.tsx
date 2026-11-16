import type { ProjectCashTransaction } from "@prisma/client";
import type { ReactNode } from "react";
import { baht, thaiDate } from "@/lib/projects";
import { Field, input, MoneyInput, Panel } from "./Panels";
import { ProjectAction } from "./ProjectForms";

type Review = {
  pending: ProjectCashTransaction[];
  users: Map<string, string>;
  balances: { userId: string; amount: bigint }[];
};

export default function Personal({ id, bank, balance, rows, review, legacy }: {
  id: string;
  bank: { bank: string; lastFour: string } | null;
  balance: bigint;
  rows: ProjectCashTransaction[];
  review?: Review;
  legacy?: ReactNode;
}) {
  return (
    <div className="grid gap-5">
      <Panel title="บัญชีธนาคารของฉัน">
        {bank && <p className="mb-3 text-sm text-slate-600">{bank.bank} · •••• {bank.lastFour}</p>}
        <ProjectAction id={id} operation="bank" label="บันทึกบัญชี">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ธนาคาร"><input className={input} name="bank" required maxLength={80} defaultValue={bank?.bank} /></Field>
            <Field label="เลขบัญชี"><input className={input} name="number" required inputMode="numeric" autoComplete="off" maxLength={26} /></Field>
          </div>
        </ProjectAction>
      </Panel>
      <Panel title="ฝากเงิน">
        <p className="mb-4 text-sm text-slate-600">ยอดฝากคงเหลือ <strong>{baht(Number(balance))}</strong></p>
        <ProjectAction id={id} operation="deposit" label="ฝากเงิน">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ประเภท"><input className={input} value="ฝากเงิน" readOnly /></Field>
            <Field label="จำนวนเงิน (บาท)"><MoneyInput name="amount" /></Field>
          </div>
        </ProjectAction>
      </Panel>
      <Panel title="รายการฝากและถอนของฉัน">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="table min-w-max">
              <thead><tr><th>วันที่</th><th>ประเภท</th><th>จำนวนเงิน</th><th>สถานะ</th></tr></thead>
              <tbody>{rows.map((row) => (
                <tr key={row.id}>
                  <td>{thaiDate(row.createdAt)}</td>
                  <td>{row.type === "deposit" ? "ฝากเงิน" : "ถอนเงิน"}</td>
                  <td className="tabular-nums">{baht(row.amount)}</td>
                  <td><span className={`badge ${row.status === "completed" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
                    {row.status === "completed" ? "สำเร็จ" : "รอตรวจสอบ"}
                  </span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="text-sm text-slate-600">ยังไม่มีรายการฝากหรือถอน</p>}
      </Panel>
      {review && <>
        <Panel title="เงินฝากรอตรวจสอบ">
          {review.pending.length ? (
            <div className="overflow-x-auto">
              <table className="table min-w-max">
                <thead><tr><th>วันที่</th><th>สมาชิก</th><th>จำนวนเงิน</th><th>ดำเนินการ</th></tr></thead>
                <tbody>{review.pending.map((row) => (
                  <tr key={row.id}>
                    <td>{thaiDate(row.createdAt)}</td>
                    <td>{review.users.get(row.userId) ?? "อดีตสมาชิก"}</td>
                    <td>{baht(row.amount)}</td>
                    <td><ProjectAction id={id} operation="approveDeposit" label="อนุมัติ" compact>
                      <input type="hidden" name="transactionId" value={row.id} />
                    </ProjectAction></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : <p className="text-sm text-slate-600">ไม่มีเงินฝากรอตรวจสอบ</p>}
        </Panel>
        <Panel title="โอนคืนเงินสมาชิก">
          {review.balances.length ? (
            <>
              <p className="mb-4 text-sm text-slate-600">บันทึกรายการหลังจากโอนเงินจริงคืนให้สมาชิกแล้ว</p>
              <ProjectAction id={id} operation="refund" label="บันทึกการโอนคืน">
                <Field label="สมาชิก">
                  <select name="recipient" required defaultValue="" className="select w-full border border-sky-300 bg-white text-slate-900 focus-visible:outline-sky-600">
                    <option value="" disabled>เลือกสมาชิก</option>
                    {review.balances.map(({ userId, amount }) => (
                      <option key={userId} value={userId}>{review.users.get(userId) ?? `อดีตสมาชิก (${userId.slice(-6)})`} · คงเหลือ {baht(Number(amount))}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="ประเภท"><input className={input} value="ถอนเงิน" readOnly /></Field>
                  <Field label="จำนวนเงิน (บาท)"><MoneyInput name="amount" /></Field>
                </div>
              </ProjectAction>
            </>
          ) : <p className="text-sm text-slate-600">ยังไม่มีสมาชิกที่มียอดฝากคงเหลือสำหรับโอนคืน</p>}
        </Panel>
      </>}
      {legacy}
    </div>
  );
}
