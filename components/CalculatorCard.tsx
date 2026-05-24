"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalculatorCardProps {
  children: React.ReactNode;
  className?: string;
}

export function CalculatorCard({ children, className }: CalculatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "bg-white rounded-2xl border border-teal-100 shadow-card overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function TableHead({ cols }: { cols: string[] }) {
  return (
    <div
      className="hidden md:grid px-4 py-3 bg-teal-50/60 border-b border-teal-100 text-xs font-semibold text-slate-400 uppercase tracking-wider"
      style={{ gridTemplateColumns: `1fr 120px 110px 44px` }}
    >
      {cols.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}
