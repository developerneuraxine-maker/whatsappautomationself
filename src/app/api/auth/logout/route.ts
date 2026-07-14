import { endSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  await endSession();
  return Response.json({ ok: true });
}
