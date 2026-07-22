import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, DollarSign, GraduationCap, Loader2, Users } from "lucide-react";
import { adminPayments, adminStats, adminUsers, getCourses } from "@/lib/api/lms";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, u, p, c] = await Promise.all([
          adminStats(),
          adminUsers(),
          adminPayments(),
          getCourses({ limit: 8 }),
        ]);
        setStats(s.data);
        setUsers((u.data || []).slice(0, 6));
        setPayments((p.data || []).slice(0, 6));
        setCourses(c.data || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const cards = [
    { label: "Students", value: stats?.totalStudents ?? 0, icon: Users },
    { label: "Instructors", value: stats?.totalInstructors ?? 0, icon: GraduationCap },
    { label: "Courses", value: stats?.totalCourses ?? 0, icon: BookOpen },
    {
      label: "Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6 text-zinc-200">
      <div>
        <h2 className="text-3xl font-serif text-white">Admin dashboard</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Live platform data · platform fee revenue: $
          {(stats?.platformRevenue ?? 0).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{c.label}</p>
              <c.icon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 p-4">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Recent users</h3>
            <Link to="/admin/users" className="text-xs text-amber-400">
              View all
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {users.map((u) => (
              <li key={u._id} className="flex justify-between border-b border-zinc-800/80 py-2">
                <span className="text-white">{u.name}</span>
                <span className="text-zinc-500 capitalize">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-800 p-4">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Recent payments</h3>
            <Link to="/admin/payments" className="text-xs text-amber-400">
              View all
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {payments.map((p) => (
              <li key={p._id} className="flex justify-between border-b border-zinc-800/80 py-2">
                <span className="text-white truncate mr-2">
                  {p.student?.name} · {p.course?.title}
                </span>
                <span className="text-amber-400">${p.amountTotal}</span>
              </li>
            ))}
            {payments.length === 0 && (
              <li className="text-zinc-500 text-xs">No payments yet</li>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 p-4">
        <div className="flex justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Courses</h3>
          <Link to="/admin/courses" className="text-xs text-amber-400">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {courses.map((c) => (
            <div key={c._id} className="rounded-xl border border-zinc-800 p-3 text-sm">
              <p className="text-white font-medium">{c.title}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {c.instructor?.name} · {c.studentsCount || 0} students · ${c.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
