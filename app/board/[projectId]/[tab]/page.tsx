import Link from "next/link";
import { notFound } from "next/navigation";
import { ChartLine, CircleUserRound, Settings2, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { projectPath, requireProject, type ProjectTab } from "@/lib/projects";
import Overview from "./Overview";
import { LegacyInvestments, Members, Settings } from "./Panels";
import Personal from "./Personal";

const tabs = {
  overview: { label: "ภาพรวม", icon: ChartLine },
  personal: { label: "ข้อมูลส่วนตัว", icon: CircleUserRound },
  settings: { label: "ตั้งค่าโปรเจกต์", icon: Settings2 },
  members: { label: "สมาชิก", icon: UsersRound },
} satisfies Record<ProjectTab, { label: string; icon: typeof ChartLine }>;

async function MemberData(projectId: string, ownerId: string) {
  const members = await prisma.projectMember.findMany({ where: { projectId } });
  const users = await prisma.user.findMany({
    where: { id: { in: [ownerId, ...members.map((member) => member.userId)] } },
    select: { id: true, user: true },
  });
  return { members, users: new Map(users.map((user) => [user.id, user.user])) };
}

async function ProjectSection({ tab, context }: {
  tab: ProjectTab; context: Awaited<ReturnType<typeof requireProject>>;
}) {
  const { project, role, user, canManage } = context;
  const projectId = project.id;
  if (tab === "members") {
    const { members, users } = await MemberData(projectId, project.ownerId);
    return <Members id={projectId} role={role} owner={project.ownerId} members={members} users={users} />;
  }

  const assetsQuery = prisma.projectAsset.findMany({ where: { projectId }, orderBy: { name: "asc" } });
  if (tab === "settings") return <Settings project={project} assets={await assetsQuery} canManage={canManage} />;

  if (tab === "personal") {
    const cashKey = { projectId, userId: user.id };
    const [rows, balance, bank, manager, oldRows] = await Promise.all([
      prisma.projectCashTransaction.findMany({ where: cashKey, orderBy: { createdAt: "desc" } }),
      prisma.projectCashBalance.findUnique({ where: { projectId_userId: cashKey }, select: { amount: true } }),
      prisma.projectBankAccount.findUnique({
        where: { projectId_userId: cashKey },
        select: { bank: true, lastFour: true },
      }),
      canManage ? Promise.all([
        prisma.projectCashTransaction.findMany({
          where: { projectId, type: "deposit", status: "pending" }, orderBy: { createdAt: "asc" },
        }),
        prisma.projectCashBalance.findMany({
          where: { projectId, amount: { gt: BigInt(0) } }, select: { userId: true, amount: true },
        }),
        prisma.investment.findMany({ where: { projectId, status: "pending" }, orderBy: { createdAt: "asc" } }),
        MemberData(projectId, project.ownerId),
      ]) : null,
      prisma.investment.findMany({ where: cashKey, orderBy: { createdAt: "desc" } }),
    ]);
    const legacy = oldRows.length || manager?.[2].length
      ? <LegacyInvestments id={projectId} assets={await assetsQuery} rows={oldRows}
          pending={manager?.[2].length ? { rows: manager[2], users: manager[3].users } : undefined} />
      : undefined;
    return <Personal id={projectId} rows={rows} bank={bank} balance={balance?.amount ?? BigInt(0)} legacy={legacy}
      review={manager ? {
        pending: manager[0],
        balances: manager[1],
        users: manager[3].users,
      } : undefined} />;
  }

  const [assets, rows, { users }, cash] = await Promise.all([
    assetsQuery,
    prisma.investment.findMany({ where: { projectId, status: "approved" } }),
    MemberData(projectId, project.ownerId),
    prisma.projectCashTransaction.findMany({ where: { projectId, status: "completed" } }),
  ]);
  return <Overview rows={rows} assets={assets} users={users} cash={cash}
    budget={project.budget} startsAt={project.startsAt} endsAt={project.endsAt} />;
}

export default async function ProjectTabPage({ params }: { params: Promise<{ projectId: string; tab: string }> }) {
  const { projectId, tab } = await params;
  if (!Object.hasOwn(tabs, tab)) notFound();
  const active = tab as ProjectTab;
  const context = await requireProject(projectId);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-3 md:sticky md:top-20">
          <Link className="mb-3 inline-block px-2 text-sm font-semibold text-sky-700" href="/board">← โปรเจกต์ของฉัน</Link>
          <nav aria-label="เมนูโปรเจกต์" className="grid grid-cols-2 gap-1 md:grid-cols-1">
            {Object.entries(tabs).map(([key, { label, icon: Icon }]) => (
              <Link key={key} href={projectPath(projectId, key as ProjectTab)} aria-current={key === active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm ${key === active ? "bg-sky-100 font-semibold text-sky-900" : "text-slate-700 hover:bg-slate-100"}`}>
                <Icon size={17} aria-hidden />{label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="mb-5">
            <div className="flex items-start gap-3">
              <h1 className="min-w-0 break-words text-2xl font-bold sm:text-3xl">{context.project.name}</h1>
              <span className="badge badge-outline mt-1">{context.role}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">{context.project.description}</p>
          </header>
          <ProjectSection tab={active} context={context} />
        </div>
      </div>
    </main>
  );
}
