import { useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { getChannel, postChannelMessage } from "@/lib/api/lms";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

export default function CourseChannel({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [channelName, setChannelName] = useState("Class Channel");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      const res = await getChannel(courseId);
      setChannelName(res.data.channel?.name || "Class Channel");
      setMessages(res.data.messages || []);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Cannot load channel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [courseId]);

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      const res = await postChannelMessage(courseId, body.trim());
      setMessages((m) => [...m, (res as any).data]);
      setBody("");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col h-[420px]">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-white">{channelName}</h3>
        <p className="text-xs text-zinc-500">Enrolled students & instructor only</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-8">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div key={m._id} className="rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-amber-400">
                {m.sender?.name || "User"}
                <span className="text-zinc-600 ml-1 capitalize">· {m.sender?.role}</span>
              </span>
              <span className="text-[10px] text-zinc-600">
                {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <p className="text-sm text-zinc-300">{m.body}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-zinc-800 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void send()}
          placeholder="Write a message…"
          className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => void send()}
          className="rounded-lg bg-amber-500 px-3 py-2 text-zinc-950 disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
