import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { adminPayments } from "@/lib/api/lms";

export const Route = createFileRoute("/admin/payments")({ component: AdminPaymentsPage });

function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminPayments();
        setPayments(res.data || []);
      } catch {
        setPayments([]);
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
        <h2 className="text-3xl font-serif text-white">Payments</h2>
        <p className="text-sm text-zinc-400 mt-1">
          80% instructor / 20% platform split recorded per sale
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400 text-left">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Platform 20%</th>
              <th className="px-4 py-3">Instructor 80%</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t border-zinc-800">
                <td className="px-4 py-3 text-white">{p.student?.name}</td>
                <td className="px-4 py-3">{p.course?.title}</td>
                <td className="px-4 py-3">${p.amountTotal}</td>
                <td className="px-4 py-3 text-amber-400">${p.platformFee}</td>
                <td className="px-4 py-3 text-emerald-400">${p.instructorAmount}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <p className="p-6 text-sm text-zinc-500">No payments yet.</p>
        )}
      </div>
    </div>
  );
}
