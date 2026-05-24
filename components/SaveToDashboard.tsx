"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkCheck, Bookmark, Check } from "lucide-react";
import { useDashboard } from "@/lib/store";

interface SaveToDashboardProps {
  /** Display name for this semester, e.g. "Semester 1" */
  semesterName: string;
  /** The calculated GPA to save */
  gpa: number | null;
  /** Total credit hours */
  totalCredits: number;
}

export function SaveToDashboard({
  semesterName,
  gpa,
  totalCredits,
}: SaveToDashboardProps) {
  const { saveSemester } = useDashboard();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (gpa === null || totalCredits === 0) return;
    saveSemester(semesterName, gpa, totalCredits);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const disabled = gpa === null || totalCredits === 0;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={handleSave}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
        ${
          saved
            ? "bg-emerald-500 text-white shadow-sm"
            : disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 hover:border-teal-300"
        }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {saved ? (
          <motion.span
            key="saved"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={15} /> Saved to Dashboard
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Bookmark size={15} /> Save to Dashboard
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
