import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Download, ExternalLink, Share2 } from "lucide-react";

export const Route = createFileRoute("/student/certificates")({ component: Certificates });

const certs = [
  { id: "CERT-7821", course: "Data Science 101", instructor: "Priya Nair", date: "Mar 14, 2026", credentialId: "DS-2026-7821" },
  { id: "CERT-7654", course: "UX Research Sprint", instructor: "Sara Bennett", date: "Feb 02, 2026", credentialId: "UX-2026-7654" },
  { id: "CERT-7510", course: "Intro to Product Management", instructor: "Daniel Park", date: "Dec 18, 2025", credentialId: "PM-2025-7510" },
  { id: "CERT-7390", course: "Figma for Designers", instructor: "Marco Reyes", date: "Oct 04, 2025", credentialId: "FG-2025-7390" },
];

function Certificates() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-white font-serif">
          Your <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Certificates</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{certs.length} earned · verified credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certs.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6"
          >
            <div className="absolute -top-16 -right-10 h-48 w-48 bg-amber-500/10 rounded-full blur-[80px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.06),transparent_60%)]" />

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
              <p className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">Alex Smith</p>
              <p className="text-xs text-zinc-500 mt-3">For successfully completing</p>
              <h3 className="text-xl text-amber-300 font-medium font-serif mt-1">{c.course}</h3>
              <p className="text-xs text-zinc-400 mt-2">Instructor: {c.instructor}</p>
            </div>

            <div className="relative mt-6 pt-4 border-t border-amber-500/10 flex items-center justify-between text-xs">
              <div className="text-zinc-500">
                <p>Issued: <span className="text-zinc-300">{c.date}</span></p>
                <p className="font-mono mt-0.5">{c.credentialId}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-amber-400" title="View">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-amber-400" title="Share">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-amber-400" title="Download">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
