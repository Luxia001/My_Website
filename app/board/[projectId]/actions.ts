"use server";

import { createCipheriv, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { inviteHash, objectId, projectPath, projectTabs, requireProject, toSatang } from "@/lib/projects";
import { portfolioMonth } from "@/lib/portfolio";

type ActionState = { error?: string; invite?: string };
export type Operation = "settings" | "asset" | "price" | "bank" | "deposit" | "approveDeposit" | "refund" | "review" | "invite" | "remove" | "role";

const managerOperations = new Set<Operation>(["settings", "asset", "price", "approveDeposit", "refund", "review", "invite", "remove", "role"]);
const denied = { error: "คุณไม่มีสิทธิ์ดำเนินการนี้" };

function read(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value);
  return Number.isFinite(+date) && date.toISOString().startsWith(value) ? date : null;
}

function parseUnits(value: string) {
  return /^\d{1,6}(?:\.\d{1,6})?$/.test(value) ? Number(value) : null;
}

function encryptAccount(number: string, context: string) {
  const key = process.env.PROJECT_BANK_KEY;
  if (!key || !/^[a-f0-9]{64}$/i.test(key)) throw new Error("Missing bank encryption key");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
  cipher.setAAD(Buffer.from(context));
  const ciphertext = Buffer.concat([cipher.update(number, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64url")).join(".");
}

export async function updateProject(
  _state: ActionState, form: FormData,
): Promise<ActionState> {
  const projectId = read(form, "_projectId");
  const operation = read(form, "_operation") as Operation;
  const { user, role, canManage } = await requireProject(projectId);
  if (managerOperations.has(operation) && !canManage) return denied;
  const name = read(form, "name");
  const price = toSatang(read(form, "price"));
  const assetId = read(form, "assetId");

  try {
    switch (operation) {
      case "settings": {
        const start = read(form, "start");
        const end = read(form, "end");
        const startsAt = parseDate(start);
        const endsAt = parseDate(end);
        const budgetText = read(form, "budget");
        const budget = toSatang(budgetText);
        if (!name || name.length > 100 || (start && !startsAt) || (end && !endsAt) ||
          (startsAt && endsAt && startsAt > endsAt) || (budgetText && budget === null)) {
          return { error: "ตรวจสอบชื่อ งบประมาณ และช่วงวันที่อีกครั้ง" };
        }
        await prisma.project.update({ where: { id: projectId }, data: { name, startsAt, endsAt, budget } });
        break;
      }
      case "asset": {
        const units = parseUnits(read(form, "units"));
        if (!name || name.length > 100 || price === null || units === null) {
          return { error: "ระบุชื่อ ราคาต่อหน่วย และจำนวนหน่วยที่ถูกต้อง" };
        }
        await prisma.projectAsset.create({ data: { projectId, name, prices: [{ amount: price, units, at: new Date() }] } });
        break;
      }
      case "price": {
        if (!objectId(assetId) || price === null || !name || name.length > 100) return { error: "ตรวจสอบชื่อและราคาต่อหน่วย" };
        const asset = await prisma.projectAsset.findFirst({ where: { id: assetId, projectId } });
        if (!asset) return { error: "ไม่พบรายการลงทุน" };
        const previous = asset.prices.at(-1);
        const unitsField = read(form, "units");
        const units = unitsField ? parseUnits(unitsField) : previous?.units ?? null;
        if (unitsField && units === null) return { error: "ตรวจสอบจำนวนหน่วยที่ถือ" };
        const at = new Date();
        const record = !previous || previous.amount !== price || previous.units !== units
          || (units !== null && portfolioMonth(previous.at) !== portfolioMonth(at));
        await prisma.projectAsset.update({
          where: { id: assetId, projectId },
          data: { name, ...(record ? { prices: { push: { amount: price, units, at } } } : {}) },
        });
        break;
      }
      case "bank": {
        const bank = read(form, "bank");
        const number = read(form, "number").replace(/[ -]/g, "");
        if (!bank || bank.length > 80 || !/^\d{6,20}$/.test(number)) return { error: "กรอกชื่อธนาคารและเลขบัญชี 6–20 หลัก" };
        const details = { bank, encrypted: encryptAccount(number, `${projectId}:${user.id}`), lastFour: number.slice(-4) };
        await prisma.projectBankAccount.upsert({
          where: { projectId_userId: { projectId, userId: user.id } },
          create: { projectId, userId: user.id, ...details },
          update: details,
        });
        break;
      }
      case "deposit": {
        const amount = toSatang(read(form, "amount"));
        if (amount === null) return { error: "กรอกจำนวนเงินฝากให้ถูกต้อง" };
        await prisma.projectCashTransaction.create({
          data: { projectId, userId: user.id, amount, type: "deposit", status: "pending" },
        });
        break;
      }
      case "approveDeposit": {
        const transactionId = read(form, "transactionId");
        if (!objectId(transactionId)) return { error: "รายการฝากเงินไม่ถูกต้อง" };
        const approved = await prisma.$transaction(async (tx) => {
          const where = { id: transactionId, projectId, type: "deposit" as const, status: "pending" as const };
          const deposit = await tx.projectCashTransaction.findFirst({ where });
          if (!deposit) return false;
          const updated = await tx.projectCashTransaction.updateMany({
            where, data: { status: "completed", completedAt: new Date(), processedBy: user.id },
          });
          if (!updated.count) return false;
          const amount = BigInt(deposit.amount);
          await tx.projectCashBalance.upsert({
            where: { projectId_userId: { projectId, userId: deposit.userId } },
            create: { projectId, userId: deposit.userId, amount },
            update: { amount: { increment: amount } },
          });
          return true;
        });
        if (!approved) return { error: "ไม่พบรายการฝากเงินที่รอตรวจสอบ" };
        break;
      }
      case "refund": {
        const recipient = read(form, "recipient");
        const amount = toSatang(read(form, "amount"));
        if (!objectId(recipient) || amount === null) return { error: "เลือกสมาชิกและกรอกจำนวนเงินให้ถูกต้อง" };
        const completed = await prisma.$transaction(async (tx) => {
          const balance = await tx.projectCashBalance.updateMany({
            where: { projectId, userId: recipient, amount: { gte: BigInt(amount) } },
            data: { amount: { decrement: BigInt(amount) } },
          });
          if (!balance.count) return false;
          await tx.projectCashTransaction.create({
            data: {
              projectId, userId: recipient, amount, type: "withdrawal", status: "completed",
              completedAt: new Date(), processedBy: user.id,
            },
          });
          return true;
        });
        if (!completed) return { error: "ไม่พบสมาชิกหรือจำนวนเงินเกินยอดฝากคงเหลือ" };
        break;
      }
      case "review": {
        const id = read(form, "investmentId");
        const status = read(form, "decision");
        if (!objectId(id) || (status !== "approved" && status !== "rejected")) return { error: "รายการอนุมัติไม่ถูกต้อง" };
        if (!(await prisma.investment.updateMany({
          where: { id, projectId, status: "pending" },
          data: { status, reviewerId: user.id, reviewedAt: new Date() },
        })).count) return { error: "รายการนี้ได้รับการตรวจแล้วหรือไม่มีอยู่" };
        break;
      }
      case "invite": {
        const token = randomBytes(32).toString("base64url");
        const fields = { tokenHash: inviteHash(token), expiresAt: new Date(Date.now() + 7 * 86_400_000) };
        await prisma.projectInvite.upsert({ where: { projectId }, update: fields, create: { projectId, ...fields } });
        return { invite: `/invite/${token}` };
      }
      case "remove":
      case "role": {
        const id = read(form, "membershipId");
        if (!objectId(id) || (operation === "role" && role !== "owner")) return denied;
        if (operation === "remove") {
          await prisma.$transaction(async (tx) => {
            const removed = await tx.projectMember.deleteMany({
              where: { id, projectId, ...(role === "admin" ? { role: "member" as const } : {}) },
            });
            if (removed.count) await tx.projectInvite.deleteMany({ where: { projectId } });
          });
        } else {
          const updatedRole = read(form, "role");
          if (updatedRole !== "admin" && updatedRole !== "member") return denied;
          await prisma.projectMember.updateMany({ where: { id, projectId }, data: { role: updatedRole } });
        }
        break;
      }
      default:
        return denied;
    }
  } catch {
    return { error: "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  for (const tab of projectTabs) revalidatePath(projectPath(projectId, tab));
  if (operation === "settings" || operation === "remove" || operation === "role") revalidatePath("/board");
  const tab = operation === "settings" || operation === "asset" || operation === "price" ? "settings"
    : operation === "remove" || operation === "role" ? "members" : "personal";
  redirect(projectPath(projectId, tab));
}
