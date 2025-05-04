import { reactive, markRaw, shallowRef } from 'vue'

export const useJuruTaniModal = () => {
  const isVisible = ref(false)
  const component = shallowRef()
  const props = ref({})
  
  const open = (newComponent: any, newProps = {}) => {
    component.value = markRaw(newComponent)
    props.value = newProps
    isVisible.value = true
  }
  
  const close = () => {
    isVisible.value = false
  }
  
  return {
    isVisible,
    component,
    props,
    open,
    close
  }
}

// Buat modal store global
export const modalStore = reactive({
  isVisible: false,
  component: shallowRef(),
  props: {},

  open(newComponent: any, newProps = {}) {
    this.component = markRaw(newComponent)
    this.props = newProps
    this.isVisible = true
  },

  close() {
    this.isVisible = false
  }
})