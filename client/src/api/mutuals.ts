

// client/src/api/mutuals.ts
// Small API helper to fetch mutual connections for a profile.
// Uses VITE_API_URL from client/.env (e.g., http://localhost:5001)

const BASE = (import.meta as any).env?.VITE_API_URL || "";

export type MutualUser = {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
  headline?: string;
  location?: string;
};

export type MutualsResponse = {
  data: MutualUser[];
  pagination?: { skip: number; limit: number };
};

export async function fetchMutuals(
  profileId: string,
  opts: { skip?: number; limit?: number } = {}
): Promise<MutualsResponse> {
  const { skip = 0, limit = 20 } = opts;

  if (!profileId) throw new Error("profileId is required");

  const url = `${BASE}/api/users/${encodeURIComponent(
    profileId
  )}/mutuals?skip=${skip}&limit=${limit}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load mutual connections: ${res.status} ${text}`);
  }

  return (await res.json()) as MutualsResponse;
}

export default fetchMutuals;