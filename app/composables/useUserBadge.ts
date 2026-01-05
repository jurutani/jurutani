import type { RoleBadgeColor } from '~/types/chat'

/**
 * Composable untuk mengelola badge user berdasarkan role
 * Digunakan untuk menampilkan badge role dengan warna dan nama yang konsisten
 */
export const useUserBadge = () => {
    /**
     * Mendapatkan warna badge berdasarkan role user
     * @param role - Role user (pakar, penyuluh, admin, petani, dll)
     * @returns Warna badge untuk UBadge component
     */
    const getBadgeColor = (role: string | undefined | null): RoleBadgeColor => {
        if (!role) return 'neutral'

        const normalizedRole = role.toLowerCase().trim()

        switch (normalizedRole) {
            case 'pakar':
            case 'expert':
                return 'success'
            case 'penyuluh':
            case 'instructor':
                return 'info'
            case 'admin':
                return 'warning'
            case 'petani':
            case 'farmer':
                return 'primary'
            default:
                return 'neutral'
        }
    }

    /**
     * Mendapatkan display name untuk role user
     * @param role - Role user (pakar, penyuluh, admin, petani, dll)
     * @returns Display name yang user-friendly
     */
    const getBadgeName = (role: string | undefined | null): string => {
        if (!role) return 'User'

        const normalizedRole = role.toLowerCase().trim()

        switch (normalizedRole) {
            case 'pakar':
            case 'expert':
                return 'Pakar'
            case 'penyuluh':
            case 'instructor':
                return 'Penyuluh'
            case 'admin':
                return 'Admin'
            case 'petani':
            case 'farmer':
                return 'Petani'
            default:
                // Capitalize first letter of unknown role
                return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
        }
    }

    /**
     * Mendapatkan deskripsi lengkap untuk role (untuk tooltip atau detail)
     * @param role - Role user
     * @returns Deskripsi lengkap role
     */
    const getBadgeDescription = (role: string | undefined | null): string => {
        if (!role) return 'Pengguna'

        const normalizedRole = role.toLowerCase().trim()

        switch (normalizedRole) {
            case 'pakar':
            case 'expert':
                return 'Ahli Pertanian Bersertifikat'
            case 'penyuluh':
            case 'instructor':
                return 'Penyuluh Pertanian'
            case 'admin':
                return 'Administrator Sistem'
            case 'petani':
            case 'farmer':
                return 'Petani'
            default:
                return getBadgeName(role)
        }
    }

    /**
     * Cek apakah role adalah role expert/professional
     * @param role - Role user
     * @returns true jika pakar atau penyuluh
     */
    const isExpertRole = (role: string | undefined | null): boolean => {
        if (!role) return false
        const normalizedRole = role.toLowerCase().trim()
        return ['pakar', 'expert', 'penyuluh', 'instructor'].includes(normalizedRole)
    }

    /**
     * Cek apakah role adalah admin
     * @param role - Role user
     * @returns true jika admin
     */
    const isAdminRole = (role: string | undefined | null): boolean => {
        if (!role) return false
        const normalizedRole = role.toLowerCase().trim()
        return normalizedRole === 'admin'
    }

    return {
        getBadgeColor,
        getBadgeName,
        getBadgeDescription,
        isExpertRole,
        isAdminRole
    }
}
