import { reactive } from 'vue'

// 通用确认弹窗状态管理，配合 AppModal 使用：
//   const { dlg, openDialog } = useDialog()
//   <AppModal v-model:open="dlg.open" :title="dlg.title" :confirm-text="dlg.confirmText" @confirm="dlg.onConfirm">
//     {{ dlg.body }}
//   </AppModal>
export function useDialog() {
  const dlg = reactive({
    open: false,
    title: '',
    body: '',
    confirmText: '确认',
    onConfirm: null
  })

  function openDialog({ title, body = '', confirmText = '确认', onConfirm = null }) {
    dlg.title = title
    dlg.body = body
    dlg.confirmText = confirmText
    dlg.onConfirm = onConfirm
    dlg.open = true
  }

  return { dlg, openDialog }
}
