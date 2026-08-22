<template>
  <button class="btn" :class="variant" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: '' }, // primary / danger / warning / success
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>
