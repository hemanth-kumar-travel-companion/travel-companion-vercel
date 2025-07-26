import { createClient } from "@supabase/supabase-js"

// Get environment variables with proper fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ktmtfqjbhcupnguzzrdq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bXRmcWpiaGN1cG5ndXp6cmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzUzMjMsImV4cCI6MjA2OTExMTMyM30.R08B1HNCyVXNBz1aOhy3PC2W2Mk3nK8VoQXKML8A1JQ"

// Create client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase.co"))
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          preferred_currency: string
          notification_preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          preferred_currency?: string
          notification_preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          preferred_currency?: string
          notification_preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          destination: string
          trip_name: string | null
          trip_status: string
          start_date: string | null
          end_date: string | null
          transport_cost: number
          accommodation_cost: number
          attractions_cost: number
          food_cost: number
          shopping_cost: number
          total_cost: number
          transport_details: any
          accommodation_details: any
          attractions_details: any
          food_details: any
          shopping_details: any
          notes: string | null
          is_favorite: boolean
          shared_with: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination: string
          trip_name?: string | null
          trip_status?: string
          start_date?: string | null
          end_date?: string | null
          transport_cost?: number
          accommodation_cost?: number
          attractions_cost?: number
          food_cost?: number
          shopping_cost?: number
          total_cost?: number
          transport_details?: any
          accommodation_details?: any
          attractions_details?: any
          food_details?: any
          shopping_details?: any
          notes?: string | null
          is_favorite?: boolean
          shared_with?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          destination?: string
          trip_name?: string | null
          trip_status?: string
          start_date?: string | null
          end_date?: string | null
          transport_cost?: number
          accommodation_cost?: number
          attractions_cost?: number
          food_cost?: number
          shopping_cost?: number
          total_cost?: number
          transport_details?: any
          accommodation_details?: any
          attractions_details?: any
          food_details?: any
          shopping_details?: any
          notes?: string | null
          is_favorite?: boolean
          shared_with?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_start: string
          session_end: string | null
          ip_address: string | null
          user_agent: string | null
          device_info: any
        }
        Insert: {
          id?: string
          user_id: string
          session_start?: string
          session_end?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_info?: any
        }
        Update: {
          id?: string
          user_id?: string
          session_start?: string
          session_end?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_info?: any
        }
      }
    }
  }
}
