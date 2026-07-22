import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Loader2 } from "lucide-react";
import { myCertificates } from "@/lib/api/lms";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/student/certificates")({ component: Certificates });

function Certificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await myCertificates();
        setCerts(res.data || []);
      } catch {
        setCerts([]);
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
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-white font-serif">
          Your{" "}
          <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
            Certificates
          </span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{certs.length} earned · complete a course at 100%</p>
      </div>

      {certs.length === 0 ? (
        <p className="text-sm text-zinc-500">Finish a course to earn your first certificate.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6"
            >
              <div className="relative flex items-start justify-between">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Award className="h-7 w-7 text-amber-400" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-medium">
                  Certificate of Completion
                </span>
              </div>
              <div className="relative mt-6">
                <p className="text-xs text-zinc-500">Awarded to</p>
                <p className="text-lg font-semibold text-white font-serif">{user?.name}</p>
                <p className="text-xs text-zinc-500 mt-3">For successfully completing</p>
                <h3 className="text-xl text-amber-300 font-medium font-serif mt-1">
                  {c.course?.title}
                </h3>
              </div>
              <div className="relative mt-6 pt-4 border-t border-amber-500/10 text-xs text-zinc-500">
                <p>
                  Issued:{" "}
                  <span className="text-zinc-300">
                    {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "—"}
                  </span>
                </p>
                <p className="font-mono mt-0.5">{c.code}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
