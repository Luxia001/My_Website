import { redirect } from "next/navigation";
import { projectPath } from "@/lib/projects";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  redirect(projectPath((await params).projectId));
}
