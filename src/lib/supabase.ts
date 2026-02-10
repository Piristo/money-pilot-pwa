import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client if env vars are not set (for build time)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Типы для базы данных
export type Transaction = {
  id: string
  user_id: string
  amount: number
  category: string
  description: string | null
  date: string
  type: 'income' | 'expense'
  created_at: string
  updated_at: string
}

export type Budget = {
  id: string
  user_id: string
  category: string
  limit_amount: number
  period: 'daily' | 'weekly' | 'monthly'
  created_at: string
  updated_at: string
}

export type CarProfile = {
  id: string
  user_id: string
  brand: string
  model: string
  year: number
  mileage: number
  fuel_type: string
  fuel_consumption: number
  tank_capacity: number
  fuel_price: number
  created_at: string
  updated_at: string
}

export type FuelLog = {
  id: string
  user_id: string
  date: string
  liters: number
  cost: number
  mileage: number
  created_at: string
}

export type MaintenanceLog = {
  id: string
  user_id: string
  date: string
  category: string
  description: string
  cost: number
  mileage: number
  created_at: string
}

export type Reminder = {
  id: string
  user_id: string
  title: string
  type: string
  due_date: string | null
  due_mileage: number | null
  completed: boolean
  created_at: string
  updated_at: string
}
