"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardStore, SavedSemester, uid } from "@/lib/utils";

// ── Storage key ───────────────────────────────────────────────────────────────
const KEY = "gradeiq_dashboard";

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT: DashboardStore = {
  userName: "",
  targetGPA: null,
  semesters: [],
};

// ── Raw read / write (safe for SSR) ──────────────────────────────────────────
export function readStore(): DashboardStore {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function writeStore(data: DashboardStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full or private browsing — fail silently
  }
}

// ── React hook ────────────────────────────────────────────────────────────────
export function useDashboard() {
  const [store, setStore] = useState<DashboardStore>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setStore(readStore());
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration)
  const update = useCallback((partial: Partial<DashboardStore>) => {
    setStore((prev) => {
      const next = { ...prev, ...partial };
      writeStore(next);
      return next;
    });
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const setUserName = (name: string) => update({ userName: name });

  const setTargetGPA = (gpa: number | null) => update({ targetGPA: gpa });

  const saveSemester = useCallback(
    (name: string, gpa: number, totalCredits: number) => {
      setStore((prev) => {
        // Upsert by name — replace if same name already saved
        const filtered = prev.semesters.filter((s) => s.name !== name);
        const next: DashboardStore = {
          ...prev,
          semesters: [
            ...filtered,
            { id: uid(), name, gpa, totalCredits, savedAt: Date.now() },
          ].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
        };
        writeStore(next);
        return next;
      });
    },
    []
  );

  const deleteSemester = useCallback((id: string) => {
    setStore((prev) => {
      const next: DashboardStore = {
        ...prev,
        semesters: prev.semesters.filter((s) => s.id !== id),
      };
      writeStore(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeStore(DEFAULT);
    setStore(DEFAULT);
  }, []);

  return {
    store,
    hydrated,
    setUserName,
    setTargetGPA,
    saveSemester,
    deleteSemester,
    clearAll,
  };
}
