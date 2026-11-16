import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function databaseFailure(error: unknown) {
  const code = error instanceof Prisma.PrismaClientInitializationError
    ? error.errorCode
    : error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined;
  const message = error instanceof Error ? error.message : "";
  if (code === "P1000" || /authentication failed|bad auth|scram|auth error/i.test(message)) return "authentication";
  if (code === "P1013" || /connection string|database name|database string/i.test(message)) return "invalid_uri";
  if (/dns|srv lookup|failed to resolve/i.test(message)) return "dns";
  if (code === "P1001" || code === "P1002" || /server selection|timed out|network is unreachable/i.test(message)) return "unreachable";
  return "query_failed";
}

function unavailable(reason: string) {
  console.error("[mongodb.health]", reason);
  return Response.json(
    { ok: false, database: "mongodb", error: "Database query failed" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  if (!process.env.MONGODB_URI?.trim()) return unavailable("missing_mongodb_uri");

  try {
    await prisma.user.findFirst({ select: { id: true } });
    return Response.json(
      { ok: true, database: "mongodb" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return unavailable(databaseFailure(error));
  }
}
