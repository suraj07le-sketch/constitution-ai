import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client configured with the service role key.
 * The service role key is used server-side to bypass Row Level Security.
 */
export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error(
                "Missing Supabase environment variables. " +
                "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
            );
        }

        _supabase = createClient(url, key, {
            auth: { persistSession: false },
        });
    }

    return _supabase;
}
