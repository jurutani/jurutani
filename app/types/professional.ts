/**
 * Professional data type definitions
 * Used for Expert and Instructor/Penyuluh data
 */

export interface Expert {
  id: number
  user_id: string
  category: string | null
  note: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface Instructor {
  id: number
  user_id: string
  provinces: string | null
  district: string | null
  note: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CategoryExpert {
  id: string
  name: string
  value: string
  created_at?: string
  updated_at?: string
}

export interface ExpertFormData {
  category: string
  note: string
}

export interface InstructorFormData {
  provinces: string
  district: string
  note: string
}
