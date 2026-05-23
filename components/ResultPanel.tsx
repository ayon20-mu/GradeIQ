"use client";

import { motion } from "framer-motion";
import { cn, getLetterGrade } from "@/lib/utils";

interface ResultPanelProps {
  label: string;
  value: number | null;
  credits?: number;
  courses?: number;
  className?: string;
}

export function ResultPanel({
  label,
  value,
  credits,
  courses,
  className,
}: ResultPanelProps) {
  const display = value !== null ? value.toFixed(2) : "—";
  const grade = value !== null ? getLetterGrade(value) : null;

  return (
    <motion.div
      layout
      className={cn(
        "bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-teal",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-teal-100 text-sm font-medium mb-1">{label}</p>
          <motion.div
            key={display}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-serif text-6xl leading-none"
          >
            {display}
          </motion.div>
          {grade && (
            <p className="text-teal-100 text-sm mt-2">{grade}</p>
          )}
        </div>

        <div className="flex gap-3">
          {credits !== undefined && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className="text-lg font-bold">{credits}</div>
              <div className="text-teal-100 text-xs mt-0.5">Credits</div>
            </div>
          )}
          {courses !== undefined && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className="text-lg font-bold">{courses}</div>
              <div className="text-teal-100 text-xs mt-0.5">Courses</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
