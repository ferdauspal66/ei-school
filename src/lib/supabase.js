import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://onnxmqphxrtitiqpbjte.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubnhtcXBoeHJ0aXRpcXBianRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MjUzMzcsImV4cCI6MjA3NDEwMTMzN30.jejvJ5XoMiH1tFjQBBGRHx9cXLAcTFLD46jDnk7MbDw'

export const supabase = createClient(supabaseUrl, supabaseKey)