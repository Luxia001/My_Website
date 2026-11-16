import AuthForm from "@/components/auth/AuthForm";
import { validInvite } from "@/lib/projects";

export const metadata = { title: "Sign up | Portfolio" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const { invite } = await searchParams;
  return <AuthForm mode="signup" invite={validInvite(invite) ? invite : undefined} />;
}
