"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProjectFormState = { error: string; name?: string; description?: string };

export async function createProject(
  _state: ProjectFormState,
  form: FormData,
): Promise<ProjectFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const nameField = form.get("name");
  const descriptionField = form.get("description");
  const name = typeof nameField === "string" ? nameField.trim() : "";
  const description = typeof descriptionField === "string" ? descriptionField.trim() : "";

  if (!name || name.length > 100 || !description || description.length > 2000) {
    return { name, description, error: "Enter a name (up to 100 characters) and a description (up to 2,000 characters)." };
  }

  try {
    await prisma.project.create({
      data: { name, description, ownerId: user.id },
      select: { id: true },
    });
  } catch {
    return { name, description, error: "Could not create the project. Please try again." };
  }

  revalidatePath("/board");
  redirect("/board");
}
