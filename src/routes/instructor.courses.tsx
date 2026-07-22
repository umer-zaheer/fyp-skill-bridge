import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import {
  createCourse,
  createCoupon,
  getCategories,
  getCourses,
  listCoupons,
  updateCourse,
} from "@/lib/api/lms";
import { toast } from "sonner";
import { CurriculumEditor } from "@/components/instructor/CurriculumEditor";

export const Route = createFileRoute("/instructor/courses")({
  component: InstructorCoursesPage,
});

function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editCurriculumId, setEditCurriculumId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    price: "49",
    category: "",
    shortDescription: "",
  });
  const [couponForm, setCouponForm] = useState({ code: "", percentOff: "15", courseId: "" });

  const load = async () => {
    try {
      const [cRes, catRes, coupRes] = await Promise.all([
        getCourses({ instructor: "me", limit: 100 }),
        getCategories(),
        listCoupons(),
      ]);
      setCourses(cRes.data || []);
      setCategories(catRes.data || []);
      setCoupons(coupRes.data || []);
      if (!form.category && catRes.data?.[0]?._id) {
        setForm((f) => ({ ...f, category: catRes.data[0]._id }));
      }
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return courses.filter((c) => !q || c.title.toLowerCase().includes(q));
  }, [courses, query]);

  const saveCourse = async () => {
    try {
      await createCourse({
        title: form.title,
        price: Number(form.price),
        category: form.category,
        shortDescription: form.shortDescription,
        status: "published",
        modules: [
          {
            title: "Module 1",
            order: 0,
            lessons: [
              {
                title: "Introduction",
                content: form.shortDescription || "Welcome",
                durationMinutes: 10,
                isPreview: true,
              },
            ],
          },
        ],
      });
      toast.success("Course created");
      setCreateOpen(false);
      setForm({ title: "", price: "49", category: form.category, shortDescription: "" });
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Create failed");
    }
  };

  const archive = async (id: string) => {
    try {
      await updateCourse(id, { status: "archived" });
      toast.success("Archived");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const addCoupon = async () => {
    try {
      await createCoupon({
        code: couponForm.code,
        type: "course",
        percentOff: Number(couponForm.percentOff),
        courseId: couponForm.courseId,
      });
      toast.success("Course coupon created");
      setCouponForm({ code: "", percentOff: "15", courseId: "" });
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Coupon failed");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">My courses</h2>
          <p className="text-sm text-zinc-400 mt-1">{courses.length} courses · live from API</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950"
        >
          <Plus className="h-4 w-4" /> New course
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/80 text-zinc-400 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id} className="border-t border-zinc-800">
                <td className="px-4 py-3 text-white">{c.title}</td>
                <td className="px-4 py-3 capitalize text-amber-400">{c.status}</td>
                <td className="px-4 py-3">${c.price}</td>
                <td className="px-4 py-3">{c.studentsCount || 0}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditCurriculumId(c._id)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Modules
                  </button>
                  <Link
                    to="/courses/$id"
                    params={{ id: c._id }}
                    className="text-xs text-zinc-400"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => void archive(c._id)}
                    className="text-xs text-zinc-500 hover:text-red-400"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-zinc-900/50 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Course coupons (your courses)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            placeholder="CODE"
            value={couponForm.code}
            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="% off"
            value={couponForm.percentOff}
            onChange={(e) => setCouponForm({ ...couponForm, percentOff: e.target.value })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            value={couponForm.courseId}
            onChange={(e) => setCouponForm({ ...couponForm, courseId: e.target.value })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="">Course…</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void addCoupon()}
            className="rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold"
          >
            Create coupon
          </button>
        </div>
        <ul className="text-xs text-zinc-400 space-y-1">
          {coupons.map((c) => (
            <li key={c._id}>
              <span className="text-amber-400 font-mono">{c.code}</span> · {c.percentOff}% ·{" "}
              {c.course?.title || "course"}
            </li>
          ))}
        </ul>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
            <h3 className="text-lg text-white font-serif">New course</h3>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Short description"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="text-sm text-zinc-400 px-3">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveCourse()}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {editCurriculumId && (
        <CurriculumEditor
          courseId={editCurriculumId}
          onClose={() => {
            setEditCurriculumId(null);
            void load();
          }}
        />
      )}
    </div>
  );
}
