import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  Ban,
  CheckCircle2,
  Users,
  GraduationCap,
  UserCog,
  X,
} from "lucide-react";
import { adminUsers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({ component: AdminUsersPage });

type RoleFilter = "All" | "Student" | "Instructor" | "Admin";
type StatusFilter = "All" | "Active" | "Suspended" | "Pending";

const roleStyles: Record<string, string> = {
  Student: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Instructor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  Admin: "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    return adminUsers.filter((u) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = role === "All" || u.role === role;
      const matchesStatus = status === "All" || u.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, role, status]);

  const stats = {
    total: adminUsers.length,
    students: adminUsers.filter((u) => u.role === "Student").length,
    instructors: adminUsers.filter((u) => u.role === "Instructor").length,
    suspended: adminUsers.filter((u) => u.status === "Suspended").length,
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.length === filtered.length ? [] : filtered.map((u) => u.id)));
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-20 -right-10 h-56 w-56 bg-amber-500/10 rounded-full blur-[90px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">User management</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              People on{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                Skill Bridge
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Invite, suspend, and assign roles across the platform.</p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <UserPlus className="h-4 w-4" />
            Invite user
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total users", value: stats.total, icon: Users },
          { label: "Students", value: stats.students, icon: GraduationCap },
          { label: "Instructors", value: stats.instructors, icon: UserCog },
          { label: "Suspended", value: stats.suspended, icon: Ban },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              <s.icon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
        <div className="p-4 md:p-5 border-b border-zinc-800/80 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {(["All", "Student", "Instructor", "Admin"] as RoleFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  role === r
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-700",
                )}
              >
                {r}
              </button>
            ))}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/40"
            >
              {(["All", "Active", "Suspended", "Pending"] as StatusFilter[]).map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-5 py-3 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-3 text-sm">
            <span className="text-amber-400 font-medium">{selected.length} selected</span>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Change role
            </button>
            <button className="text-xs text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1">
              <Ban className="h-3.5 w-3.5" /> Suspend
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr className="border-b border-zinc-800/80">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.length === filtered.length}
                    onChange={toggleAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/30"
                  />
                </th>
                <th className="text-left font-medium px-5 py-3">User</th>
                <th className="text-left font-medium px-5 py-3">Role</th>
                <th className="text-left font-medium px-5 py-3">Courses</th>
                <th className="text-left font-medium px-5 py-3">Joined</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/30"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-semibold text-zinc-900">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", roleStyles[u.role])}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{u.courses}</td>
                  <td className="px-5 py-3 text-zinc-500">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", statusStyles[u.status])}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setInviteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">Invite user</h3>
                <button onClick={() => setInviteOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500">Role</label>
                  <select className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40">
                    <option>Student</option>
                    <option>Instructor</option>
                    <option>Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => setInviteOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Send invite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
