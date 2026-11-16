import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const deriveKey = promisify(scrypt);
const sessionCookie = "portfolio_session";
const sessionSeconds = 60 * 60 * 24 * 7;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await deriveKey(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, hash?: string) {
  const [salt, key] = hash?.split(":") ?? [];
  const actual = (await deriveKey(
    password,
    salt ?? "0".repeat(32),
    64,
  )) as Buffer;
  const expected = Buffer.from(key ?? "", "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  const previous = cookieStore.get(sessionCookie)?.value;
  if (previous) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashToken(previous) },
    });
  }

  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + sessionSeconds * 1000),
    },
  });
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionSeconds,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token), expiresAt: { gt: new Date() } },
    select: { user: { select: { id: true, user: true, email: true } } },
  });
  return session?.user ?? null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    cookieStore.delete(sessionCookie);
  }
}
