import { createHash } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const projectTabs = ["overview", "personal", "settings", "members"] as const;
export type ProjectTab = (typeof projectTabs)[number];

export function projectPath(id: string, tab: ProjectTab = "overview") {
  return `/board/${id}/${tab}`;
}

export function validRecordId(value: string) {
  return /^(?:[a-f0-9]{24}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(value);
}

export const requireProject = cache(async (id: string) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!validRecordId(id)) notFound();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const membership = project.ownerId === user.id ? null : await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: id, userId: user.id } },
  });
  const role = project.ownerId === user.id ? ("owner" as const) : membership?.role;
  if (!role) notFound();
  return { user, project, role, canManage: role !== "member" };
});

export function inviteHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function validInvite(token: unknown): token is string {
  return typeof token === "string" && /^[a-zA-Z0-9_-]{43}$/.test(token);
}

const currency = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });
export const baht = (satang: number) => currency.format(satang / 100);

export function toSatang(value: string) {
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return amount > 0 && amount <= 2_000_000_000 ? amount : null;
}

export const inputDate = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";
export const thaiDate = (date: Date) => date.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" });

