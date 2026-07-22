import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  createCoupon,
  getCategories,
  getCourses,
  listCoupons,
  updateCourse,
} from "@/lib/api/lms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses")({ component: AdminCoursesPage });

function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponForm, setCouponForm] = useState({
    code: "",
    percentOff: "10",
    categoryId: "",
  });

  const load = async () => {
    try {
      const [c, cat, coup] = await Promise.all([
        getCourses({ limit: 100 }),
        getCategories(),
        listCoupons(),
      ]);
      setCourses(c.data || []);
      setCategories(cat.data || []);
      setCoupons((coup.data || []).filter((x: any) => x.type === "category"));
    } catch {
      /* */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await updateCourse(id, { status });
      toast.success(`Marked ${status}`);
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const addCategoryCoupon = async () => {
    try {
      await createCoupon({
        code: couponForm.code,
        type: "category",
        percentOff: Number(couponForm.percentOff),
        categoryId: couponForm.categoryId,
      });
      toast.success("Category discount created");
      setCouponForm({ code: "", percentOff: "10", categoryId: "" });
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

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
        <h2 className="text-3xl font-serif text-white">Courses</h2>
        <p className="text-sm text-zinc-400 mt-1">Moderate catalog · category % discounts</p>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-zinc-900/50 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">
          Admin category coupons (all courses in category)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            placeholder="CODE"
            value={couponForm.code}
            onChange={(e) =>
              setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
            }
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={couponForm.percentOff}
            onChange={(e) => setCouponForm({ ...couponForm, percentOff: e.target.value })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            value={couponForm.categoryId}
            onChange={(e) => setCouponForm({ ...couponForm, categoryId: e.target.value })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="">Category…</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void addCategoryCoupon()}
            className="rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold"
          >
            Create
          </button>
        </div>
        <ul className="text-xs text-zinc-400 space-y-1">
          {coupons.map((c) => (
            <li key={c._id}>
              <span className="text-amber-400 font-mono">{c.code}</span> · {c.percentOff}% off{" "}
              {c.category?.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t border-zinc-800">
                <td className="px-4 py-3 text-white">{c.title}</td>
                <td className="px-4 py-3">{c.instructor?.name}</td>
                <td className="px-4 py-3">{c.category?.name}</td>
                <td className="px-4 py-3 capitalize text-amber-400">{c.status}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => void setStatus(c._id, "published")}
                    className="text-xs text-emerald-400"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => void setStatus(c._id, "archived")}
                    className="text-xs text-red-400"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
