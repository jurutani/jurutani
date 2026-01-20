import { ref } from 'vue'
import { useSupabase } from './useSupabase'
import { toastStore } from './useJuruTaniToast'
import type { Expert, Instructor, CategoryExpert, ExpertFormData, InstructorFormData } from '~/types'

/**
 * Composable untuk mengelola data profesional (Expert dan Instructor)
 * Digunakan untuk fetch dan update data expert/instructor
 */
export function useProfessionalData() {
  const { supabase } = useSupabase()

  const expertData = ref<Expert | null>(null)
  const instructorData = ref<Instructor | null>(null)
  const expertCategories = ref<CategoryExpert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch data expert berdasarkan user_id
   */
  const fetchExpertData = async (userId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('experts')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single()

      if (fetchError) {
        // Jika tidak ada data (404), bukan error
        if (fetchError.code === 'PGRST116') {
          expertData.value = null
          return { success: true, data: null }
        }
        console.error('Error fetching expert data:', fetchError)
        error.value = fetchError.message
        return { success: false, error: fetchError.message }
      }

      expertData.value = data
      return { success: true, data }
    } catch (err: any) {
      console.error('Error in fetchExpertData:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch data instructor berdasarkan user_id
   */
  const fetchInstructorData = async (userId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('instructors')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single()

      if (fetchError) {
        // Jika tidak ada data (404), bukan error
        if (fetchError.code === 'PGRST116') {
          instructorData.value = null
          return { success: true, data: null }
        }
        console.error('Error fetching instructor data:', fetchError)
        error.value = fetchError.message
        return { success: false, error: fetchError.message }
      }

      instructorData.value = data
      return { success: true, data }
    } catch (err: any) {
      console.error('Error in fetchInstructorData:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch categories expert dari database
   */
  const fetchExpertCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('category_expert')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true })

      if (fetchError) {
        console.error('Error fetching expert categories:', fetchError)
        return { success: false, error: fetchError.message }
      }

      expertCategories.value = data || []
      return { success: true, data }
    } catch (err: any) {
      console.error('Error in fetchExpertCategories:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update data expert
   */
  const updateExpertData = async (userId: string, formData: ExpertFormData) => {
    loading.value = true
    error.value = null

    try {
      // Cek apakah user sudah punya data expert
      const { data: existingData } = await supabase
        .from('experts')
        .select('id')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single()

      const updates = {
        user_id: userId,
        category: formData.category || null,
        note: formData.note || null,
        updated_at: new Date().toISOString()
      }

      let result

      if (existingData) {
        // Update existing data
        result = await supabase
          .from('experts')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single()
      } else {
        // Insert new data
        result = await supabase
          .from('experts')
          .insert({
            ...updates,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
      }

      if (result.error) {
        console.error('Error updating expert data:', result.error)
        error.value = result.error.message
        toastStore.error('Gagal menyimpan data expert')
        return { success: false, error: result.error.message }
      }

      expertData.value = result.data
      toastStore.success('Data expert berhasil disimpan')
      return { success: true, data: result.data }
    } catch (err: any) {
      console.error('Error in updateExpertData:', err)
      error.value = err.message
      toastStore.error('Terjadi kesalahan saat menyimpan data')
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update data instructor
   */
  const updateInstructorData = async (userId: string, formData: InstructorFormData) => {
    loading.value = true
    error.value = null

    try {
      // Cek apakah user sudah punya data instructor
      const { data: existingData } = await supabase
        .from('instructors')
        .select('id')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single()

      const updates = {
        user_id: userId,
        provinces: formData.provinces || null,
        district: formData.district || null,
        note: formData.note || null,
        updated_at: new Date().toISOString()
      }

      let result

      if (existingData) {
        // Update existing data
        result = await supabase
          .from('instructors')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single()
      } else {
        // Insert new data
        result = await supabase
          .from('instructors')
          .insert({
            ...updates,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
      }

      if (result.error) {
        console.error('Error updating instructor data:', result.error)
        error.value = result.error.message
        toastStore.error('Gagal menyimpan data penyuluh')
        return { success: false, error: result.error.message }
      }

      instructorData.value = result.data
      toastStore.success('Data penyuluh berhasil disimpan')
      return { success: true, data: result.data }
    } catch (err: any) {
      console.error('Error in updateInstructorData:', err)
      error.value = err.message
      toastStore.error('Terjadi kesalahan saat menyimpan data')
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    expertData,
    instructorData,
    expertCategories,
    loading,
    error,

    // Methods
    fetchExpertData,
    fetchInstructorData,
    fetchExpertCategories,
    updateExpertData,
    updateInstructorData
  }
}
