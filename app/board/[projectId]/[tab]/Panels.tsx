import type { Project, Investment } from "@prisma/client";
import type { AssetWithPrices } from "@/lib/portfolio";
import type { ReactNode } from "react";
import { baht, inputDate, thaiDate } from "@/lib/projects";
import { ProjectAction } from "./ProjectForms";

export const input = "input w-full border border-sky-300 bg-white text-slate-900 focus-visible:outline-sky-600";
const table = "table w-full min-w-max";
const labels = {
  approved: "อนุมัติแล้ว",
  pending: "รออนุมัติ",
  rejected: "ไม่อนุมัติ",
};

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function MoneyInput({
  name,
  value,
  required = true,
}: {
  name: string;
  value?: number | null;
  required?: boolean;
}) {
  return (
    <input
      className={input}
      name={name}
      type="number"
      min="0.01"
      max="20000000"
      step="0.01"
      defaultValue={value == null ? undefined : value / 100}
      required={required}
    />
  );
}

export function Settings({
  project,
  assets,
  canManage,
}: {
  project: Project;
  assets: AssetWithPrices[];
  canManage: boolean;
}) {
  const id = project.id;
  return (
    <div className="grid gap-5">
      {canManage && (
        <Panel title="ตั้งค่าแผนท่องเที่ยว">
          <ProjectAction
            id={id}
            operation="settings"
            label="บันทึกการตั้งค่า"
          >
            <Field label="ชื่อโปรเจกต์">
              <input
                className={input}
                name="name"
                required
                maxLength={100}
                defaultValue={project.name}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="วันเริ่มต้น">
                <input
                  className={input}
                  name="start"
                  type="date"
                  defaultValue={inputDate(project.startsAt)}
                />
              </Field>
              <Field label="วันสิ้นสุด">
                <input
                  className={input}
                  name="end"
                  type="date"
                  defaultValue={inputDate(project.endsAt)}
                />
              </Field>
            </div>
            <Field label="งบประมาณ (บาท)">
              <MoneyInput
                name="budget"
                value={project.budget}
                required={false}
              />
            </Field>
          </ProjectAction>
        </Panel>
      )}
      <Panel title="รายการลงทุน">
        {canManage && (
          <p className="mb-3 text-sm text-slate-600">
            บันทึกจำนวนหน่วยและราคาล่าสุดของแต่ละรายการเพื่ออัปเดตมูลค่าพอร์ตใน Dashboard
          </p>
        )}
        {assets.length === 0 && (
          <p className="text-sm text-slate-600">ยังไม่มีรายการลงทุน</p>
        )}
        <ul className="divide-y divide-slate-200">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="py-3"
            >
              {canManage ? (
                <ProjectAction
                  id={id}
                  operation="price"
                  label="บันทึกมูลค่าล่าสุด"
                  compact
                >
                  <input
                    type="hidden"
                    name="assetId"
                    value={asset.id}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="ชื่อรายการ">
                      <input
                        className={input}
                        name="name"
                        maxLength={100}
                        required
                        defaultValue={asset.name}
                      />
                    </Field>
                    <Field label="ราคาปัจจุบันต่อหน่วย (บาท)">
                      <MoneyInput
                        name="price"
                        value={asset.prices.at(-1)?.amount}
                      />
                    </Field>
                    <Field label="จำนวนหน่วยที่ถือ">
                      <input className={input} name="units" type="number" min="0" max="999999.999999" step="0.000001" defaultValue={asset.prices.at(-1)?.units ?? undefined} />
                    </Field>
                  </div>
                </ProjectAction>
              ) : (
                <div className="flex justify-between gap-4 text-sm">
                  <span>{asset.name}</span>
                  <span>{baht(asset.prices.at(-1)?.amount ?? 0)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
        {canManage && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <ProjectAction
              id={id}
              operation="asset"
              label="เพิ่มรายการลงทุน"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="ชื่อรายการใหม่">
                  <input
                    className={input}
                    name="name"
                    maxLength={100}
                    required
                  />
                </Field>
                <Field label="ราคาต่อหน่วย (บาท)">
                  <MoneyInput name="price" />
                </Field>
                <Field label="จำนวนหน่วยที่ถือ">
                  <input className={input} name="units" type="number" min="0" max="999999.999999" step="0.000001" required />
                </Field>
              </div>
            </ProjectAction>
          </div>
        )}
      </Panel>
    </div>
  );
}

export function LegacyInvestments({
  id,
  assets,
  rows,
  pending,
}: {
  id: string;
  assets: AssetWithPrices[];
  rows: Investment[];
  pending?: { rows: Investment[]; users: Map<string, string> };
}) {
  const names = new Map(assets.map((asset) => [asset.id, asset.name]));
  return (
    <div className="grid gap-5">
      <Panel title="ประวัติการลงทุนเดิมของฉัน">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className={table}>
              <thead>
                <tr>
                  <th>วันที่ส่ง</th>
                  <th>รายการ</th>
                  <th>ยอดลงทุน</th>
                  <th>ราคาซื้อ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{thaiDate(row.createdAt)}</td>
                    <td>{names.get(row.assetId) ?? "—"}</td>
                    <td>{baht(row.cost)}</td>
                    <td>{baht(row.unitPrice)}</td>
                    <td>{labels[row.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-600">ยังไม่มีรายการลงทุน</p>
        )}
      </Panel>
      {pending && (
        <Panel title="รายการลงทุนเดิมที่รออนุมัติ">
          {pending.rows.length ? (
            <div className="overflow-x-auto">
              <table className={table}>
                <thead>
                  <tr>
                    <th>สมาชิก</th>
                    <th>รายการ</th>
                    <th>ยอดลงทุน</th>
                    <th>ราคาซื้อ</th>
                    <th>การอนุมัติ</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.rows.map((row) => (
                    <tr key={row.id}>
                      <td>{pending.users.get(row.userId) ?? "อดีตสมาชิก"}</td>
                      <td>{names.get(row.assetId) ?? "—"}</td>
                      <td>{baht(row.cost)}</td>
                      <td>{baht(row.unitPrice)}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {(["approved", "rejected"] as const).map(
                            (decision) => (
                              <ProjectAction
                                key={decision}
                                id={id}
                                operation="review"
                                label={
                                  decision === "approved"
                                    ? "อนุมัติ"
                                    : "ไม่อนุมัติ"
                                }
                                compact
                              >
                                <input
                                  type="hidden"
                                  name="investmentId"
                                  value={row.id}
                                />
                                <input
                                  type="hidden"
                                  name="decision"
                                  value={decision}
                                />
                              </ProjectAction>
                            ),
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-600">ไม่มีรายการรออนุมัติ</p>
          )}
        </Panel>
      )}
    </div>
  );
}

export function Members({
  id,
  role,
  owner,
  members,
  users,
}: {
  id: string;
  role: "owner" | "admin" | "member";
  owner: string;
  members: { id: string; userId: string; role: "admin" | "member" }[];
  users: Map<string, string>;
}) {
  return (
    <div className="grid gap-5">
      {role !== "member" && (
        <Panel title="เชิญสมาชิก">
          <p className="mb-4 text-sm text-slate-600">
            ส่งลิงก์ให้คนที่ต้องการเชิญ
            ลิงก์เดิมจะหมดอายุเมื่อสร้างลิงก์ใหม่หรือลบสมาชิก
          </p>
          <ProjectAction
            id={id}
            operation="invite"
            label="สร้างลิงก์เชิญ"
          />
        </Panel>
      )}
      <Panel title="สมาชิกโปรเจกต์">
        <ul className="divide-y divide-slate-200">
          <li className="flex justify-between gap-3 py-3">
            <span>{users.get(owner) ?? "เจ้าของโปรเจกต์"}</span>
            <span className="badge badge-info">owner</span>
          </li>
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-2">
                <span>{users.get(member.userId) ?? "สมาชิก"}</span>
                <span className="badge badge-outline">{member.role}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role === "owner" && (
                  <ProjectAction
                    id={id}
                    operation="role"
                    label={
                      member.role === "member"
                        ? "ตั้งเป็น admin"
                        : "เปลี่ยนเป็น member"
                    }
                    compact
                  >
                    <input
                      type="hidden"
                      name="membershipId"
                      value={member.id}
                    />
                    <input
                      type="hidden"
                      name="role"
                      value={member.role === "member" ? "admin" : "member"}
                    />
                  </ProjectAction>
                )}
                {(role === "owner" ||
                  (role === "admin" && member.role === "member")) && (
                  <ProjectAction
                    id={id}
                    operation="remove"
                    label="ลบสมาชิก"
                    compact
                  >
                    <input
                      type="hidden"
                      name="membershipId"
                      value={member.id}
                    />
                  </ProjectAction>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
