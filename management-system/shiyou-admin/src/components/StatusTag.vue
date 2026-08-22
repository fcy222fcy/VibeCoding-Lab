<template>
  <span class="tag" :class="toneClass">{{ text }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { statusTone } from '@/utils/status'

const props = defineProps({
  text: { type: [String, Number], required: true },
  // 可选显式颜色：green / red / orange / gray / blue / indigo
  tone: { type: String, default: '' }
})

const toneClass = computed(() => props.tone || statusTone(props.text))
</script>
