// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qkzujlccsspoqgakphry.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrenVqbGNjc3Nwb3FnYWtwaHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDQwODksImV4cCI6MjA2MTMyMDA4OX0._Mrgt7hqKB1HdOiHxuGrSjQ7VOQP6uVUAjLAza9XltI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);