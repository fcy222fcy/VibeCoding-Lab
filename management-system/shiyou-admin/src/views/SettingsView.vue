<template>
  <div>
    <PageHeader title="系统设置" description="仅保留评价规则、热度权重、榜单刷新与保留策略、凭证原图清理相关配置。">
      <template #actions>
        <BaseButton variant="primary" @click="save">保存设置</BaseButton>
      </template>
    </PageHeader>

    <!-- 配置页签 -->
    <div class="tabs">
      <button
        v-for="tab in tabNames"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="card">
      <div class="form-grid">
        <div v-for="item in currentPanel" :key="item.label" class="form-item">
          <label>{{ item.label }}</label>
          <input v-model="item.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useToast } from '@/composables/useToast'
import { appendLog } from '@/store/logs'
import { settingsPanels } from '@/data/mock'

const { showToast } = useToast()

const activeTab = ref('评价设置')
const tabNames = Object.keys(settingsPanels)

// 将静态配置深拷贝为响应式，便于表单修改
const panels = reactive(
  Object.fromEntries(
    Object.entries(settingsPanels).map(([name, items]) => [
      name,
      items.map((item) => ({ ...item }))
    ])
  )
)

const currentPanel = computed(() => panels[activeTab.value])

function save() {
  appendLog('系统管理员', '系统设置', '修改系统设置', activeTab.value)
  showToast(`「${activeTab.value}」已保存，操作已写入日志示例。`)
}
</script>
