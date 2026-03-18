import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ipohnmmfgqpaosomfscn.supabase.co'
const supabaseKey = 'sb_publishable_AMvm24uVkmYTZ8vEgG6cLQ_UGrqahjv'

export const supabase = createClient(supabaseUrl, supabaseKey)
