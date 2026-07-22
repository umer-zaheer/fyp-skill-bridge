import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { adminUsers } from "@/lib/api/lms";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: AdminUsersPage });

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      const res = await adminUsers(query ? { q: query } : undefined);
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, query]);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: { isActive: !isActive },
        auth: true,
      });
      toast.success(isActive ? "Suspended" : "Activated");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <div>
        <h2 className="text-3xl font-serif text-white">Users</h2>
        <p className="text-sm text-zinc-400 mt-1">{users.length} accounts</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-white">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-amber-400">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.isActive ? (
                      <span className="text-emerald-400">Active</span>
                    ) : (
                      <span className="text-red-400">Suspended</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => void toggleActive(u._id, u.isActive)}
                        className="text-xs text-zinc-400 hover:text-amber-400"
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
