"use client";

// components/SignupForm.tsx
// Email + password signup form using Supabase browser client.
// Styled identically to LoginForm — same card, same inputs, same error handling.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);   // email-confirmation flow
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Supabase may auto-confirm (if email confirmation is OFF in project settings)
    // or require email verification first.
    if (data.session) {
      // Auto-confirmed — session is live, go straight to dashboard
      router.refresh();
      router.push("/dashboard");
    } else {
      // Email confirmation required — show success message
      setDone(true);
      setLoading(false);
    }
  }

  // ── Email confirmation pending ─────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-[calc(100vh-132px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-teal-100 shadow-card p-8 sm:p-10 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h1 className="font-serif text-2xl text-navy mb-2">Check your inbox</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-navy">{email}</span>.
              Click it to activate your account, then sign in.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-teal-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-600 transition-all shadow-teal hover:-translate-y-0.5"
            >
              Go to Sign In
            </Link>
          </div>
          <p className="text-center text-xs text-slate-400 mt-5">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              ← Back to GradeIQ
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-132px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-teal-100 shadow-card p-8 sm:p-10">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-teal">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="font-serif text-2xl text-navy">Create your account</h1>
              <p className="text-slate-500 text-sm mt-1">Free forever — no credit card needed</p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all bg-white placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all bg-white placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all bg-white placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-600 transition-all duration-200 shadow-teal hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <><UserPlus size={16} /> Create account</>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back home */}
        <p className="text-center text-xs text-slate-400 mt-5">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            ← Back to GradeIQ
          </Link>
        </p>
      </div>
    </div>
  );
}
