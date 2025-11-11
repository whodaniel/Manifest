import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dusrccpqwvdpzaohicap.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1c3JjY3Bxd3ZkcHphb2hpY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjY3MTUsImV4cCI6MjA3NzY0MjcxNX0.9E98CVy_0wzfdTJb7dRhfORr4jwGmRFEK7EomLjhPGg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  communication_preferences: Record<string, any>
  theme_preferences: Record<string, any>
  ai_persona_preference: string
  member_since: string
  last_active: string
}

export interface AISession {
  id: string
  user_id: string
  persona_type: string
  duration_seconds: number | null
  status: string
  mood_before: number | null
  mood_after: number | null
  topics: string[]
  key_insights: string[]
  session_notes: string | null
  started_at: string
  ended_at: string | null
}

export interface UserGoal {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string | null
  target_date: string | null
  progress_percentage: number
  status: string
  milestones: any[]
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface MoodTracking {
  id: string
  user_id: string
  mood_score: number
  energy_level: number | null
  stress_level: number | null
  notes: string | null
  tracked_at: string
}

export interface WheelOfLife {
  id: string
  user_id: string
  career_score: number
  health_score: number
  relationships_score: number
  personal_growth_score: number
  finances_score: number
  fun_score: number
  environment_score: number
  spirituality_score: number
  notes: string | null
  assessed_at: string
}

export interface PersonalityAssessment {
  id: string
  user_id: string
  assessment_type: string
  results: Record<string, any>
  scores: Record<string, any>
  interpretation: string | null
  completed_at: string
}
