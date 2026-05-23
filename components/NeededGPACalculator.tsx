"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { NeededSemester, makeNeededSem, uid, getLetterGrade } from "@/lib/utils";

const INITIAL_SEMS: NeededSemester[] = [
  { id: uid(), name: "Semester N+1", expectedGPA: "", creditHours: 15 },
];

export function NeededGPACalculator() {
  const [currentCGPA, setCurrentCGPA] = useState<string>("");
  const [completedCredits, setCompletedCredits] = useState<string>("");
  const [remainingSems, setRemainingSems] = useState<NeededSemester[]>(INITIAL_SEMS);

  // Derived
  const curCGPA = parseFloat(currentCGPA) || 0;
  const doneCr = parseFloat(completedCredits) || 0;
  const remTotal = remainingSems.reduce((s, sem) => {
    const gp = typeof sem.expectedGPA === "number" ? sem.expectedGPA : 0;
    const cr = typeof sem.creditHours === "number" ? sem.creditHours : 0;
    return { gp: s.gp + gp * cr, cr: s.cr + cr };
  }, { gp: 0, cr: 0 });

  const canCalc = doneCr > 0 && remTotal.cr > 0;
  const predicted = canCalc
    ? (curCGPA * doneCr + remTotal.gp) / (doneCr + remTotal.cr)
    : null;
  const progress = predicted !== null ? Math.min(100, (predicted / 4) * 100) : 0;
  const curProgress = curCGPA > 0 ? Math.min(100, (curCGPA / 4) * 100) : 0;

  const addSem = () =>
    setRemainingSems((prev) => [...prev, makeNeededSem(prev.length + 1)]);
  const removeSem = (id: string) =>
    setRemainingSems((prev) => prev.filter((s) => s.id !== id));
  const updateSem = (
    id: string,
    field: keyof NeededSemester,
    value: string | number
  ) =>
    setRemainingSems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  const reset = () => {
    setCurrentCGPA("");
    setCompletedCredits("");
    setRemainingSems(INITIAL_SEMS.map((s) => ({ ...s, id: uid(), expectedGPA: "", creditHours: 15 })));
  };

  const getTag = (gpa: number) => {
    if (gpa >= 3.5) return { label: "Excellent", cls: "bg-emerald-100 text-emerald-700" };
    if (gpa >= 3.0) return { label: "Good", cls: "bg-teal-100 text-teal-700" };
    if (gpa >= 2.5) return { label: "Satisfactory", cls: "bg-amber-100 text-amber-700" };
    return { label: "Needs Work", cls: "bg-red-100 text-red-600" };
  };

  return (
    <div className="space-y-5">
      {/* Result */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-teal">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-teal-100 text-sm font-medium mb-1">Predicted Final CGPA</p>
            <motion.div
              key={String(predicted)}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="font-serif text-6xl leading-none"
            >
              {predicted !== null ? predicted.toFixed(2) : "—"}
            </motion.div>
            {predicted !== null && (
              <p className="text-teal-100 text-sm mt-2">{getLetterGrade(predicted)}</p>
            )}
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-3 text-center">
            <div className="text-lg font-bold">{remTotal.cr}</div>
            <div className="text-teal-100 text-xs mt-0.5">Rem. Credits</div>
          </div>
        </div>
      </div>

      {/* Current info */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-card p-6">
        <h2 className="font-semibold text-navy text-sm mb-4 uppercase tracking-wide text-slate-400">
          Current Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current CGPA
            </label>
            <input
              type="number"
              min={0}
              max={4}
              step={0.01}
              placeholder="e.g. 3.20"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Completed Credit Hours
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 90"
              value={completedCredits}
              onChange={(e) => setCompletedCredits(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Remaining semesters */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-card overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_110px_44px] gap-3 px-4 py-3 bg-teal-50/60 border-b border-teal-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Semester</span>
          <span>Expected GPA</span>
          <span>Credit Hours</span>
          <span />
        </div>
        <AnimatePresence initial={false}>
          {remainingSems.map((sem, i) => (
            <motion.div
              key={sem.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[1fr_140px_110px_44px] gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-teal-50/20 transition-colors"
            >
              <input
                type="text"
                placeholder={`Semester ${i + 1}`}
                value={sem.name}
                onChange={(e) => updateSem(sem.id, "name", e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all"
              />
              <input
                type="number"
                min={0}
                max={4}
                step={0.01}
                placeholder="0.00–4.00"
                value={sem.expectedGPA === "" ? "" : sem.expectedGPA}
                onChange={(e) =>
                  updateSem(sem.id, "expectedGPA", parseFloat(e.target.value) || "")
                }
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all text-center"
              />
              <input
                type="number"
                min={1}
                placeholder="15"
                value={sem.creditHours === "" ? "" : sem.creditHours}
                onChange={(e) =>
                  updateSem(sem.id, "creditHours", parseFloat(e.target.value) || "")
                }
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all text-center"
              />
              <button
                onClick={() => removeSem(sem.id)}
                disabled={remainingSems.length <= 1}
                className="w-9 h-9 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress visualization */}
      {canCalc && predicted !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-teal-100 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-500">
              Current: <strong className="text-navy">{curCGPA.toFixed(2)}</strong>
            </span>
            <span className="text-slate-500">
              Predicted: <strong className="text-teal-600">{predicted.toFixed(2)}</strong>
            </span>
          </div>
          {/* Track */}
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            {/* Current marker */}
            <div
              className="absolute top-0 bottom-0 bg-slate-300 rounded-full transition-all duration-500"
              style={{ width: `${curProgress}%` }}
            />
            {/* Predicted fill */}
            <motion.div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>0.00</span>
            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${getTag(predicted).cls}`}>
              {getTag(predicted).label} — {progress.toFixed(1)}% of 4.0
            </span>
            <span>4.00</span>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addSem}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors shadow-teal"
        >
          <Plus size={16} /> Add Semester
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} /> Reset
        </motion.button>
      </div>
    </div>
  );
}
