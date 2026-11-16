import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectPath } from "@/lib/projects";
import ProjectForm from "./ProjectForm";

export const metadata = { title: "Project board | Portfolio" };

export default async function BoardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true, role: true },
  });
  const roles = new Map(memberships.map((membership) => [membership.projectId, membership.role]));
  const projects = await prisma.project.findMany({
    where: { OR: [{ ownerId: user.id }, { id: { in: [...roles.keys()] } }] },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, ownerId: true, ownerRole: true },
  });

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Project board</h1>
          <Link href="/account" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100">
            My account
          </Link>
        </header>
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="project-list">
            <h2 id="project-list" className="mb-4 text-lg font-semibold">My projects</h2>
            {projects.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                You haven&apos;t created or joined any projects yet.
              </p>
            ) : (
              <ul className="grid gap-3">
                {projects.map((project) => (
                  <li key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 break-words font-semibold">
                        <Link href={projectPath(project.id)} className="text-sky-700 hover:underline">{project.name}</Link>
                      </h3>
                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-800">
                        {project.ownerId === user.id ? project.ownerRole : roles.get(project.id)}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">{project.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="create-project" className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 id="create-project" className="mb-4 text-lg font-semibold">New project</h2>
            <ProjectForm />
          </section>
        </div>
      </div>
    </main>
  );
}
