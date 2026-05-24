"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import {
  Course,
  calcSemesterGPA,
  makeCourse,
  uid,
} from "@/lib/utils";
import { ResultPanel } from "@/components/ResultPanel";
import { CourseRow } from "@/components/CourseRow";
import { CalculatorCard, TableHead } from "@/components/CalculatorCard";
import { SaveToDashboard } from "@/components/SaveToDashboard";

const INITIAL: Course[] = [
  { id: uid(), name: "", gradePoints: "", creditHours: 3 },
  { id: uid(), name: "", gradePoints: "", creditHours: 3 },
  { id: uid(), name: "", gradePoints: "", creditHours: 3 },
];

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>(INITIAL);
  const [semesterName, setSemesterName] = useState("Semester 1");

  const updateCourse = useCallback(
    (id: string, field: keyof Course, value: string | number) => {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    },
    []
  );

  const addCourse = () => setCourses((prev) => [...prev, makeCourse()]);

  const removeCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const reset = () => {
    setCourses(INITIAL.map(() => ({ id: uid(), name: "", gradePoints: "" as const, creditHours: 3 })));
    setSemesterName("Semester 1");
  };

  const gpa = calcSemesterGPA(courses);
  const totalCredits = courses.reduce(
    (s, c) => s + (typeof c.creditHours === "number" ? c.creditHours : 0),
    0
  );
  const validCourses = courses.filter(
    (c) => typeof c.creditHours === "number" && c.creditHours > 0
  ).length;

  return (
    <div className="space-y-5">
      <ResultPanel
        label="Semester GPA"
        value={gpa}
        credits={totalCredits}
        courses={validCourses}
      />

      {/* Semester name — used when saving to dashboard */}
      <div className="flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3 shadow-card">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Semester Label
        </label>
        <input
          type="text"
          value={semesterName}
          onChange={(e) => setSemesterName(e.target.value)}
          placeholder="e.g. Semester 1"
          className="flex-1 text-sm text-navy bg-transparent border-none outline-none placeholder:text-slate-300"
        />
      </div>

      <CalculatorCard>
        <TableHead cols={["Course Name", "Grade Points", "Credit Hours", ""]} />
        <AnimatePresence initial={false}>
          {courses.map((course, i) => (
            <CourseRow
              key={course.id}
              course={course}
              index={i}
              canDelete={courses.length > 1}
              onChange={(field, val) => updateCourse(course.id, field, val)}
              onDelete={() => removeCourse(course.id)}
            />
          ))}
        </AnimatePresence>
      </CalculatorCard>

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addCourse}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors shadow-teal"
        >
          <Plus size={16} /> Add Course
        </motion.button>

        <SaveToDashboard
          semesterName={semesterName}
          gpa={gpa}
          totalCredits={totalCredits}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} /> Reset
        </motion.button>
      </div>

      {/* Formula note */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-slate-600">
        <span className="font-semibold text-teal-700">Formula: </span>
        GPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours). Grade points
        typically follow a 4.0 scale: A=4.0, A−=3.7, B+=3.3, B=3.0, B−=2.7,
        C+=2.3, C=2.0, etc.
      </div>
    </div>
  );
}
