import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.warn("Peringatan: Kunci Supabase belum disetel di file .env!");
}
// Inisialisasi klien Supabase
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
//# sourceMappingURL=supabaseClient.js.map