"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validInvite } from "@/lib/projects";

export type AuthState = {
  error: string;
  name?: string;
  email?: string;
  phone?: string;
};

const unavailable = "ไอ่เหรี้ยแตก!!!ว่ะ";

function readText(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signup(
  _state: AuthState,
  form: FormData,
): Promise<AuthState> {
  const name = readText(form, "name").trim();
  const email = readText(form, "email").trim().toLowerCase();
  const phone = readText(form, "phone").trim();
  const password = readText(form, "password");
  const fields = { name, email, phone };

  if (!name || name.length > 80 || !validEmail(email) || phone.length > 32) {
    return {
      ...fields,
      error: "Enter a valid name, email, and optional phone number.",
    };
  }
  if (password.length < 8 || password.length > 128) {
    return { ...fields, error: "Use a password between 8 and 128 characters." };
  }

  try {
    await prisma.user.create({
      data: {
        user: name,
        email,
        phone: phone || null,
        passwordHash: await hashPassword(password),
      },
      select: { id: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ...fields,
        error: "An account already uses this email. Try signing in.",
      };
    }
    return { ...fields, error: unavailable };
  }
  const invite = form.get("invite");
  redirect(
    validInvite(invite)
      ? `/login?registered=1&invite=${invite}`
      : "/login?registered=1",
  );
}

export async function login(
  _state: AuthState,
  form: FormData,
): Promise<AuthState> {
  const email = readText(form, "email").trim().toLowerCase();
  const password = readText(form, "password");
  const invalid = { email, error: "Email or password is incorrect." };
  if (!validEmail(email) || !password || password.length > 128) return invalid;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    const matches = await verifyPassword(password, user?.passwordHash);
    if (!user || !matches) return invalid;
    await createSession(user.id);
  } catch {
    return { email, error: unavailable };
  }
  const invite = form.get("invite");
  redirect(validInvite(invite) ? `/invite/${invite}` : "/board");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
