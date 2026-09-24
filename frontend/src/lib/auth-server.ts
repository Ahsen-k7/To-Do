import "server-only";
import { cookies } from "next/headers";
import { apiUrl, type User } from "./api";

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get("taskflow_session")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const response = await fetch(apiUrl("/auth/me"), {
    headers: { Cookie: `taskflow_session=${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Could not verify session.");
  const data = await response.json() as { user: User };
  return data.user;
}
