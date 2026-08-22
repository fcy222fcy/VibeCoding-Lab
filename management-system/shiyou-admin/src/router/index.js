import { createRouter, createWebHashHistory } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'

// 后台菜单与路由集中配置：菜单分组、页面标题、路由路径一一对应，
// 方便阅读者对照「导航结构」与「页面实现」。
// 便捷函数：路由对象统一挂载 meta.title，供顶栏面包屑使用
const r = (path, name, title, component) => ({ path, name, meta: { title }, component })

const adminRoutes = [
  r('dashboard', 'dashboard', '工作台', () => import('@/views/DashboardView.vue')),

  // 内容审核
  r('voucher-audit', 'voucherAudit', '待审核凭证', () => import('@/views/VoucherAuditView.vue')),
  r('report-audit', 'reportAudit', '举报处理', () => import('@/views/ReportAuditView.vue')),
  r('second-audit', 'secondAudit', '二次审核队列', () => import('@/views/SecondAuditView.vue')),
  r('removed-content', 'removedContent', '已下架内容', () => import('@/views/RemovedContentView.vue')),

  // 用户与基础数据
  r('users', 'users', '用户管理', () => import('@/views/UsersView.vue')),
  r('schools', 'schools', '学校管理', () => import('@/views/SchoolsView.vue')),
  r('tags', 'tags', '标签列表', () => import('@/views/TagsView.vue')),
  r('tag-groups', 'tagGroups', '标签分组列表', () => import('@/views/TagGroupsView.vue')),

  // 店铺管理
  r('shops', 'shops', '店铺列表', () => import('@/views/ShopsView.vue')),
  r('pending-shops', 'pendingShops', '待确认店铺', () => import('@/views/PendingShopsView.vue')),
  r('merge-records', 'mergeRecords', '合并记录', () => import('@/views/MergeRecordsView.vue')),

  // 榜单管理
  r('ranking-tasks', 'rankingTasks', '榜单任务', () => import('@/views/RankingTasksView.vue')),
  r('ranking-snapshot', 'rankingSnapshot', '榜单快照', () => import('@/views/RankingSnapshotView.vue')),

  // 系统管理
  r('settings', 'settings', '系统设置', () => import('@/views/SettingsView.vue')),
  r('logs', 'logs', '操作日志', () => import('@/views/LogsView.vue')),

  // 权限管理（RBAC）
  r('admins', 'admins', '管理员账号', () => import('@/views/AdminsView.vue')),
  r('roles', 'roles', '角色管理', () => import('@/views/RolesView.vue')),
  r('permissions', 'permissions', '权限管理', () => import('@/views/PermissionsView.vue')),
  r('menus', 'menus', '菜单管理', () => import('@/views/MenusView.vue'))
]

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: adminRoutes
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
