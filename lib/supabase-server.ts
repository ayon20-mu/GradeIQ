// lib/supabase-server.ts
// Server-side Supabase client — used in Server Components and Server Actions.
// Must NOT be imported in "use client" files.
// Reads/writes the session cookie so the server can verify auth state.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component — cookies are read-only there.
            // The middleware handles refreshing the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

// Convenience: get the current user on the server (returns null if not logged in)
export async function getServerUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
