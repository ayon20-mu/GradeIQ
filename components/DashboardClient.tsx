"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  GraduationCap,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Pencil,
  Check,
  X,
  Plus,
  LayoutDashboard,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useDashboard } from "@/lib/store";
import { getLetterGrade, formatRelativeTime } from "@/lib/utils";
import type { SavedSemester } from "@/lib/utils";

// ── SVG Sparkline chart ───────────────────────────────────────────────────────
function GPASparkline({ semesters }: { semesters: SavedSemester[] }) {
  if (semesters.length < 2) return null;

  const sorted = [...semesters].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true })
  );

  const W = 400;
  const H = 100;
  const PAD = { top: 12, right: 16, bottom: 28, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const minGPA = Math.max(0, Math.min(...sorted.map((s) => s.gpa)) - 0.3);
  const maxGPA = Math.min(4, Math.max(...sorted.map((s) => s.gpa)) + 0.3);
  const range = maxGPA - minGPA || 1;

  const toX = (i: number) => PAD.left + (i / (sorted.length - 1)) * innerW;
  const toY = (gpa: number) => PAD.top + innerH - ((gpa - minGPA) / range) * innerH;

  const linePath = sorted
    .map((s, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(s.gpa).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${toX(sorted.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  const trend = sorted[sorted.length - 1].gpa - sorted[sorted.length - 2].gpa;
  const lineColor = trend >= 0 ? "#009688" : "#ef4444";
  const areaColor = trend >= 0 ? "url(#tealGrad)" : "url(#redGrad)";

  // Y-axis labels
  const yTicks = [minGPA, (minGPA + maxGPA) / 2, maxGPA].map((v) =>
    Math.min(4, Math.max(0, v))
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 100 }}
      aria-label="GPA trend chart"
    >
      <defs>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#009688" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#009688" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={toY(v)}
            y2={toY(v)}
            stroke="#f1f5f9"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 5}
            y={toY(v) + 4}
            textAnchor="end"
            fontSize={9}
            fill="#94a3b8"
          >
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill={areaColor} />

      {/* Line */}
      <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* Data points + x-axis labels */}
      {sorted.map((s, i) => (
        <g key={s.id}>
          <circle
            cx={toX(i)}
            cy={toY(s.gpa)}
            r={3.5}
            fill="white"
            stroke={lineColor}
            strokeWidth={2}
          />
          <text
            x={toX(i)}
            y={H - 4}
            textAnchor={i === 0 ? "start" : i === sorted.length - 1 ? "end" : "middle"}
            fontSize={8}
            fill="#94a3b8"
          >
            {s.name.replace(/semester\s*/i, "Sem ")}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Small reusable sub-components ────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border flex flex-col gap-3 ${
        accent
          ? "bg-gradient-to-br from-teal-500 to-teal-700 border-teal-600 text-white shadow-[0_4px_20px_rgba(0,150,136,.25)]"
          : "bg-white border-teal-100 shadow-[0_2px_12px_rgba(10,28,42,.05)]"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          accent ? "bg-white/20" : "bg-teal-50 text-teal-500"
        }`}
      >
        <Icon size={18} className={accent ? "text-white" : ""} />
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${accent ? "text-teal-100" : "text-slate-400"}`}>
          {label}
        </p>
        <motion.p
          key={value}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className={`font-serif text-3xl leading-none ${accent ? "text-white" : "text-navy"}`}
        >
          {value}
        </motion.p>
        {sub && (
          <p className={`text-xs mt-1.5 ${accent ? "text-teal-100" : "text-slate-400"}`}>{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

function TrendBadge({ semesters }: { semesters: SavedSemester[] }) {
  if (semesters.length < 2) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
        <Minus size={12} /> Not enough data
      </span>
    );
  }
  const sorted = [...semesters].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const diff = last.gpa - prev.gpa;

  if (diff > 0.05) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        <TrendingUp size={13} /> Improving (+{diff.toFixed(2)})
      </span>
    );
  }
  if (diff < -0.05) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100">
        <TrendingDown size={13} /> Dropping ({diff.toFixed(2)})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
      <Minus size={12} /> Stable ({diff >= 0 ? "+" : ""}{diff.toFixed(2)})
    </span>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function DashboardClient() {
  const {
    store,
    hydrated,
    setUserName,
    setTargetGPA,
    deleteSemester,
    clearAll,
  } = useDashboard();

  // Name editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Target GPA editing
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const targetRef = useRef<HTMLInputElement>(null);

  // First-visit: if no name set, show inline setup
  const isFirstVisit = hydrated && !store.userName;

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingTarget && targetRef.current) targetRef.current.focus();
  }, [editingTarget]);

  // Derived stats
  const sems = store.semesters;
  const cgpa =
    sems.length > 0
      ? sems.reduce((s, sem) => s + sem.gpa * sem.totalCredits, 0) /
        sems.reduce((s, sem) => s + sem.totalCredits, 0)
      : null;
  const totalCredits = sems.reduce((s, sem) => s + sem.totalCredits, 0);
  const targetProgress =
    store.targetGPA && cgpa !== null
      ? Math.min(100, (cgpa / store.targetGPA) * 100)
      : 0;
  const onTrack =
    store.targetGPA && cgpa !== null ? cgpa >= store.targetGPA : null;

  // Skeleton while hydrating
  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-6">
        <div className="h-10 bg-slate-100 rounded-2xl w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── First-visit onboarding ────────────────────────────────────────────────
  if (isFirstVisit) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-teal-100 shadow-[0_4px_32px_rgba(0,150,136,.1)] p-8 sm:p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={32} className="text-teal-500" />
          </div>
          <h1 className="font-serif text-3xl text-navy mb-2">Welcome to GradeIQ</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your personal student result tracker. Let's start by setting up your profile.
          </p>
          <div className="text-left mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sam"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) {
                  setUserName(nameInput.trim());
                }
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all"
              autoFocus
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (nameInput.trim()) setUserName(nameInput.trim());
            }}
            disabled={!nameInput.trim()}
            className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Get Started →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

      {/* ── Header greeting ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={16} className="text-teal-500" />
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-wider">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {editingName ? (
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (nameInput.trim()) setUserName(nameInput.trim());
                  setEditingName(false);
                }}
              >
                <input
                  ref={nameRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="font-serif text-3xl sm:text-4xl text-navy bg-transparent border-b-2 border-teal-400 outline-none w-40"
                />
                <button type="submit" className="text-teal-500 hover:text-teal-700 transition-colors">
                  <Check size={20} />
                </button>
                <button type="button" onClick={() => setEditingName(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <h1 className="font-serif text-3xl sm:text-4xl text-navy">
                Welcome back, {store.userName} 👋
              </h1>
            )}
            {!editingName && (
              <button
                onClick={() => { setNameInput(store.userName); setEditingName(true); }}
                className="text-slate-300 hover:text-teal-500 transition-colors"
                aria-label="Edit name"
              >
                <Pencil size={15} />
              </button>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {sems.length === 0
              ? "No semesters saved yet. Calculate a GPA and save it."
              : `${sems.length} semester${sems.length > 1 ? "s" : ""} tracked · ${totalCredits} total credits`}
          </p>
        </div>

        <Link
          href="/cgpa"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors shadow-[0_4px_12px_rgba(0,150,136,.25)] hover:-translate-y-0.5"
        >
          <Plus size={15} /> Add Semester
        </Link>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <MetricCard
            label="Current CGPA"
            value={cgpa !== null ? cgpa.toFixed(2) : "—"}
            sub={cgpa !== null ? getLetterGrade(cgpa) : "No data yet"}
            accent
            icon={GraduationCap}
          />
        </div>
        <MetricCard
          label="Semesters"
          value={String(sems.length)}
          sub="tracked"
          icon={BookOpen}
        />
        <MetricCard
          label="Total Credits"
          value={String(totalCredits)}
          sub="earned"
          icon={BarChart3}
        />
        <div>
          <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(10,28,42,.05)] flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500">
                <TrendingUp size={18} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trend</p>
            </div>
            <TrendBadge semesters={sems} />
          </div>
        </div>
      </div>

      {/* ── GPA trend sparkline ── */}
      {sems.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-teal-100 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(10,28,42,.05)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-teal-500" />
              <h2 className="font-semibold text-navy text-base">GPA Trend</h2>
            </div>
            <TrendBadge semesters={sems} />
          </div>
          <GPASparkline semesters={sems} />
        </motion.div>
      )}

      {/* ── Target GPA tracking ── */}
      <div className="bg-white border border-teal-100 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(10,28,42,.05)]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-teal-500" />
            <h2 className="font-semibold text-navy text-base">Target CGPA</h2>
          </div>
          {editingTarget ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const val = parseFloat(targetInput);
                if (!isNaN(val) && val > 0 && val <= 4) {
                  setTargetGPA(val);
                }
                setEditingTarget(false);
              }}
            >
              <input
                ref={targetRef}
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="e.g. 3.70"
                className="w-24 px-3 py-1.5 border border-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 text-center"
              />
              <button type="submit" className="text-teal-500 hover:text-teal-700"><Check size={18} /></button>
              <button type="button" onClick={() => setEditingTarget(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </form>
          ) : (
            <button
              onClick={() => { setTargetInput(store.targetGPA?.toString() ?? ""); setEditingTarget(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 border border-teal-200 rounded-full px-3 py-1.5 hover:bg-teal-50 transition-colors"
            >
              <Pencil size={12} /> {store.targetGPA ? "Edit target" : "Set target"}
            </button>
          )}
        </div>

        {store.targetGPA ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Current: <strong className="text-navy">{cgpa !== null ? cgpa.toFixed(2) : "—"}</strong>
              </span>
              <span className="text-slate-500">
                Target: <strong className="text-teal-600">{store.targetGPA.toFixed(2)}</strong>
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${targetProgress}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">0.00</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  onTrack
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {onTrack ? "✓ On track" : `${(store.targetGPA - (cgpa ?? 0)).toFixed(2)} more needed`}
                {" · "}{targetProgress.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">4.00</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm py-4 text-center border border-dashed border-slate-200 rounded-xl">
            Set a target CGPA to track your progress here.
          </p>
        )}
      </div>

      {/* ── Semester breakdown ── */}
      <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(10,28,42,.05)]">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-teal-500" />
            <h2 className="font-semibold text-navy text-base">Semester Breakdown</h2>
          </div>
          {sems.length > 0 && (
            <span className="text-xs text-slate-400">{sems.length} saved</span>
          )}
        </div>

        {sems.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={24} className="text-teal-300" />
            </div>
            <p className="text-slate-500 text-sm mb-4">No semesters saved yet.</p>
            <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
              Use the GPA or CGPA calculator, then click{" "}
              <span className="font-semibold text-teal-600">"Save to Dashboard"</span>{" "}
              to see your results here.
            </p>
            <Link
              href="/cgpa"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors"
            >
              Go to CGPA Calculator <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_110px_110px_80px_44px] gap-3 px-6 py-3 bg-teal-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <span>Semester</span>
              <span className="text-center">GPA</span>
              <span className="text-center">Credits</span>
              <span className="text-center">Grade</span>
              <span />
            </div>

            <AnimatePresence initial={false}>
              {sems.map((sem, i) => {
                const barWidth = Math.min(100, (sem.gpa / 4) * 100);
                const gpaColor =
                  sem.gpa >= 3.5
                    ? "text-emerald-600"
                    : sem.gpa >= 3.0
                    ? "text-teal-600"
                    : sem.gpa >= 2.5
                    ? "text-amber-600"
                    : "text-red-500";
                const barColor =
                  sem.gpa >= 3.5
                    ? "from-emerald-400 to-emerald-500"
                    : sem.gpa >= 3.0
                    ? "from-teal-400 to-teal-500"
                    : sem.gpa >= 2.5
                    ? "from-amber-400 to-amber-500"
                    : "from-red-400 to-red-500";

                return (
                  <motion.div
                    key={sem.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-teal-50/30 transition-colors"
                  >
                    {/* Desktop row */}
                    <div className="hidden sm:grid grid-cols-[1fr_110px_110px_80px_44px] gap-3 px-6 py-4 items-center">
                      <div>
                        <p className="text-sm font-semibold text-navy">{sem.name}</p>
                        {/* Mini bar */}
                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden w-full max-w-[160px]">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-300 mt-1">{formatRelativeTime(sem.savedAt)}</p>
                      </div>
                      <p className={`text-center font-serif text-xl font-medium ${gpaColor}`}>
                        {sem.gpa.toFixed(2)}
                      </p>
                      <p className="text-center text-sm text-slate-500">{sem.totalCredits}</p>
                      <p className="text-center text-xs text-slate-400">
                        {sem.gpa >= 3.7 ? "A" : sem.gpa >= 3.3 ? "A−" : sem.gpa >= 3.0 ? "B+" : sem.gpa >= 2.7 ? "B" : sem.gpa >= 2.3 ? "B−" : sem.gpa >= 2.0 ? "C+" : "C"}
                      </p>
                      <button
                        onClick={() => deleteSemester(sem.id)}
                        className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all"
                        aria-label="Remove semester"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Mobile row */}
                    <div className="sm:hidden px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-navy">{sem.name}</p>
                          <p className="text-[10px] text-slate-300">{formatRelativeTime(sem.savedAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-serif text-lg ${gpaColor}`}>{sem.gpa.toFixed(2)}</span>
                          <button
                            onClick={() => deleteSemester(sem.id)}
                            className="w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5">{sem.totalCredits} credits</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/gpa", label: "Semester GPA Calculator", desc: "Calculate a single semester", icon: BarChart3 },
          { href: "/cgpa", label: "CGPA Calculator", desc: "Track all semesters", icon: GraduationCap },
          { href: "/needed", label: "Goal GPA Calculator", desc: "Plan your remaining semesters", icon: Target },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,150,136,.1)] transition-all duration-200"
          >
            <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
              <item.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy group-hover:text-teal-600 transition-colors truncate">{item.label}</p>
              <p className="text-xs text-slate-400 truncate">{item.desc}</p>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-teal-500 ml-auto flex-shrink-0 transition-colors" />
          </Link>
        ))}
      </div>

      {/* ── Danger zone ── */}
      {sems.length > 0 && (
        <div className="border border-red-100 rounded-2xl p-5 bg-red-50/30">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Danger Zone</p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-500">Clear all saved semesters and reset dashboard data.</p>
            <button
              onClick={() => {
                if (window.confirm("Clear all dashboard data? This cannot be undone.")) {
                  clearAll();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
