import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Course = {
  id: string;
  name: string;
  gradePoints: number | "";
  creditHours: number | "";
};

export type Semester = {
  id: string;
  name: string;
  courses: Course[];
  isOpen: boolean;
};

export type NeededSemester = {
  id: string;
  name: string;
  expectedGPA: number | "";
  creditHours: number | "";
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function calcSemesterGPA(courses: Course[]): number | null {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const gp = typeof c.gradePoints === "number" ? c.gradePoints : 0;
    const cr = typeof c.creditHours === "number" ? c.creditHours : 0;
    if (cr > 0) {
      totalPoints += gp * cr;
      totalCredits += cr;
    }
  }
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}

export function calcCGPA(semesters: Semester[]): {
  cgpa: number | null;
  totalCredits: number;
} {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const sem of semesters) {
    for (const c of sem.courses) {
      const gp = typeof c.gradePoints === "number" ? c.gradePoints : 0;
      const cr = typeof c.creditHours === "number" ? c.creditHours : 0;
      if (cr > 0) {
        totalPoints += gp * cr;
        totalCredits += cr;
      }
    }
  }
  return {
    cgpa: totalCredits > 0 ? totalPoints / totalCredits : null,
    totalCredits,
  };
}

export function getLetterGrade(gpa: number): string {
  if (gpa >= 3.7) return "A / Excellent";
  if (gpa >= 3.3) return "A− / Great";
  if (gpa >= 3.0) return "B+ / Good";
  if (gpa >= 2.7) return "B / Above Average";
  if (gpa >= 2.3) return "B− / Average";
  if (gpa >= 2.0) return "C+ / Satisfactory";
  return "Below Average";
}

export function getGradeColor(gpa: number): string {
  if (gpa >= 3.5) return "text-emerald-600";
  if (gpa >= 3.0) return "text-teal-600";
  if (gpa >= 2.5) return "text-amber-600";
  return "text-red-500";
}

export function makeCourse(): Course {
  return { id: uid(), name: "", gradePoints: "", creditHours: 3 };
}

export function makeSemester(n: number): Semester {
  return {
    id: uid(),
    name: `Semester ${n}`,
    courses: [makeCourse()],
    isOpen: true,
  };
}

export function makeNeededSem(n: number): NeededSemester {
  return { id: uid(), name: `Semester ${n}`, expectedGPA: "", creditHours: 15 };
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Dashboard / persistence types ────────────────────────────────────────────

export type SavedSemester = {
  id: string;
  name: string;
  gpa: number;
  totalCredits: number;
  savedAt: number; // Date.now()
};

export type DashboardStore = {
  userName: string;
  targetGPA: number | null;
  semesters: SavedSemester[];
};
