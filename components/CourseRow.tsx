"use client";

import { Trash2 } from "lucide-react";
import { Course } from "@/lib/utils";
import { motion } from "framer-motion";

interface CourseRowProps {
  course: Course;
  index: number;
  canDelete: boolean;
  onChange: (field: keyof Course, value: string | number) => void;
  onDelete: () => void;
}

export function CourseRow({
  course,
  index,
  canDelete,
  onChange,
  onDelete,
}: CourseRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-[1fr_120px_110px_44px] gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-teal-50/30 transition-colors items-center group"
    >
      <input
        type="text"
        placeholder={`Course ${index + 1}`}
        value={course.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all placeholder:text-slate-300"
      />
      <input
        type="number"
        placeholder="0.00"
        min={0}
        max={4}
        step={0.01}
        value={course.gradePoints === "" ? "" : course.gradePoints}
        onChange={(e) => onChange("gradePoints", parseFloat(e.target.value) || "")}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all text-center placeholder:text-slate-300"
      />
      <input
        type="number"
        placeholder="3"
        min={1}
        max={6}
        step={1}
        value={course.creditHours === "" ? "" : course.creditHours}
        onChange={(e) => onChange("creditHours", parseFloat(e.target.value) || "")}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all text-center placeholder:text-slate-300"
      />
      <button
        onClick={onDelete}
        disabled={!canDelete}
        className="w-9 h-9 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        aria-label="Remove course"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
