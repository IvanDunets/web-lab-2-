import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmxncmpwumbxuqtnuaok.supabase.co';
const supabaseKey = 'sb_publishable_LmZXOA3cx7SNPeVyha1frw_RB5Ko9-3';

export const supabase = createClient(supabaseUrl, supabaseKey);