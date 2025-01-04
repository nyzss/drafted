import { createClient } from "@supabase/supabase-js";

export const sb = createClient(
    import.meta.env.VITE_SB_URL,
    import.meta.env.VITE_ANON_KEY
);
