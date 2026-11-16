import type { Investment, ProjectAsset, ProjectCashTransaction } from "@prisma/client";
import { baht, thaiDate } from "@/lib/projects";
import { portfolioReport } from "@/lib/portfolio";

const unitsFormat = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 6 });
const monthLabel = new Intl.DateTimeFormat("th-TH", {
  timeZone: "Asia/Bangkok", month: "long", year: "numeric",
});
const changePercent = new Intl.NumberFormat("th-TH", {
  style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 2,
});

function Portfolio({ assets, report }: { assets: ProjectAsset[]; report: ReturnType<typeof portfolioReport> }) {
  const { total, holdings, months } = report;
  const byAsset = new Map(holdings.map((entry) => [entry.id, entry]));
  const latest = months.at(-1);
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <header>
        <h2 className="font-semibold">พอร์ตลงทุนที่ผู้ดูแลบันทึก</h2>
        {latest && <>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-sky-900">{baht(total)}</p>
          <p className="mt-1 text-sm text-slate-600">อัปเดตล่าสุด {thaiDate(latest.at)}</p>
        </>}
      </header>
      {assets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table min-w-max tabular-nums">
            <caption className="pb-2 text-left font-medium">รายการลงทุนและมูลค่าปัจจุบัน</caption>
            <thead><tr><th>รายการ</th><th>จำนวนหน่วย</th><th>ราคาต่อหน่วย</th><th>มูลค่ารวม</th><th>อัปเดตล่าสุด</th></tr></thead>
            <tbody>{assets.map((asset) => {
              const entry = byAsset.get(asset.id);
              const price = asset.prices.at(-1);
              return (
                <tr key={asset.id}>
                  <td>{asset.name}</td><td>{entry ? unitsFormat.format(entry.units) : "ยังไม่ระบุ"}</td>
                  <td>{price ? baht(price.amount) : "—"}</td>
                  <td>{entry ? baht(entry.value) : "—"}</td><td>{price ? thaiDate(price.at) : "—"}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      {!holdings.length && <p className="text-sm text-slate-600">มูลค่าพอร์ตจะแสดงเมื่อผู้ดูแลบันทึกจำนวนหน่วยและราคาในหน้าตั้งค่าโปรเจกต์</p>}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="font-semibold">ประวัติมูลค่าพอร์ตรายเดือน</h3>
        {months.length ? (
          <>
            <p className="mt-1 text-sm text-slate-600">ใช้ยอดล่าสุดของแต่ละเดือน เทียบกับเดือนที่มีการบันทึกครั้งก่อน</p>
            <ValueChart points={months.slice(-24).map((row) => ({ day: +row.at, value: row.value }))} />
            <div className="overflow-x-auto">
              <table aria-label="ประวัติมูลค่าพอร์ตรายเดือน" className="table min-w-max tabular-nums">
                <thead><tr><th>เดือน</th><th>วันที่บันทึกล่าสุด</th><th>มูลค่าพอร์ต</th><th>เปลี่ยนแปลง</th><th>เปลี่ยนแปลง (%)</th></tr></thead>
                <tbody>{months.toReversed().map((row) => (
                  <tr key={row.month}>
                    <td>{monthLabel.format(row.at)}</td><td>{thaiDate(row.at)}</td><td>{baht(row.value)}</td>
                    <td className={row.difference == null || row.difference === 0 ? "" : row.difference > 0 ? "text-emerald-800" : "text-rose-800"}>
                      {row.difference == null ? "—" : `${row.difference > 0 ? "+" : ""}${baht(row.difference)}`}
                    </td>
                    <td>{row.percent == null ? "—" : changePercent.format(row.percent)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        ) : <p className="mt-2 text-sm text-slate-600">ยังไม่มีประวัติมูลค่าพอร์ต</p>}
      </div>
    </section>
  );
}

function valueAt(rows: Investment[], assets: Map<string, ProjectAsset>, at: number) {
  const prices = new Map([...assets].map(([id, asset]) =>
    [id, asset.prices.findLast((price) => +price.at <= at)?.amount] as const,
  ));
  return rows.reduce((total, row) => {
    if (+(row.reviewedAt ?? row.createdAt) > at) return total;
    return total + Math.round(row.cost * ((prices.get(row.assetId) ?? row.unitPrice) / row.unitPrice));
  }, 0);
}

function ValueChart({ points }: { points: { day: number; value: number }[] }) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const start = points[0].day;
  const span = points.at(-1)!.day - start;
  const chart = points.map((point) => ({
    x: 20 + (span === 0 ? 260 : (point.day - start) / span * 520),
    y: 156 - (point.value / max) * 130,
  }));
  return (
    <figure>
      <div className="mt-3 flex justify-between gap-3 text-xs text-slate-600">
        <span>ช่วงมูลค่า {baht(0)}–{baht(max)}</span><span>ล่าสุด {baht(points.at(-1)!.value)}</span>
      </div>
      <svg className="h-48 w-full" viewBox="0 0 560 174" role="img" aria-label={`มูลค่าการลงทุนล่าสุด ${baht(points.at(-1)?.value ?? 0)}`}>
        {[26, 91, 156].map((y) => <line key={y} x1="20" y1={y} x2="540" y2={y} stroke="#e2e8f0" />)}
        <polyline points={chart.map(({ x, y }) => `${x},${y}`).join(" ")} fill="none" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round" />
        {chart.length === 1 && <circle cx={chart[0].x} cy={chart[0].y} r="5" fill="#0369a1" />}
      </svg>
      <figcaption className="flex justify-between text-xs text-slate-500">
        <span>{thaiDate(new Date(points[0].day))}</span>
        <span>{points.length > 1 && thaiDate(new Date(points.at(-1)!.day))}</span>
      </figcaption>
    </figure>
  );
}

export default function Overview({ rows, assets, users, cash, budget, startsAt, endsAt }: {
  rows: Investment[]; assets: ProjectAsset[]; users: Map<string, string>; cash: ProjectCashTransaction[];
  budget: number | null; startsAt: Date | null; endsAt: Date | null;
}) {
  const report = portfolioReport(assets);
  const principal = cash.reduce((total, row) =>
    row.type === "deposit" && row.status === "completed" ? total + row.amount : total, 0);
  const returnRate = principal > 0 && report.months.length
    ? (report.total - principal) / principal
    : null;
  const returnColor = returnRate == null || returnRate === 0 ? "text-slate-900"
    : returnRate > 0 ? "text-green-700" : "text-red-700";
  const assetMap = new Map(assets.map((asset) => [asset.id, asset]));
  const movements = cash.map((row) => ({
    at: +(row.completedAt ?? row.createdAt),
    userId: row.userId,
    amount: row.type === "deposit" ? row.amount : -row.amount,
  })).sort((a, b) => a.at - b.at);
  const cashBalance = movements.reduce((total, row) => total + row.amount, 0);
  const cost = rows.reduce((total, row) => total + row.cost, cashBalance);
  const value = valueAt(rows, assetMap, Infinity) + cashBalance;
  const approvals = rows.map((row) => +(row.reviewedAt ?? row.createdAt));
  const events = [...approvals, ...movements.map((row) => row.at)];
  const first = events.reduce((earliest, at) => Math.min(earliest, at), Infinity);
  const assetIds = new Set(rows.map((row) => row.assetId));
  const timeline = [...new Set([...events, ...assets.filter((asset) => assetIds.has(asset.id))
    .flatMap((asset) => asset.prices.map((price) => +price.at))])]
    .filter((at) => at >= first).sort((a, b) => a - b);
  let amount = 0;
  let movementIndex = 0;
  const points: { day: number; value: number }[] = [];
  for (const day of timeline.slice(-60)) {
    while (movementIndex < movements.length && movements[movementIndex].at <= day) {
      amount += movements[movementIndex++].amount;
    }
    points.push({ day, value: valueAt(rows, assetMap, day) + amount });
  }
  const contributions = new Map<string, number>();
  for (const row of rows) contributions.set(row.userId, (contributions.get(row.userId) ?? 0) + row.cost);
  for (const row of movements) contributions.set(row.userId, (contributions.get(row.userId) ?? 0) + row.amount);
  const progress = budget ? Math.round(value / budget * 100) : 0;

  return (
    <div className="grid gap-5">
      <Portfolio assets={assets} report={report} />
      <div className="grid gap-3 sm:grid-cols-3">
        {[["เงินฝากและมูลค่ารายการลงทุนเดิม", value], ["เงินฝากสุทธิและต้นทุนลงทุนเดิม", cost]].map(([label, total]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">{label}</p>
            <p className={`mt-1 break-words text-2xl font-semibold tabular-nums ${Number(total) < 0 ? "text-rose-700" : ""}`}>{baht(Number(total))}</p>
          </article>
        ))}
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">กำไร / ขาดทุนเทียบเงินฝากต้น</p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${returnColor}`}>
            {returnRate === null ? "—" : changePercent.format(returnRate)}
          </p>
          <p className="mt-1 text-sm text-slate-600">เงินฝากต้นที่อนุมัติแล้ว {baht(principal)}</p>
        </article>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">เป้าหมายท่องเที่ยว</h2>
        <p className="mt-2 text-sm text-slate-600">{startsAt ? thaiDate(startsAt) : "ยังไม่ระบุวันเริ่ม"} – {endsAt ? thaiDate(endsAt) : "ยังไม่ระบุวันสิ้นสุด"}</p>
        {budget ? (
          <div className="mt-3">
            <p className="text-sm">{baht(value)} / {baht(budget)} · {progress}%</p>
            <progress aria-label="ความคืบหน้าตามเป้าหมาย" className="progress progress-info mt-2" value={Math.min(progress, 100)} max={100} />
          </div>
        ) : <p className="mt-2 text-sm text-slate-600">ยังไม่ได้กำหนดงบประมาณ</p>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">กราฟเงินฝากและมูลค่ารายการลงทุนเดิม</h2>
        {points.length ? <ValueChart points={points} /> : <p className="mt-2 text-sm text-slate-600">กราฟจะแสดงเมื่อมีเงินฝากที่อนุมัติแล้วหรือมีรายการลงทุน</p>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">ยอดเงินฝากสุทธิและต้นทุนของสมาชิก</h2>
        <ul className="mt-2 divide-y divide-slate-100">
          {[...new Set([...users.keys(), ...contributions.keys()])].map((id) => (
            <li className="flex justify-between gap-4 py-2 text-sm" key={id}>
              <span>{users.get(id) ?? "อดีตสมาชิก"}</span><span className="tabular-nums">{baht(contributions.get(id) ?? 0)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
