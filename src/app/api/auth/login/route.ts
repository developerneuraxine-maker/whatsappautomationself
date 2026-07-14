import { getUserByEmail, toPublicUser } from "@/lib/store";
import { startSession, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return Response.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  await startSession(user.id);
  return Response.json({ ok: true, user: toPublicUser(user) });
}
