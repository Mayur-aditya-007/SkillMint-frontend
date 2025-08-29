import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Lightbulb, Rocket, Layers3, ExternalLink, Video,
  Timer, BookOpen, Brain, Sparkles, NotebookPen, Shuffle,
  ChevronDown, X, PlayCircle, Info, FolderOpen, ClipboardList
} from "lucide-react";

/* ============== THEME (deep neon on black) ============== */
const pageBg = "bg-slate-950";
const card = "bg-slate-900/90 border border-slate-700/60 rounded-2xl";
const soft = "bg-slate-900/60 border border-slate-800/70 rounded-xl";
const neon = "from-cyan-500 via-fuchsia-500 to-violet-600";
const neonShadow = "shadow-[0_0_22px_rgba(99,102,241,0.35)]";
const glowBtn = `relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
 text-white bg-gradient-to-r ${neon} ${neonShadow} transition transform hover:-translate-y-0.5
 focus:outline-none focus:ring-2 focus:ring-cyan-300/50`;
const sectionTitle = "text-slate-200 font-semibold";

/* ============== Utils ============== */
const API = import.meta.env.VITE_BASE_URL || "";
const uuid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));
const readLS = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* ============== Video embed util ============== */
function getEmbedUrl(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/")[1];
      return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
    }
    if (u.hostname.includes("youtube.com")) {
      const shorts = u.pathname.startsWith("/shorts/");
      if (shorts) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
      }
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      return rawUrl;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://player.vimeo.com/video/${id}` : rawUrl;
    }
    if (u.hostname.includes("drive.google.com")) {
      const m = u.pathname.match(/\/file\/d\/([^/]+)\//);
      return m?.[1] ? `https://drive.google.com/file/d/${m[1]}/preview` : rawUrl;
    }
    return rawUrl;
  } catch { return rawUrl; }
}

/* ============== Pomodoro (stopwatch) ============== */
function Pomodoro() {
  const [work, setWork] = useState(() => readLS("pom:work", 25));
  const [rest, setRest] = useState(() => readLS("pom:rest", 5));
  const [mode, setMode] = useState("work");
  const [left, setLeft] = useState(work * 60);
  const [run, setRun] = useState(false);
  const [cycles, setCycles] = useState(() => readLS("pom:cycles", 0));
  useEffect(()=>writeLS("pom:work",work),[work]);
  useEffect(()=>writeLS("pom:rest",rest),[rest]);
  useEffect(()=>writeLS("pom:cycles",cycles),[cycles]);
  useEffect(()=>{ if(!run) setLeft((mode==="work"?work:rest)*60); },[work,rest,mode,run]);
  useEffect(()=>{
    if(!run) return;
    const t=setInterval(()=>{
      setLeft(s=>{
        if(s<=1){
          const nxt=mode==="work"?"break":"work";
          if(nxt==="break") setCycles(c=>c+1);
          setMode(nxt);
          return (nxt==="work"?work:rest)*60;
        }
        return s-1;
      });
    },1000);
    return ()=>clearInterval(t);
  },[run,mode,work,rest]);
  const mm=String(Math.floor(left/60)).padStart(2,"0");
  const ss=String(left%60).padStart(2,"0");
  return (
    <section className={`${card} p-5`}>
      <h3 className={`${sectionTitle} flex items-center gap-2`}>
        <Timer className="w-5 h-5 text-cyan-300" /> Pomodoro
      </h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="text-5xl font-bold tabular-nums text-slate-100">{mm}:{ss}</div>
        <span className={`px-2 py-1 rounded-full text-xs ${mode==="work"?"bg-emerald-500/15 text-emerald-300":"bg-violet-500/15 text-violet-300"}`}>
          {mode==="work"?"Focus":"Break"}
        </span>
        <div className="text-xs text-slate-400">Focus blocks: {cycles}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-300">
          Work
          <input type="number" min={1} max={90} value={work} onChange={e=>setWork(+e.target.value||25)}
            className={`${soft} w-16 px-2 py-1 text-slate-100`} />
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          Break
          <input type="number" min={1} max={30} value={rest} onChange={e=>setRest(+e.target.value||5)}
            className={`${soft} w-16 px-2 py-1 text-slate-100`} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>setRun(true)} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white">Start</button>
        <button onClick={()=>setRun(false)} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100">Pause</button>
        <button onClick={()=>{setRun(false);setMode("work");setLeft(work*60);}} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100">Reset</button>
      </div>
    </section>
  );
}

