"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, RefreshCw, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  Semester,
  Course,
  calcSemesterGPA,
  calcCGPA,
  makeSemester,
  makeCourse,
  uid,
} from "@/lib/utils";
import { CourseRow } from "@/components/CourseRow";
import { CalculatorCard, TableHead } from "@/components/CalculatorCard";
import { motion as m } from "framer-motion";

const INITIAL: Semester[] = [
  { id: uid(), name: "Semester 1", courses: [{ id: uid(), name: "", gradePoints: "", creditHours: 3 }], isOpen: true },
];

export function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>(INITIAL);

  const { cgpa, totalCredits } = calcCGPA(semesters);
  const totalCourses = semesters.reduce((s, sem) => s + sem.courses.length, 0);

  const addSemester = () =>
    setSemesters((prev) => [...prev, makeSemester(prev.length + 1)]);

  const removeSemester = (id: string) =>
    setSemesters((prev) => prev.filter((s) => s.id !== id));

  const toggleSemester = (id: string) =>
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s))
    );

  const updateSemesterName = (id: string, name: string) =>
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );

  const addCourse = (semId: string) =>
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId ? { ...s, courses: [...s.courses, makeCourse()] } : s
      )
    );

  const removeCourse = (semId: string, courseId: string) =>
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId
          ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
          : s
      )
    );

  const updateCourse = (
    semId: string,
    courseId: string,
    field: keyof Course,
    value: string | number
  ) =>
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId
          ? {
              ...s,
              courses: s.courses.map((c) =>
                c.id === courseId ? { ...c, [field]: value } : c
              ),
            }
          : s
      )
    );

  const reset = () =>
    setSemesters([
      { id: uid(), name: "Semester 1", courses: [{ id: uid(), name: "", gradePoints: "", creditHours: 3 }], isOpen: true },
    ]);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Final CGPA", value: cgpa !== null ? cgpa.toFixed(2) : "—", accent: true },
          { label: "Total Credits", value: totalCredits, accent: false },
          { label: "Semesters", value: semesters.length, accent: false },
        ].map((m) => (
          <div
            key={m.label}
            className={`rounded-2xl p-5 text-center border ${
              m.accent
                ? "bg-gradient-to-br from-teal-500 to-teal-700 border-teal-600 text-white shadow-teal"
                : "bg-white border-teal-100 shadow-card"
            }`}
          >
            <motion.div
              key={String(m.value)}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`font-serif text-3xl mb-1 ${m.accent ? "text-white" : "text-teal-600"}`}
            >
              {m.value}
            </motion.div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${m.accent ? "text-teal-100" : "text-slate-400"}`}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Semester Cards */}
      <AnimatePresence initial={false}>
        {semesters.map((sem, si) => {
          const semGPA = calcSemesterGPA(sem.courses);
          const semCredits = sem.courses.reduce(
            (s, c) => s + (typeof c.creditHours === "number" ? c.creditHours : 0),
            0
          );
          return (
            <motion.div
              key={sem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border border-teal-100 shadow-card overflow-hidden"
            >
              {/* Semester header */}
              <div
                className="flex items-center gap-3 px-4 py-4 bg-teal-50/60 border-b border-teal-100 cursor-pointer select-none"
                onClick={() => toggleSemester(sem.id)}
              >
                <input
                  type="text"
                  value={sem.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateSemesterName(sem.id, e.target.value)}
                  className="font-semibold text-navy bg-transparent border-none outline-none text-sm flex-1 min-w-0"
                />
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  GPA: {semGPA !== null ? semGPA.toFixed(2) : "—"}
                </span>
                <span className="text-slate-400 text-xs whitespace-nowrap">{semCredits} cr</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (semesters.length > 1) removeSemester(sem.id);
                  }}
                  disabled={semesters.length <= 1}
                  className="w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                  aria-label="Remove semester"
                >
                  <Trash2 size={13} />
                </button>
                <div className="text-slate-400">
                  {sem.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Semester body */}
              <AnimatePresence initial={false}>
                {sem.isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <TableHead cols={["Course Name", "Grade Points", "Credit Hours", ""]} />
                    <AnimatePresence initial={false}>
                      {sem.courses.map((course, ci) => (
                        <CourseRow
                          key={course.id}
                          course={course}
                          index={ci}
                          canDelete={sem.courses.length > 1}
                          onChange={(field, val) =>
                            updateCourse(sem.id, course.id, field, val)
                          }
                          onDelete={() => removeCourse(sem.id, course.id)}
                        />
                      ))}
                    </AnimatePresence>
                    <div className="px-4 py-3 border-t border-teal-50">
                      <button
                        onClick={() => addCourse(sem.id)}
                        className="text-teal-500 text-sm font-medium hover:text-teal-700 flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} /> Add course
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addSemester}
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
          <RefreshCw size={14} /> Reset All
        </motion.button>
      </div>
    </div>
  );
}
