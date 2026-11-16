import AuthForm from "@/components/auth/AuthForm";
import { validInvite } from "@/lib/projects";

export const metadata = { title: "Sign in | Portfolio" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; invite?: string }>;
}) {
  const { registered, invite } = await searchParams;
  return <AuthForm mode="login" registered={registered === "1"} invite={validInvite(invite) ? invite : undefined} />;
}
