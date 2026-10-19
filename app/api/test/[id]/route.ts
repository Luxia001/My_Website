import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/test/[id]">,
) {
  const { id } = await ctx.params;
  return Response.json({ id });
}
