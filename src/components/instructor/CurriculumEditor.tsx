import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Video, Youtube } from "lucide-react";
import { toast } from "sonner";
import {
  addLesson,
  addModule,
  deleteLesson,
  deleteModule,
  getCourse,
  updateLesson,
  uploadFile,
} from "@/lib/api/lms";

type Props = {
  courseId: string;
  onClose: () => void;
};

function detectVideoType(url: string): "youtube" | "url" | "upload" | "" {
  if (!url) return "";
  if (/youtu\.?be|youtube\.com/i.test(url)) return "youtube";
  if (/cloudinary|res\.cloudinary/i.test(url)) return "upload";
  return "url";
}

export function CurriculumEditor({ courseId, onClose }: Props) {
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonForms, setLessonForms] = useState<
    Record<string, { title: string; videoUrl: string; durationMinutes: string; isPreview: boolean }>
  >({});

  const reload = async () => {
    const res = await getCourse(courseId);
    setCourse(res.data);
  };

  useEffect(() => {
    (async () => {
      try {
        await reload();
      } catch {
        toast.error("Failed to load curriculum");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const patchLessonForm = (
    moduleId: string,
    patch: Partial<{ title: string; videoUrl: string; durationMinutes: string; isPreview: boolean }>,
  ) => {
    setLessonForms((f) => ({
      ...f,
      [moduleId]: {
        title: "",
        videoUrl: "",
        durationMinutes: "10",
        isPreview: false,
        ...f[moduleId],
        ...patch,
      },
    }));
  };

  const handleAddModule = async () => {
    if (!moduleTitle.trim()) return toast.error("Module title required");
    setBusy(true);
    try {
      await addModule(courseId, { title: moduleTitle.trim() });
      setModuleTitle("");
      toast.success("Module added");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    setBusy(true);
    try {
      await deleteModule(courseId, moduleId);
      toast.success("Module deleted");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const form = lessonForms[moduleId];
    if (!form?.title.trim()) return toast.error("Lesson title required");
    setBusy(true);
    try {
      const videoUrl = form.videoUrl.trim();
      await addLesson(courseId, moduleId, {
        title: form.title.trim(),
        videoUrl,
        videoType: detectVideoType(videoUrl),
        durationMinutes: Number(form.durationMinutes) || 0,
        isPreview: form.isPreview,
      });
      setLessonForms((f) => ({
        ...f,
        [moduleId]: { title: "", videoUrl: "", durationMinutes: "10", isPreview: false },
      }));
      toast.success("Lesson added");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleUploadVideo = async (moduleId: string, lessonId: string, file: File) => {
    setBusy(true);
    try {
      const up = await uploadFile(file, `lms/courses/${courseId}/videos`);
      await updateLesson(courseId, moduleId, lessonId, {
        videoUrl: up.data.url,
        videoPublicId: up.data.publicId,
        videoType: "upload",
      });
      toast.success("Video uploaded");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSetYoutube = async (moduleId: string, lessonId: string, url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await updateLesson(courseId, moduleId, lessonId, {
        videoUrl: trimmed,
        videoType: detectVideoType(trimmed) || "youtube",
        videoPublicId: "",
      });
      toast.success("Video URL saved");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    setBusy(true);
    try {
      await deleteLesson(courseId, moduleId, lessonId);
      toast.success("Lesson deleted");
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePreview = async (moduleId: string, lesson: any) => {
    setBusy(true);
    try {
      await updateLesson(courseId, moduleId, lesson._id, {
        isPreview: !lesson.isPreview,
      });
      await reload();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif text-white">Curriculum</h3>
            <p className="text-sm text-zinc-400 mt-1">
              {course?.title || "Loading…"} — add modules and lesson videos
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-zinc-400 hover:text-white">
            Close
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="New module title"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleAddModule()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-950"
              >
                <Plus className="h-4 w-4" /> Module
              </button>
            </div>

            <div className="space-y-4">
              {(course?.modules || []).map((mod: any, mi: number) => {
                const lf = lessonForms[mod._id] || {
                  title: "",
                  videoUrl: "",
                  durationMinutes: "10",
                  isPreview: false,
                };
                return (
                  <div
                    key={mod._id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-white font-medium">
                        {mi + 1}. {mod.title}
                      </h4>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDeleteModule(mod._id)}
                        className="text-zinc-500 hover:text-red-400"
                        title="Delete module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {(mod.lessons || []).map((lesson: any, li: number) => (
                        <li
                          key={lesson._id}
                          className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm text-zinc-200">
                                {li + 1}. {lesson.title}
                                {lesson.isPreview && (
                                  <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-400">
                                    Preview
                                  </span>
                                )}
                              </p>
                              {lesson.videoUrl ? (
                                <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-md flex items-center gap-1">
                                  {lesson.videoType === "youtube" ? (
                                    <Youtube className="h-3 w-3 text-red-400" />
                                  ) : (
                                    <Video className="h-3 w-3 text-amber-400" />
                                  )}
                                  {lesson.videoUrl}
                                </p>
                              ) : (
                                <p className="text-xs text-zinc-600 mt-0.5">No video yet</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void handleTogglePreview(mod._id, lesson)}
                                className="text-[11px] text-zinc-400 hover:text-amber-400"
                              >
                                {lesson.isPreview ? "Unpreview" : "Preview"}
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void handleDeleteLesson(mod._id, lesson._id)}
                                className="text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="url"
                              placeholder="YouTube or video URL"
                              defaultValue={
                                lesson.videoType !== "upload" ? lesson.videoUrl || "" : ""
                              }
                              key={`url-${lesson._id}-${lesson.videoUrl}`}
                              onBlur={(e) => {
                                if (e.target.value.trim() && e.target.value !== lesson.videoUrl) {
                                  void handleSetYoutube(mod._id, lesson._id, e.target.value);
                                }
                              }}
                              className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
                            />
                            <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 hover:border-amber-500/50">
                              <Video className="h-3.5 w-3.5" />
                              Upload
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void handleUploadVideo(mod._id, lesson._id, file);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-zinc-800">
                      <input
                        placeholder="Lesson title"
                        value={lf.title}
                        onChange={(e) => patchLessonForm(mod._id, { title: e.target.value })}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="YouTube / video URL (optional)"
                        value={lf.videoUrl}
                        onChange={(e) => patchLessonForm(mod._id, { videoUrl: e.target.value })}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Minutes"
                        value={lf.durationMinutes}
                        onChange={(e) =>
                          patchLessonForm(mod._id, { durationMinutes: e.target.value })
                        }
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                      />
                      <label className="flex items-center gap-2 text-sm text-zinc-400 px-1">
                        <input
                          type="checkbox"
                          checked={lf.isPreview}
                          onChange={(e) =>
                            patchLessonForm(mod._id, { isPreview: e.target.checked })
                          }
                        />
                        Free preview
                      </label>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleAddLesson(mod._id)}
                        className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 text-amber-400 px-3 py-2 text-sm hover:bg-amber-500/10"
                      >
                        <Plus className="h-4 w-4" /> Add lesson
                      </button>
                    </div>
                  </div>
                );
              })}

              {!course?.modules?.length && (
                <p className="text-sm text-zinc-500 text-center py-6">
                  No modules yet. Add your first module above.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
