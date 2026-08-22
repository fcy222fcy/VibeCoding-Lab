<template>
  <div class="modal-mask" :class="{ show: open }" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="close">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <button class="btn" @click="close">{{ cancelText }}</button>
          <button class="btn primary" @click="$emit('confirm')">{{ confirmText }}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  showFooter: { type: Boolean, default: true }
})

const emit = defineEmits(['update:open', 'confirm'])

function close() {
  emit('update:open', false)
}
</script>
