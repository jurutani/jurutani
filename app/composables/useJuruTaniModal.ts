/**
 * JuruTani Modal Composable using Nuxt UI 4 useOverlay
 * Provides a simple API to open modals programmatically
 * 
 * Note: useOverlay is auto-imported by Nuxt UI 4, no explicit import needed
 */
export const useJuruTaniModal = () => {

  const overlay = useOverlay()

  /**
   * Open a modal with a component
   * @param component - The component to render in the modal
   * @param props - Props to pass to the component
   * @returns Promise that resolves when modal is closed
   */
  const open = async <T = any>(component: any, props: Record<string, any> = {}): Promise<T> => {
    const modal = overlay.create(component)
    const instance = modal.open(props)
    return await instance.result
  }

  return {
    open,
    overlay
  }
}

/**
 * Global modal store for backward compatibility
 * Uses Nuxt UI 4's useOverlay under the hood
 */
export const modalStore = {
  /**
   * Open a modal programmatically
   * @param component - The component to render
   * @param props - Props to pass to the component
   */
  open(component: any, props: Record<string, any> = {}) {
    const overlay = useOverlay()
    const modal = overlay.create(component)
    modal.open(props)
  }
}