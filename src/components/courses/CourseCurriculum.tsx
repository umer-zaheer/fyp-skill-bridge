

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "articel" | "quiz";
  isFree?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration?: string;
  desc?: string;
}

interface CourseCurriculumProps {
  modules: Module[];
}

export function CourseCurriculum({ modules }: CourseCurriculumProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
        <h2 className="text-2xl font-serif font-light text-white tracking-tight">
          Curriculum
        </h2>
        <div className="text-lg text-zinc-400 tracking-wide font-sans">
          <span className="font-medium text-luxury-gold">
            {modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
          </span>{" "}
          Lessons •{" "}
          <span className="font-medium text-luxury-gold">15h 30m</span> Total
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border border-white/5 bg-[#0a0a0a] rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left gap-1">
                <span className="text-lg font-serif font-medium text-zinc-200">
                  {module.title}
                </span>
                <span className="text-sm text-zinc-500 font-mono tracking-wider uppercase">
                  {module.lessons.length} Lessons • {module.duration}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-1 pt-2">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md group transition-all duration-300",
                      lesson.isFree
                        ? "hover:bg-luxury-gold/5 cursor-pointer"
                        : "opacity-60 cursor-not-allowed hover:bg-white/5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300",
                          lesson.isFree
                            ? "border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-black"
                            : "border-white/10 bg-zinc-900 text-zinc-600",
                        )}
                      >
                        {lesson.isFree ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors duration-300",
                            lesson.isFree
                              ? "text-zinc-300 group-hover:text-luxury-gold"
                              : "text-zinc-500",
                          )}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded mt-0.5 w-fit">
                          {lesson.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded border border-white/5">
                      {lesson.duration}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
