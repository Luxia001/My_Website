import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.user.findMany({
      select: {
        user: true,
      },
    });
    return Response.json({ ok: true, database: "mongodb", data });
  } catch {
    return Response.json(
      { ok: false, database: "mongodb", error: "Database query failed" },
      { status: 503 },
    );
  }
}
