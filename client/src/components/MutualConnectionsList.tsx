

// client/src/components/MutualConnectionsList.tsx
import { useEffect, useState } from "react";
import fetchMutuals, { type MutualUser } from "../api/mutuals";

type Props = { profileId: string };

export default function MutualConnectionsList({ profileId }: Props) {
  const [items, setItems] = useState<MutualUser[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  async function load() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetchMutuals(profileId, { skip, limit: PAGE_SIZE });
      const newItems = res.data ?? [];
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === PAGE_SIZE);
      setSkip(prev => prev + newItems.length);
    } catch (e) {
      console.error("Failed to load mutual connections", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Reset when profile changes
    setItems([]);
    setSkip(0);
    setHasMore(true);
    // initial load
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  if (!loading && items.length === 0) {
    return (
      <div className="rounded-xl border p-4 text-sm opacity-80">
        No mutual connections yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="divide-y rounded-xl border">
        {items.map((u) => (
          <li key={u._id} className="flex items-center gap-3 p-3">
            <img
              src={u.avatar || "/avatar.png"}
              alt={u.name}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{u.name}</div>
              <div className="truncate text-sm opacity-70">
                {u.headline || (u.username ? `@${u.username}` : "")}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={load}
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}