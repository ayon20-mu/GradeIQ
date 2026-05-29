"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { readStore } from "@/lib/store";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gpa", label: "GPA" },
  { href: "/cgpa", label: "CGPA" },
  { href: "/needed", label: "Goal GPA" },
];

export function Navbar() {
  const path     = usePathname();
  const router   = useRouter();
  const [open, setOpen]         = useState(false);
  const [userName, setUserName] = useState("");         // from localStorage
  const [user, setUser]         = useState<User | null>(null);  // from Supabase
  const [authLoading, setAuthLoading] = useState(true); // hide auth UI until checked

  // ── 1. Read localStorage display name (unchanged behaviour) ───────────────
  useEffect(() => {
    setUserName(readStore().userName);
    const handler  = () => setUserName(readStore().userName);
    const interval = setInterval(() => setUserName(readStore().userName), 2000);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // ── 2. Sync Supabase auth state ────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });

    // Listen for login / logout events in real time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── 3. Logout handler ──────────────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // router.refresh() syncs the server-side session
    router.refresh();
    router.push("/");
  }

  // ── Display name: prefer localStorage name, fall back to email prefix ─────
  const displayName = userName || user?.email?.split("@")[0] || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-teal-100 shadow-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-teal group-hover:scale-105 transition-transform duration-200">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-serif text-xl text-navy">GradeIQ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  path === l.href
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-2">
            {!authLoading && (
              <>
                {user ? (
                  // ── LOGGED IN ──────────────────────────────────────────────
                  <>
                    {/* User pill — links to dashboard */}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {avatarLetter}
                      </span>
                      {displayName}
                    </Link>

                    {/* Dashboard CTA */}
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-all shadow-teal hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-1.5"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full text-sm font-medium transition-all"
                      aria-label="Sign out"
                    >
                      <LogOut size={15} />
                      <span className="hidden lg:inline">Sign out</span>
                    </button>
                  </>
                ) : (
                  // ── LOGGED OUT ─────────────────────────────────────────────
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-4 py-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-full text-sm font-medium transition-all"
                    >
                      <LogIn size={15} /> Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-all shadow-teal hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-teal-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-teal-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">

              {/* Auth state row */}
              {!authLoading && (
                <div className="mb-1">
                  {user ? (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-teal-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {avatarLetter}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-teal-700 leading-none">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-teal-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setOpen(false); handleLogout(); }}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 px-1">
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-teal-200 text-teal-600 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors"
                      >
                        <LogIn size={14} /> Sign in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors"
                      >
                        <UserCircle2 size={14} /> Sign up
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Nav links */}
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    path === l.href
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
