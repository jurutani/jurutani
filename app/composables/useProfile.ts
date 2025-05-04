import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useUserProfile = () => {
  const { supabase, user, loading: authLoading } = useSupabase()
  
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Ambil data profil user dari database
  const fetchProfile = async () => {
    if (!user.value) return null
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      if (fetchError) {
        error.value = fetchError.message
        return null
      }
      
      profile.value = data
      return data
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Update profil pengguna
  const updateProfile = async (updates) => {
    if (!user.value) return { success: false, error: 'User tidak ditemukan' }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()
      
      if (updateError) {
        error.value = updateError.message
        return { success: false, error: updateError.message }
      }
      
      profile.value = data
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Upload avatar
  const uploadAvatar = async (file) => {
    if (!user.value) return { success: false, error: 'User tidak ditemukan' }
    
    loading.value = true
    error.value = null
    
    try {
      // Buat nama file unik
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `avatars/${user.value.id}/${fileName}`
      
      // Upload file ke storage
      const { error: uploadError } = await supabase
        .storage
        .from('user-content')
        .upload(filePath, file)
      
      if (uploadError) {
        error.value = uploadError.message
        return { success: false, error: uploadError.message }
      }
      
      // Dapatkan public URL
      const { data: publicURL } = supabase
        .storage
        .from('user-content')
        .getPublicUrl(filePath)
      
      // Update profil dengan URL avatar baru
      const { success, error: updateError } = await updateProfile({
        avatar_url: publicURL.publicUrl
      })
      
      if (!success) {
        error.value = updateError
        return { success: false, error: updateError }
      }
      
      return { success: true, url: publicURL.publicUrl }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar
  }
}