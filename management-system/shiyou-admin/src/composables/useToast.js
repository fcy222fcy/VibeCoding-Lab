import { reactive } from 'vue'

// 全局 Toast 状态（模块级单例，任意组件可调用）
const state = reactive({ visible: false, message: '' })
let timer = null

export function useToast() {
  function showToast(message) {
    state.message = message
    state.visible = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      state.visible = false
    }, 2200)
  }

  return { toastState: state, showToast }
}
