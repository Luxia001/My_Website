import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Account | Portfolio" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Your account</h1>
        <p className="mt-3 break-words font-semibold">{user.user}</p>
        <p className="mt-1 break-words text-slate-600">{user.email}</p>
        <form action={logout} className="mt-6">
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50">Sign out</button>
        </form>
      </section>
    </main>
  );
}
