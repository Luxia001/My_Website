import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inviteHash, projectPath, validInvite } from "@/lib/projects";

async function getInvitation(token: string) {
  if (!validInvite(token)) notFound();
  return prisma.projectInvite.findUnique({
    where: { tokenHash: inviteHash(token), expiresAt: { gt: new Date() } },
  });
}

async function joinProject(token: string) {
  "use server";
  if (!validInvite(token)) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/login?invite=${token}`);
  const invite = await getInvitation(token);
  if (!invite) notFound();
  const project = await prisma.project.findUnique({ where: { id: invite.projectId }, select: { id: true, ownerId: true } });
  if (!project) notFound();
  if (project.ownerId !== user.id) {
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: project.id, userId: user.id } },
      update: {},
      create: { projectId: project.id, userId: user.id },
    });
  }
  revalidatePath("/board");
  redirect(projectPath(project.id));
}

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInvitation(token);
  const project = invite ? await prisma.project.findUnique({ where: { id: invite.projectId }, select: { name: true } }) : null;
  const user = project ? await getCurrentUser() : null;
  return (
    <main className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-slate-50 px-4 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold">{project ? `คำเชิญเข้าร่วม ${project.name}` : "ลิงก์เชิญหมดอายุหรือไม่ถูกต้อง"}</h1>
        {project && (user ? (
          <form action={joinProject.bind(null, token)} className="mt-5">
            <button className="btn bg-sky-700 text-white">เข้าร่วมโปรเจกต์</button>
          </form>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="btn bg-sky-700 text-white" href={`/login?invite=${token}`}>เข้าสู่ระบบ</Link>
            <Link className="btn btn-outline" href={`/signup?invite=${token}`}>สมัครสมาชิก</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
