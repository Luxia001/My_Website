import type { Prisma } from "@prisma/client";

export const portfolioPrices = {
  orderBy: [{ at: "asc" }, { id: "asc" }],
} satisfies Prisma.ProjectAsset$pricesArgs;

export type AssetWithPrices = Prisma.ProjectAssetGetPayload<{ include: { prices: true } }>;

const monthFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Bangkok", calendar: "gregory", year: "numeric", month: "2-digit",
});
export const portfolioMonth = (date: Date) => monthFormat.format(date);

export function portfolioReport(assets: AssetWithPrices[]) {
  const entries = assets.flatMap((asset) =>
    asset.prices.flatMap(({ at, amount, units }) => units == null ? [] : [{
      id: asset.id, at, units, value: Math.round(amount * units),
    }]),
  ).sort((a, b) => +a.at - +b.at);

  const holdings = new Map<string, (typeof entries)[number]>();
  const monthly = new Map<string, { month: string; value: number; at: Date }>();
  let total = 0;
  for (const entry of entries) {
    total += entry.value - (holdings.get(entry.id)?.value ?? 0);
    holdings.set(entry.id, entry);
    const month = portfolioMonth(entry.at);
    monthly.set(month, { month, value: total, at: entry.at });
  }
  const values = [...monthly.values()];
  return {
    total,
    holdings: [...holdings.values()],
    months: values.map((entry, index) => {
      const previous = values[index - 1]?.value;
      const difference = previous === undefined ? null : entry.value - previous;
      return { ...entry, difference, percent: difference !== null && previous ? difference / previous : null };
    }),
  };
}
