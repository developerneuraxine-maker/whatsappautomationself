/**
 * Server-only Supabase admin client.
 *
 * Uses the service_role key, which bypasses Row Level Security entirely — so
 * this must never be imported from a "use client" component or sent to the
 * browser. Only import this from Route Handlers, Server Components, or other
 * server-only modules (like `src/lib/store.ts`).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// No generated Database types (would require the Supabase CLI) — typed loosely
// as `any` so `.from(table)` accepts our own hand-written row shapes below.
const globalForSupabase = globalThis as unknown as { __waSupabase?: SupabaseClient<any, any, any> };

export function supabaseAdmin(): SupabaseClient<any, any, any> {
  if (!globalForSupabase.__waSupabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new Error(
        "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
      );
    }
    globalForSupabase.__waSupabase = createClient<any, any, any>(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return globalForSupabase.__waSupabase;
}
