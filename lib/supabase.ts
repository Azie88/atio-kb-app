import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export type Technology = {
    id: number;
    name: string;
    category: string;
    description: string;
    full_description: string;
    cost: string;
    cost_range: string;
    icon: string;
    maturity_level: string;
    adoption_rate: string;
    regions: string[];
    benefits: string[];
    challenges: string[];
    suitable_for: string[];
    evidence_links: string[];
    created_at: string;
    updated_at: string;
};