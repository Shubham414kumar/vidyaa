import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Bell,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Subject = {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  lastMarked?: string | null; // ISO string
};

const STORAGE_KEY = "vidyasphere_attendance_v1";

function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const calcPercentage = (attended: number, total: number) =>
  total === 0 ? 0 : Math.round((attended / total) * 100);

const classesNeededToReach75 = (attended: number, total: number) => {
  const target = 0.75;
  if (total === 0) {
    // find minimal n s.t. (attended + n)/(total + n) >= 0.75
    // with attended = 0 => n / n >= 0.75 => true for any n>0 but percent =100? handle:
    // safer: compute numerically
  }
  if ((attended / (total || 1)) >= target) return 0;
  const numerator = target * total - attended;
  const denom = 1 - target;
  return Math.max(0, Math.ceil(numerator / denom));
};

export default function Attendance() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const { toast } = useToast();

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Subject[] = JSON.parse(raw);
        setSubjects(parsed.map(s => ({ ...s, lastMarked: s.lastMarked ?? null })));
      }
    } catch (e) {
      console.error("Failed to load attendance", e);
    }
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  // Browser Notification permission prompt (once)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Hourly check for pending marks -> show browser notification if any pending
  useEffect(() => {
    const checkAndNotify = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      const now = Date.now();
      const pending = subjects.filter(s => {
        if (!s.lastMarked) return true;
        const diff = now - new Date(s.lastMarked).getTime();
        return diff >= 24 * 3600 * 1000;
      });
      if (pending.length > 0) {
        const title = "Reminder: Mark today's attendance";
        const body = `You have ${pending.length} subject(s) pending for today. Click the app to mark.`;
        new Notification(title, { body, icon: "/attendance-poster.png" });
      }
    };

    // run immediately once when mounted
    checkAndNotify();
    const id = setInterval(checkAndNotify, 60 * 60 * 1000); // every hour
    return () => clearInterval(id);
  }, [subjects]);

  const addSubject = () => {
    const name = newSubject.trim();
    if (!name) return;
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Subject exists", description: `${name} already added.`, variant: "destructive" });
      return;
    }
    const s: Subject = { id: uid("sub-"), name, totalClasses: 0, attendedClasses: 0, lastMarked: null };
    setSubjects(prev => [s, ...prev]);
    setNewSubject("");
    toast({ title: "Added", description: `${name} added.` });
  };

  const removeSubject = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast({ title: "Removed", description: `${sub?.name} removed.`, variant: "destructive" });
  };

  const canMark = (s: Subject) => {
    if (!s.lastMarked) return true;
    const last = new Date(s.lastMarked).getTime();
    return (Date.now() - last) >= 24 * 3600 * 1000;
  };

  const markAttendance = (id: string, present: boolean) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        if (!canMark(s)) {
          toast({ title: "Already marked", description: "You can mark only once in 24 hours.", variant: "destructive" });
          return s;
        }
        const updated: Subject = {
          ...s,
          totalClasses: (s.totalClasses || 0) + 1,
          attendedClasses: (s.attendedClasses || 0) + (present ? 1 : 0),
          lastMarked: new Date().toISOString()
        };
        // show notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Attendance Updated", {
            body: `${updated.name}: marked ${present ? "Present" : "Absent"}. Now ${calcPercentage(updated.attendedClasses, updated.totalClasses)}%.`,
            icon: "/attendance-poster.png"
          });
        }
        toast({ title: "Marked", description: `${s.name} marked ${present ? "Present" : "Absent"}.` });
        return updated;
      })
    );
  };

  // overall stats
  const totalClassesAll = subjects.reduce((a, b) => a + b.totalClasses, 0);
  const totalAttendedAll = subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const overallPct = totalClassesAll === 0 ? 0 : Math.round((totalAttendedAll / totalClassesAll) * 100);

  // Small donut SVG
  const Donut = ({ percent, size = 140 }: { percent: number; size?: number }) => {
    const stroke = 12;
    const radius = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (percent / 100) * circumference;
    return (
      <svg width={size} height={size} className="mx-auto">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <g transform={`translate(${cx}, ${cy})`}>
          <circle r={radius} cx={0} cy={0} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
          <circle
            r={radius}
            cx={0}
            cy={0}
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${filled} ${circumference - filled}`}
            transform={`rotate(-90)`}
          />
          <text x={0} y={6} textAnchor="middle" fontSize={20} fontWeight="700" fill="#0f172a">
            {percent}%
          </text>
        </g>
      </svg>
    );
  };

  const getNeededText = (s: Subject) => {
    const pct = calcPercentage(s.attendedClasses, s.totalClasses);
    const needed = classesNeededToReach75(s.attendedClasses, s.totalClasses);
    if (pct >= 75) return { text: "On track ✅", color: "text-green-600" };
    if (s.totalClasses === 0) return { text: "Start attending — 75% goal", color: "text-yellow-600" };
    return { text: `Attend next ${needed} classes to reach 75%`, color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Attendance Tracker</h1>
              <p className="mt-2 text-slate-600 max-w-xl">
                Add your subjects, mark attendance once a day per subject, see subject-wise % and how many classes you
                need to reach 75%. Daily reminders and quick notifications included.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
                <Target className="w-5 h-5 text-indigo-600" /> Required: <strong className="ml-1">75%</strong>
              </div>
            </div>

            {/* Poster / Donut */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block mr-4">
                <img src="/attendance-illustration.png" alt="attendance" className="w-40 rounded-lg shadow-lg" />
              </div>
              <div className="bg-white p-3 rounded-xl shadow">
                <Donut percent={overallPct} />
                <p className="text-center text-slate-600 mt-2">Overall attendance</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ADD SUBJECT */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Subject name (e.g., Mathematics)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubject()}
            />
            <Button onClick={addSubject} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Subject
            </Button>
          </div>
        </motion.div>

        {/* Reminder banner */}
        {subjects.some(s => !s.lastMarked || !canMark(s)) ? (
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
              <Bell className="w-5 h-5" />
              <div>
                <div className="text-sm font-semibold">Daily Reminder</div>
                <div className="text-sm text-yellow-800">Don't forget to mark today's attendance for pending subjects.</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* SUBJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-8 text-center">
                <CardHeader>
                  <CardTitle>No subjects yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Start by adding your first subject — it's quick!</p>
                  <img src="/attendance-poster.png" alt="poster" className="mx-auto w-64 rounded-lg shadow" />
                </CardContent>
              </Card>
            </div>
          ) : (
            subjects.map(s => {
              const pct = calcPercentage(s.attendedClasses, s.totalClasses);
              const neededText = getNeededText(s);
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800">{s.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">Total: {s.totalClasses} • Present: {s.attendedClasses}</p>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                          <div
                            className={`h-3 rounded-full ${pct >= 75 ? "bg-green-500" : "bg-rose-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="text-sm font-semibold">{pct}%</div>
                            <div className={`text-xs mt-1 ${neededText.color}`}>{neededText.text}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button onClick={() => markAttendance(s.id, true)} disabled={!canMark(s)} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" /> Present
                            </Button>
                            <Button variant="outline" onClick={() => markAttendance(s.id, false)} disabled={!canMark(s)} className="flex items-center gap-2">
                              <XCircle className="w-4 h-4" /> Absent
                            </Button>
                            <Button variant="destructive" onClick={() => removeSubject(s.id)} className="flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* last marked info */}
                        <div className="text-xs text-slate-500 mt-2">
                          {s.lastMarked ? `Last marked: ${new Date(s.lastMarked).toLocaleString()}` : "Not marked yet"}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* FOOTER STATS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
          <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">Subjects</div>
              <div className="text-xl font-bold">{subjects.length}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Classes</div>
              <div className="text-xl font-bold">{totalClassesAll}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Present</div>
              <div className="text-xl font-bold">{totalAttendedAll}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Overall</div>
              <div className="text-xl font-bold">{overallPct}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Goal</div>
              <div className="text-xl font-bold text-indigo-600">75%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
