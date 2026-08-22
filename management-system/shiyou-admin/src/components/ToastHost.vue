<template>
  <div class="toast" :class="{ show: toastState.visible }">{{ toastState.message }}</div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toastState } = useToast()
</script>
