const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Credenciais do Supabase não encontradas. Verifique seu arquivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;