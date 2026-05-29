// lib/supabase.ts
// Browser-side Supabase client — safe to import in "use client" components.
// Uses @supabase/ssr createBrowserClient so the session is stored in cookies
// (not localStorage) and is visible to both client and server.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
