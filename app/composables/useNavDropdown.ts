import { ref, type Ref } from 'vue'

/**
 * Composable untuk manage dropdown state
 */
export const useNavDropdown = () => {
    const openDropdown = ref<string | null>(null)

    const toggleDropdown = (id: string) => {
        openDropdown.value = openDropdown.value === id ? null : id
    }

    const closeDropdown = () => {
        openDropdown.value = null
    }

    const isDropdownOpen = (id: string) => {
        return openDropdown.value === id
    }

    return {
        openDropdown,
        toggleDropdown,
        closeDropdown,
        isDropdownOpen
    }
}
