import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { instructorStudents as fetchStudents } from "@/lib/api/lms";

export const Route = createFileRoute("/instructor/students")({
  component: InstructorStudentsPage,
});

function InstructorStudentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchStudents();
        setRows(res.data || []);
      } catch {
        setRows([]);
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

  return (
    <div className="space-y-6 text-zinc-200">
      <div>
        <h2 className="text-3xl font-serif text-white">Students</h2>
        <p className="text-sm text-zinc-400 mt-1">{rows.length} enrollments across your courses</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400 text-left">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-zinc-800">
                <td className="px-4 py-3">
                  <div className="text-white">{r.student?.name}</div>
                  <div className="text-xs text-zinc-500">{r.student?.email}</div>
                </td>
                <td className="px-4 py-3">{r.course?.title}</td>
                <td className="px-4 py-3 text-amber-400">{r.progress ?? 0}%</td>
                <td className="px-4 py-3 text-zinc-400">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-sm text-zinc-500">No students enrolled yet.</p>
        )}
      </div>
    </div>
  );
}
