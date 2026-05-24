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

const inputBase =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all placeholder:text-slate-300";

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
      className="border-b border-slate-100 last:border-b-0 hover:bg-teal-50/30 transition-colors"
    >
      {/* ── Mobile: stacked card layout ── */}
      <div className="flex md:hidden flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Course ${index + 1}`}
            value={course.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`${inputBase} flex-1`}
          />
          <button
            onClick={onDelete}
            disabled={!canDelete}
            className="flex-shrink-0 w-9 h-9 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Remove course"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 pl-0.5">
              Grade Points
            </label>
            <input
              type="number"
              placeholder="0.00 – 4.00"
              min={0}
              max={4}
              step={0.01}
              value={course.gradePoints === "" ? "" : course.gradePoints}
              onChange={(e) => onChange("gradePoints", parseFloat(e.target.value) || "")}
              className={`${inputBase} text-center`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 pl-0.5">
              Credit Hours
            </label>
            <input
              type="number"
              placeholder="3"
              min={1}
              max={6}
              step={1}
              value={course.creditHours === "" ? "" : course.creditHours}
              onChange={(e) => onChange("creditHours", parseFloat(e.target.value) || "")}
              className={`${inputBase} text-center`}
            />
          </div>
        </div>
      </div>

      {/* ── Desktop: single-row grid layout ── */}
      <div className="hidden md:grid grid-cols-[1fr_120px_110px_44px] gap-3 px-4 py-3 items-center group">
        <input
          type="text"
          placeholder={`Course ${index + 1}`}
          value={course.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={inputBase}
        />
        <input
          type="number"
          placeholder="0.00"
          min={0}
          max={4}
          step={0.01}
          value={course.gradePoints === "" ? "" : course.gradePoints}
          onChange={(e) => onChange("gradePoints", parseFloat(e.target.value) || "")}
          className={`${inputBase} text-center`}
        />
        <input
          type="number"
          placeholder="3"
          min={1}
          max={6}
          step={1}
          value={course.creditHours === "" ? "" : course.creditHours}
          onChange={(e) => onChange("creditHours", parseFloat(e.target.value) || "")}
          className={`${inputBase} text-center`}
        />
        <button
          onClick={onDelete}
          disabled={!canDelete}
          className="w-9 h-9 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          aria-label="Remove course"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
