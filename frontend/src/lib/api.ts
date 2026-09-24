export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Configure the backend origin, without an /api suffix.
export function apiUrl(path: string) {
  const origin = process.env.NEXT_PUBLIC_API_URL;
  if (!origin) throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  return `${origin.replace(/\/$/, "")}/api${path}`;
}

export async function apiRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: body === undefined ? "GET" : "POST",
      credentials: "include",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
      headers: body === undefined ? undefined : {
        "Content-Type": "application/json",
        "X-TaskFlow-CSRF": "1",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach TaskFlow. Please try again in a moment.", 0);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.message ?? "Something went wrong. Please try again.", response.status);
  }
  if (!data) throw new ApiError("Unexpected server response. Please try again.", response.status);
  return data as T;
}
