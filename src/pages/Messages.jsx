// src/pages/Messages.jsx
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MessagesAPI } from "../api/messages";
import { UsersAPI } from "../api/users";
import { connectSocket } from "../lib/socket"; // expects your lib to export a singleton/connect function
import { UserContext } from "../context/UserContext";

const cx = (...x) => x.filter(Boolean).join(" ");

// --- small utils ---
const fmtTime = (iso) => {
  try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
};
const isSameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
};
const dayLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
};

export default function Messages() {
  const location = useLocation();
  const { user } = useContext(UserContext) || {};
  const myId = user?._id || user?.id || null;

  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(true);

  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [convLoading, setConvLoading] = useState(false);
  const [sendBusy, setSendBusy] = useState(false);
  const [input, setInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [search, setSearch] = useState("");

  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const olderCursor = useRef(null);

  const seenIdsRef = useRef(new Set());
  const activePeerIdRef = useRef(null);
  useEffect(() => { activePeerIdRef.current = activePeer?._id || null; }, [activePeer?._id]);

  // keep latest myId for socket callback
  const myIdRef = useRef(null);
  useEffect(() => { myIdRef.current = myId ? String(myId) : null; }, [myId]);

  // ensure socket connected once
  useEffect(() => { connectSocket(); }, []);

  // Load threads (receiver list)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setThreadsLoading(true);
        const rows = await MessagesAPI.threads();
        if (!mounted) return;
        setThreads(rows || []);
        if (!activePeer && rows?.length) {
          const p = rows[0].peer;
          if (p?._id) setActivePeer(p);
        }
      } catch (e) {
        console.error("[Messages] threads error:", e);
        setErrorText("Failed to load chats.");
      } finally {
        setThreadsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Open from ?peerId=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const peerId = params.get("peerId");
    if (!peerId) return;

    let mounted = true;
    (async () => {
      try {
        const u = await UsersAPI.getById(peerId);
        if (!mounted || !u) return;
        setActivePeer({
          _id: u._id,
          name: u.fullname?.firstname ? `${u.fullname.firstname} ${u.fullname.lastname ?? ""}`.trim() : u.name ?? u.email,
          avatar: u.avatar,
          isOnline: !!u.isOnline,
        });
      } catch (e) {
        console.error("[Messages] open by peerId failed:", e);
      }
    })();
    return () => { mounted = false; };
  }, [location.search]);

  // Load conversation when peer changes (chat history from DB)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!activePeer?._id) return;
      try {
        setConvLoading(true);
        setErrorText("");
        const { messages: arr, nextCursor } = await MessagesAPI.conversation(activePeer._id, null, 30);

        const set = new Set();
        for (const m of arr) if (m?._id) set.add(String(m._id));
        seenIdsRef.current = set;

        if (!mounted) return;
        setMessages(arr);
        olderCursor.current = nextCursor;
      } catch (e) {
        console.error("[Messages] conversation error:", e);
        setErrorText("Failed to load conversation.");
      } finally {
        setConvLoading(false);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      }
    })();
    return () => { mounted = false; };
  }, [activePeer?._id]);

  // Socket receive — ignore my own echoes (prevents duplicate on sender side)
  useEffect(() => {
    const s = connectSocket();
    function onNew(payload) {
      const msg = payload?.message || payload;
      if (!msg) return;

      // skip my own message echo from server (we add optimistically)
      if (myIdRef.current && String(msg.senderId) === String(myIdRef.current)) return;

      const peerId = activePeerIdRef.current;
      if (!peerId) return;

      const sId = String(msg.senderId || "");
      const rId = String(msg.receiverId || "");
      const belongs = sId === String(peerId) || rId === String(peerId);
      if (!belongs) return;

      const id = String(msg._id || "");
      if (id && seenIdsRef.current.has(id)) return;
      if (id) seenIdsRef.current.add(id);

      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }

    s.on("message:new", onNew);
    return () => s.off("message:new", onNew);
  }, []);

  // Load older (previous history)
  const loadOlder = async () => {
    if (!olderCursor.current || !activePeer?._id) return;
    try {
      const el = listRef.current;
      const prevH = el?.scrollHeight || 0;
      const { messages: older, nextCursor } = await MessagesAPI.conversation(activePeer._id, olderCursor.current, 30);
      if (older?.length) {
        for (const m of older) if (m?._id) seenIdsRef.current.add(String(m._id));
        setMessages(prev => [...older, ...prev]);
        olderCursor.current = nextCursor;
        setTimeout(() => { if (el) el.scrollTop = el.scrollHeight - prevH; }, 0);
      } else {
        olderCursor.current = null;
      }
    } catch (e) {
      console.warn("[Messages] load older failed:", e);
    }
  };

  // Filter threads by search
  const filteredThreads = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter(t => (t.peer?.name || t.peer?.email || "").toLowerCase().includes(q));
  }, [threads, search]);

  const selectThread = (t) => {
    if (!t?.peer?._id) return;
    setActivePeer({ _id: t.peer._id, name: t.peer?.name || t.peer?.email || "User", avatar: t.peer?.avatar, isOnline: !!t.peer?.isOnline });
  };

  const onSend = async (e) => {
    e?.preventDefault?.();
    setErrorText("");
    if (!activePeer?._id) { setErrorText("Pick a conversation first."); return; }
    const text = input.trim();
    if (!text) return;

    try {
      setSendBusy(true);
      const tempId = "tmp_" + Math.random().toString(36).slice(2);
      const optimistic = {
        _id: tempId,
        senderId: myId || "me",
        receiverId: activePeer._id,
        content: text,
        createdAt: new Date().toISOString(),
        isMine: true,
      };
      seenIdsRef.current.add(tempId);
      setMessages(prev => [...prev, optimistic]);
      setInput("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

      const sent = await MessagesAPI.send(activePeer._id, text);
      const realId = String(sent?._id || "");
      setMessages(prev => prev.map(m => (m._id === tempId ? sent : m)));
      if (realId) { seenIdsRef.current.delete(tempId); seenIdsRef.current.add(realId); }
    } catch (err) {
      console.error("[Messages] send failed:", err?.response || err);
      setErrorText(err?.response?.data?.message || "Failed to send message.");
      setMessages(prev => prev.filter(m => !String(m._id).startsWith("tmp_")));
      setInput(text);
      seenIdsRef.current.forEach(id => { if (String(id).startsWith("tmp_")) seenIdsRef.current.delete(id); });
    } finally {
      setSendBusy(false);
    }
  };

  // Build list with day separators (for an IG-like look)
  const grouped = useMemo(() => {
    const out = [];
    let lastDay = null;
    for (const m of messages) {
      const d = new Date(m.createdAt || m.updatedAt || Date.now());
      const label = dayLabel(d);
      if (label !== lastDay) { out.push({ __day: label, key: `day_${label}_${d.getTime()}` }); lastDay = label; }
      out.push(m);
    }
    return out;
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* LEFT = receiver list, RIGHT = conversation */}
      <div className="pt-20 pb-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[360px,1fr] gap-0 md:gap-6 px-0 md:px-10">

        {/* LEFT: Threads (Select receiver) */}
        <aside className="md:rounded-2xl border border-white/10 bg-[#0b1220]/80 backdrop-blur-xl md:overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-white font-semibold text-lg">Messages</div>
          </div>
          <div className="px-3 py-2 border-b border-white/10">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="w-full h-10 rounded-xl bg-[#0f1621] border border-white/10 px-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {threadsLoading && <div className="text-white/60 text-sm px-4 py-3">Loading…</div>}
            {!threadsLoading && filteredThreads.length === 0 && <div className="text-white/60 text-sm px-4 py-3">No conversations yet.</div>}
            {filteredThreads.map(t => {
              const isActive = activePeer?._id && String(activePeer._id) === String(t.peer?._id);
              return (
                <div key={t.peer?._id} onClick={() => selectThread(t)} className={cx("flex items-center gap-3 px-4 py-3 cursor-pointer", isActive ? "bg-white/10" : "hover:bg-white/5") }>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden">
                      {t.peer?.avatar ? <img src={t.peer.avatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full grid place-items-center text-white/60">👤</div>}
                    </div>
                    {t.peer?.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0b1220]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{t.peer?.name || t.peer?.email || "User"}</div>
                    <div className="text-white/50 text-xs truncate">{t.lastMessage?.content}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {t.lastMessage?.createdAt && <div className="text-white/40 text-[11px]">{fmtTime(t.lastMessage.createdAt)}</div> }
                    {!!t.unreadCount && <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: Conversation + Composer */}
        <section className="md:rounded-2xl border border-white/10 bg-[#0b1220]/80 backdrop-blur-xl flex flex-col min-h-[70vh]">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              {activePeer?.avatar ? <img className="w-9 h-9 rounded-full" src={activePeer.avatar} alt="" /> : <div className="w-9 h-9 rounded-full bg-gray-800 grid place-items-center text-white/60">👤</div>}
              <div className="min-w-0">
                <div className="text-white font-semibold truncate">{activePeer?.name || "Select a conversation"}</div>
                {!!activePeer?._id && <div className="text-[11px] text-white/50">{activePeer?.isOnline ? "Active now" : ""}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Call">📞</button>
              <button className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Video">🎥</button>
              <button className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Info">ℹ️</button>
            </div>
          </div>

          {errorText && <div className="px-4 py-2 text-sm text-red-300 border-b border-red-500/30 bg-red-950/30">{errorText}</div>}

          {/* messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {convLoading && <div className="text-white/60">Loading conversation…</div>}
            {!convLoading && !activePeer?._id && <div className="text-white/60">Pick a chat on the left.</div>}
            {!convLoading && activePeer?._id && messages.length === 0 && <div className="text-white/60">Say hi 👋</div>}

            {!!olderCursor.current && !!activePeer?._id && (
              <div className="flex justify-center py-1">
                <button onClick={loadOlder} className="px-3 py-1 text-xs rounded-full border border-white/20 text-white/70 hover:bg-white/10">Load earlier messages</button>
              </div>
            )}

            {grouped.map((m, idx) => {
              if (m.__day) {
                return (
                  <div key={m.key} className="flex justify-center my-3">
                    <div className="px-3 py-1 text-[11px] rounded-full bg-white/5 text-white/60 border border-white/10">{m.__day}</div>
                  </div>
                );
              }
              const mine = m.isMine || String(m.senderId) === String(myId) || String(m.senderId) === "me";
              const next = grouped[idx + 1];
              const showAvatar = !mine && (!next || next.__day || String(next.senderId) !== String(m.senderId));

              return (
                <div key={m._id} className={cx("flex items-end gap-2", mine ? "justify-end" : "justify-start") }>
                  {!mine && (
                    <div className="w-6">
                      {showAvatar ? (activePeer?.avatar ? <img src={activePeer.avatar} className="w-6 h-6 rounded-full" alt=""/> : <div className="w-6 h-6 rounded-full bg-gray-800 grid place-items-center text-white/60 text-[10px]">👤</div>) : (<div className="w-6" />)}
                    </div>
                  )}
                  <div className={cx("max-w-[78%] px-3 py-2 rounded-2xl border relative", mine ? "bg-blue-600/80 border-blue-500/40 text-white rounded-br-sm" : "bg-white/5 border-white/10 text-white rounded-bl-sm")}>
                    <div className="whitespace-pre-wrap break-words text-[15px] leading-snug">{m.content}</div>
                    <div className="mt-1 text-[10px] text-white/60 text-right">{fmtTime(m.createdAt)}</div>
                    <span className={cx("absolute bottom-0 w-3 h-3 translate-y-1/2", mine ? "right-0 bg-blue-600/80" : "left-0 bg-white/5")} style={{ clipPath: mine ? "polygon(100% 0, 0 100%, 100% 100%)" : "polygon(0 0, 0 100%, 100% 100%)" }} />
                  </div>
                  {mine && <div className="w-6" />}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* composer */}
          <form onSubmit={onSend} className="p-3 border-t border-white/10 flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Gallery">🖼️</button>
            <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Mic">🎤</button>
            <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/80" title="Sticker">😊</button>
            <input value={input} onChange={(e) => setInput(e.target.value)} disabled={!activePeer?._id} placeholder={activePeer?._id ? "Message…" : "Select a conversation to start messaging"} className="flex-1 h-11 rounded-3xl bg-[#0f1621] border border-white/10 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none disabled:opacity-60" />
            <button type="submit" disabled={!activePeer?._id || !input.trim() || sendBusy} className="h-11 px-4 rounded-3xl border bg-blue-600/80 border-blue-500/50 text-white hover:bg-blue-500/80 disabled:opacity-50">Send</button>
          </form>
        </section>
      </div>
    </div>
  );
}