/* ============== Flashcards (SM-2 / Leitner) ============== */
function nextReviewSM2(card, quality=4){
  const now=Date.now();
  let { interval=0, ease=2.5, reps=0 } = card;
  if(quality<3){ reps=0; interval=1; }
  else {
    if(reps===0) interval=1;
    else if(reps===1) interval=6;
    else interval=Math.round(interval*ease);
    ease=Math.max(1.3, ease + (0.1 - (5-quality)*(0.08+(5-quality)*0.02)));
    reps+=1;
  }
  const due=now+interval*24*60*60*1000;
  return {...card, interval, ease, reps, due};
}
function Flashcards({ courseKey }){
  const storageKey=courseKey?`flashcards:${courseKey}`:"flashcards:global";
  const [mode,setMode]=useState(()=>readLS(`${storageKey}:mode`,"SM2"));
  const [cards,setCards]=useState(()=>readLS(storageKey,[]));
  const [front,setFront]=useState(""); const [back,setBack]=useState("");
  const [editing,setEditing]=useState(null);
  useEffect(()=>writeLS(storageKey,cards),[cards,storageKey]);
  useEffect(()=>writeLS(`${storageKey}:mode`,mode),[mode,storageKey]);
  const due=useMemo(()=>{
    if(mode==="SM2"){
      const now=Date.now();
      return cards.filter(c=>(c.due??0)<=now).sort((a,b)=>(a.due??0)-(b.due??0));
    }
    const by=cards.reduce((acc,c)=>{const b=c.box??1;(acc[b]??=[]).push(c);return acc;},{}); 
    const boxes=Object.keys(by).map(n=>+n); if(!boxes.length) return [];
    const min=Math.min(...boxes); return by[min]||[];
  },[cards,mode]);
  const add=()=>{
    if(!front.trim()||!back.trim()) return;
    const base={id:uuid(),front:front.trim(),back:back.trim()};
    const sched=mode==="SM2"?{...base,interval:0,ease:2.5,reps:0,due:Date.now()}:{...base,box:1};
    setCards([sched,...cards]); setFront(""); setBack("");
  };
  const review=(id,q=4)=>{
    setCards(cards.map(c=>{
      if(c.id!==id) return c;
      if(mode==="SM2") return nextReviewSM2(c,q);
      const nx={...c}; nx.box=q<3?1:Math.min(5,(nx.box??1)+1); return nx;
    }));
  };
  const saveEdit=()=>{
    setCards(cards.map(c=>c.id===editing?{...c,front:front.trim(),back:back.trim()}:c));
    setEditing(null); setFront(""); setBack("");
  };
  return (
    <section className={`${card} p-5`}>
      <div className="flex items-center justify-between">
        <h3 className={`${sectionTitle} flex items-center gap-2`}><Lightbulb className="w-5 h-5 text-amber-300"/> Flashcards</h3>
        <button onClick={()=>setMode(mode==="SM2"?"LEITNER":"SM2")}
          className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
          Mode: {mode}
        </button>
      </div>
      <div className="mt-3 grid gap-2">
        <input value={front} onChange={e=>setFront(e.target.value)} placeholder="Front (Question / Term)"
          className={`${soft} px-3 py-2 text-slate-100 placeholder:text-slate-400`} />
        <input value={back} onChange={e=>setBack(e.target.value)} placeholder="Back (Answer / Definition)"
          className={`${soft} px-3 py-2 text-slate-100 placeholder:text-slate-400`} />
        <div className="flex gap-2">
          {editing?(
            <>
              <button onClick={saveEdit} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white">Save</button>
              <button onClick={()=>{setEditing(null);setFront("");setBack("");}} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100">Cancel</button>
            </>
          ):(
            <button onClick={add} className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white">Add</button>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-slate-300">
        {due.length?<>Ready to review: <b>{due.length}</b></>:<>No cards due — add some or come back later.</>}
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {due.map(c=>(
          <div key={c.id} className={`${soft} p-3`}>
            <div className="text-slate-200"><span className="text-slate-500">Q:</span> {c.front}</div>
            <div className="mt-1 text-slate-200"><span className="text-slate-500">A:</span> {c.back}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={()=>review(c.id,2)} className="px-2 py-1 text-xs rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300">Again</button>
              <button onClick={()=>review(c.id,3)} className="px-2 py-1 text-xs rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300">Hard</button>
              <button onClick={()=>review(c.id,4)} className="px-2 py-1 text-xs rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">Good</button>
              <button onClick={()=>review(c.id,5)} className="px-2 py-1 text-xs rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300">Easy</button>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {mode==="SM2"
                ? `reps:${c.reps??0} ease:${(c.ease??2.5).toFixed(2)} next ~${c.interval??0}d`
                : `box: ${c.box??1} (5 = mastered)`}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== Transcript Tool ============== */
function TranscriptTool({ course }) {
  const [toolUrl,setToolUrl]=useState("https://notegpt.io/youtube-video-summarizer");
  const [videoUrl,setVideoUrl]=useState("");
  useEffect(()=>{
    const first = course?.lectures?.[0]?.videoUrl;
    if(first) setVideoUrl(first);
  },[course?.lectures]);

  const openTool=()=>{
    try{
      const u=new URL(toolUrl);
      if(videoUrl) u.searchParams.set("video", videoUrl);
      window.open(u.toString(), "_blank", "noopener,noreferrer");
    }catch{
      window.open(toolUrl,"_blank","noopener,noreferrer");
    }
  };

  return (
    <section className={`${card} p-5`}>
      <h3 className={`${sectionTitle} flex items-center gap-2`}>
        <Video className="w-5 h-5 text-sky-300" /> Transcript / Notes from Lecture
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Choose a lecture or paste a URL, then open a notes site to generate & download notes.
      </p>

      {Array.isArray(course?.lectures) && course.lectures.length>0 && (
        <div className="mt-3">
          <label className="text-slate-300 text-sm">Choose lecture</label>
          <select
            value={videoUrl}
            onChange={(e)=>setVideoUrl(e.target.value)}
            className={`${soft} w-full mt-1 px-3 py-2 text-slate-100`}
          >
            {course.lectures.map((lec, i)=>(
              <option key={i} value={lec.videoUrl || ""}>
                {lec.title || `Lecture ${i+1}`} {lec.videoUrl ? '' : '(no URL)'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3 grid gap-2">
        <input
          value={videoUrl}
          onChange={e=>setVideoUrl(e.target.value)}
          placeholder="Or paste a video URL"
          className={`${soft} px-3 py-2 text-slate-100 placeholder:text-slate-400`}
        />
        <div className="flex gap-2">
          <input
            value={toolUrl}
            onChange={e=>setToolUrl(e.target.value)}
            placeholder="Converter website URL"
            className={`flex-1 ${soft} px-3 py-2 text-slate-100 placeholder:text-slate-400`}
          />
          <a href={toolUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700">
            Open Site <ExternalLink className="w-4 h-4"/>
          </a>
        </div>
        <button onClick={openTool} className={glowBtn}>Send to notes site</button>
      </div>
    </section>
  );
}

/* ============== Hover-expand MiniTiles ============== */
function MiniTile({ icon, title, lines }) {
  return (
    <div className={`${soft} p-3 group overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-fuchsia-900/30`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <div className="text-slate-200 font-medium">{title}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-hover:rotate-180" />
      </div>
      <ul className="text-slate-400 text-[13px] space-y-1 mt-0 max-h-0 opacity-0 group-hover:max-h-40 group-hover:mt-2 group-hover:opacity-100 transition-all">
        {lines.map((t,i)=>(
          <li key={i} className="flex items-start gap-2">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-600/70" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============== NEW: Sleek vertical sidebar ============== */
const toolItems = [
  { key:"encoding",  icon:<Brain className="w-5 h-5" />,     title:"Deep Encoding",  lines:["Elaborate links to prior knowledge","Dual-code (text + sketch)","Self-explain steps aloud"] },
  { key:"retention", icon:<Sparkles className="w-5 h-5" />,  title:"Retention",      lines:["Spaced repetition (use Flashcards)","Interleave topics","Sleep + short breaks"] },
  { key:"cornell",   icon:<NotebookPen className="w-5 h-5"/>,title:"Cornell / Feynman",lines:["Cues | notes | summary","Teach simply; find gaps; refine","Create test questions"] },
  { key:"interleave",icon:<Shuffle className="w-5 h-5" />,   title:"Interleaving",   lines:["Mix problem types","Rotate topics each session"] },
  { key:"exam",      icon:<BookOpen className="w-5 h-5" />,  title:"Exam Strategy",  lines:["Two-pass; mark & move","Time by marks","Quick error check at end"] },
];
function VerticalToolkit({ activeKey, onOpen }) {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-[60]">
      {/* plane slim rail */}
      <div
        className="group relative"
        aria-label="Modern Learning Toolkit"
      >
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-fuchsia-500 to-violet-600 rounded-full opacity-80" />
        <div className="pl-4">
          <div
            className="flex flex-col gap-3 p-2 pr-3 bg-slate-900/85 border border-slate-800/70 rounded-2xl
                       backdrop-blur-sm hover:pr-4 transition-[padding,width] duration-300
                       w-[56px] hover:w-[220px] overflow-hidden"
          >
            {toolItems.map((t) => (
              <button
                key={t.key}
                onClick={() => onOpen?.(t.key)}
                className={`flex items-center gap-3 px-2 py-2 rounded-xl text-slate-200 hover:bg-slate-800/70
                            ${activeKey === t.key ? "ring-1 ring-cyan-400/40" : "ring-0"} 
                            transition transform hover:scale-[1.03]`}
                title={t.title}
              >
                <div className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600/30 to-fuchsia-600/30 border border-slate-700">
                  {t.icon}
                </div>
                <div className="whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 transition-all text-sm">
                  {t.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
function ToolkitDrawer({ openKey, onClose }) {
  const item = toolItems.find(i=>i.key===openKey);
  if(!item) return null;
  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`absolute left-20 top-1/2 -translate-y-1/2 w-[min(760px,90vw)]
                       ${card} p-5`}>
        <div className="flex items-center justify-between">
          <h3 className={`${sectionTitle} flex items-center gap-2`}>
            {item.icon} {item.title}
          </h3>
          <button onClick={onClose} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="mt-3 text-slate-300 space-y-2">
          {item.lines.map((l,i)=>(
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500" />
              {l}
            </li>
          ))}
        </ul>
        {/* Also show compact tiles for quick skim */}
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <MiniTile icon={<Info className="w-4 h-4 text-cyan-300" />} title="How to apply"
            lines={["Use during problem-solving","Speak steps aloud","Sketch & summarize"]} />
          <MiniTile icon={<PlayCircle className="w-4 h-4 text-emerald-300" />} title="Try now"
            lines={["Pick a topic from your course","Generate 3 self-questions","Test recall after a 5-min break"]} />
        </div>
      </div>
    </div>
  );
}

/* ============== Page ============== */
export default function AdvancedLearning(){
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [enrolled,setEnrolled]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedId,setSelectedId]=useState(courseId||null);
  const [activeCourse,setActiveCourse]=useState(null);
  const [activeCourseFull,setActiveCourseFull]=useState(null); // includes lectures
  const [openToolkitKey,setOpenToolkitKey]=useState(null);

  // Load enrollments
  useEffect(()=>{
    (async ()=>{
      try{
        const token=localStorage.getItem("token");
        const res=await fetch(`${API}/api/enrollments?ts=${Date.now()}`,{
          headers:{
            "Content-Type":"application/json",
            ...(token?{Authorization:`Bearer ${token}`}:{})
          },
          credentials:"include",
        });
        if(res.status===401){
          const next=encodeURIComponent(window.location.pathname+window.location.search);
          window.location.href=`/login?next=${next}`;
          return;
        }
        const data=await res.json().catch(()=>[]);
        const arr=Array.isArray(data)?data:[];
        setEnrolled(arr);
        if(!selectedId && arr.length>0) setSelectedId(arr[0].courseId || arr[0].id || arr[0]._id);
      }catch(e){ console.error("Enrollments load failed",e); }
      finally{ setLoading(false); }
    })();
  },[]);

  // Resolve selected course (enrollment object)
  useEffect(()=>{
    if(!selectedId){ setActiveCourse(null); return; }
    const c = enrolled.find(x=>(x.courseId||x.id||x._id)===selectedId) || null;
    setActiveCourse(c);
  },[selectedId,enrolled]);

  // Load full course (lectures etc.)
  useEffect(()=>{
    (async ()=>{
      if(!selectedId) { setActiveCourseFull(null); return; }
      try{
        const token=localStorage.getItem("token");
        // NOTE: adjust this path to your actual course details API if needed
        const res=await fetch(`${API}/courses/${selectedId}`,{  // ← adjust if needed
          headers:{ "Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{}) },
          credentials:"include",
        });
        if(res.ok){
          const data=await res.json().catch(()=>({}));
          const payload=data?.data ?? data;
          setActiveCourseFull(payload);
        }else{
          setActiveCourseFull(null);
        }
      }catch{ setActiveCourseFull(null); }
    })();
  },[selectedId]);

  const courseKey = activeCourse ? (activeCourse.courseId || activeCourse.id || activeCourse._id) : null;

  /* ===== Video section state ===== */
  const lectures = Array.isArray(activeCourseFull?.lectures) ? activeCourseFull.lectures : [];
  const [lecIndex, setLecIndex] = useState(0);
  useEffect(()=>{ setLecIndex(0); }, [selectedId]); // reset when course changes
  const currentVideo = lectures[lecIndex]?.videoUrl || "";
  const embedSrc = getEmbedUrl(currentVideo);

  return (
    <div className={`min-h-screen ${pageBg} text-slate-100`}>
      <Navbar />
      <div className="mt-16" />

      {/* Vertical hover-reveal sidebar (left) */}
      <VerticalToolkit activeKey={openToolkitKey} onOpen={setOpenToolkitKey} />
      <ToolkitDrawer openKey={openToolkitKey} onClose={()=>setOpenToolkitKey(null)} />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-amber-300" />
            Advanced Learning Lab
          </h1>
          <button onClick={()=>navigate("/explore")} className={glowBtn}>
            Explore Courses <Rocket className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-slate-400 max-w-3xl">
          Keep your **course** context while you focus. Use Pomodoro, make a Transcript from a lecture, and practice with Flashcards.
        </p>
      </header>

      {/* Main grid: two columns */}
      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">

        {/* LEFT: Course watcher + quick info */}
        <section className="space-y-6">
          {/* Active course strip (compact) */}
          <div className={`${card} p-4 flex items-center gap-3`}>
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              {activeCourse?.thumbnail ? (
                <img src={activeCourse.thumbnail} alt="course" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-200 font-semibold truncate">
                {activeCourse?.courseName || activeCourse?.title || activeCourse?.name || "Select a course"}
              </div>
              <div className="text-slate-400 text-xs">Active Course</div>
            </div>
            <button
              onClick={()=>{
                // simple inline picker: cycle through enrolled on click
                if(!enrolled.length) return;
                const list = enrolled.map(e=>e.courseId||e.id||e._id);
                const idx = Math.max(0, list.indexOf(selectedId));
                const next = list[(idx+1)%list.length];
                setSelectedId(next);
                navigate(`/advanced-learning/${next}`);
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
            >
              Change
            </button>
          </div>

          {/* VIDEO PLAYER with lecture picker */}
          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <h3 className={`${sectionTitle} flex items-center gap-2`}>
                <PlayCircle className="w-5 h-5 text-emerald-300" /> Watch Lecture
              </h3>
              {lectures.length > 0 && (
                <select
                  value={lecIndex}
                  onChange={(e)=>setLecIndex(+e.target.value)}
                  className={`${soft} px-2 py-1 text-slate-100`}
                >
                  {lectures.map((lec, i)=>(
                    <option key={i} value={i}>{lec.title || `Lecture ${i+1}`}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-3 relative pt-[56.25%] rounded-xl overflow-hidden border border-slate-700 bg-black">
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title={lectures[lecIndex]?.title || "Course Video"}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm">
                  No video URL for this lecture.
                </div>
              )}
            </div>

            {/* Small hover-reveal buttons */}
            <div className="mt-3 flex items-center gap-3">
              {/* Requirements */}
              <HoverBubble
                icon={<ClipboardList className="w-4 h-4" />}
                label="Requirements"
                color="emerald"
              >
                <ListOrEmpty items={activeCourseFull?.requirements} empty="No requirements listed." />
              </HoverBubble>

              {/* Resources */}
              <HoverBubble
                icon={<FolderOpen className="w-4 h-4" />}
                label="Resources"
                color="cyan"
              >
                <ResourceBlock resources={activeCourseFull?.resources} />
              </HoverBubble>

              {/* Assignments */}
              <HoverBubble
                icon={<BookOpen className="w-4 h-4" />}
                label="Assignments"
                color="violet"
              >
                <ListOrEmpty items={activeCourseFull?.assignments} empty="No assignments listed." />
              </HoverBubble>
            </div>
          </div>

          {/* Modern learning tiles (in page, compact) */}
          <section className={`${card} p-4`}>
            <h3 className={`${sectionTitle} mb-2`}>Modern Learning Toolkit</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <MiniTile icon={<Brain className="w-5 h-5 text-fuchsia-300" />} title="Deep Encoding"
                lines={["Elaborate links to prior knowledge","Dual-code (text + sketch)","Self-explain steps aloud"]} />
              <MiniTile icon={<Sparkles className="w-5 h-5 text-cyan-300" />} title="Retention"
                lines={["Spaced repetition (use Flashcards)","Interleave topics","Sleep + short breaks"]} />
              <MiniTile icon={<NotebookPen className="w-5 h-5 text-emerald-300" />} title="Cornell / Feynman"
                lines={["Cues | notes | summary","Teach simply; find gaps; refine","Create test questions"]} />
              <MiniTile icon={<Shuffle className="w-5 h-5 text-amber-300" />} title="Interleaving"
                lines={["Mix problem types","Rotate topics each session"]} />
              <MiniTile icon={<BookOpen className="w-5 h-5 text-rose-300" />} title="Exam Strategy"
                lines={["Two-pass; mark & move","Time by marks","Quick error check at end"]} />
            </div>
          </section>
        </section>

        {/* RIGHT: Workflow */}
        <section className="space-y-6">
          <Pomodoro />
          <TranscriptTool course={activeCourseFull} />
          <Flashcards courseKey={courseKey} />
        </section>
      </main>
    </div>
  );
}

/* ============== Hover bubble reveal (for buttons) ============== */
function HoverBubble({ icon, label, color="cyan", children }) {
  const colorMap = {
    cyan: "bg-cyan-600/20 text-cyan-200 border-cyan-600/30",
    emerald: "bg-emerald-600/20 text-emerald-200 border-emerald-600/30",
    violet: "bg-violet-600/20 text-violet-200 border-violet-600/30",
  }[color] || "bg-cyan-600/20 text-cyan-200 border-cyan-600/30";

  return (
    <div className="relative group">
      <button
        className={`w-9 h-9 grid place-items-center rounded-full border ${colorMap}
                    transition transform hover:scale-105`}
        title={label}
      >
        {icon}
      </button>
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition
                      w-64 p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-200 shadow-xl z-10">
        <div className="text-xs font-semibold mb-1">{label}</div>
        <div className="text-xs text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}
function ListOrEmpty({ items, empty }) {
  if (!Array.isArray(items) || items.length === 0) return <div>{empty}</div>;
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}
function ResourceBlock({ resources }) {
  const r = resources && typeof resources === "object" ? resources : {};
  const links = Array.isArray(r.links) ? r.links : [];
  const books = Array.isArray(r.books) ? r.books : [];
  const cheats = Array.isArray(r.cheatsheets) ? r.cheatsheets : [];
  return (
    <div className="space-y-2">
      {links.length>0 && (
        <div>
          <div className="font-semibold">Links</div>
          <ul className="list-disc list-inside text-[11px] space-y-1">
            {links.map((x,i)=>(
              <li key={i}><a href={x} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{x}</a></li>
            ))}
          </ul>
        </div>
      )}
      {books.length>0 && (
        <div>
          <div className="font-semibold">Books</div>
          <ul className="list-disc list-inside text-[11px] space-y-1">{books.map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
      )}
      {cheats.length>0 && (
        <div>
          <div className="font-semibold">Cheatsheets</div>
          <ul className="list-disc list-inside text-[11px] space-y-1">
            {cheats.map((x,i)=>(
              <li key={i}><a href={x} target="_blank" rel="noreferrer" className="text-violet-300 underline">{x}</a></li>
            ))}
          </ul>
        </div>
      )}
      {links.length+books.length+cheats.length===0 && <div>No resources listed.</div>}
    </div>
  );
}
