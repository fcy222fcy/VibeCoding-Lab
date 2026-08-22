import { reactive } from 'vue'

// =========================================================================
// 操作日志中心（原型演示）
// 所有页面里的增删改查都会向这里写入一条日志，
// 「操作日志」页面直接读取该数组，用于演示后台审计设计。
// =========================================================================

const initialLogs = [
  { id: 1, adminId: 'A1001', name: '超级管理员', action: '删除菜单', method: 'DELETE', path: '/api/admin/menus/2005', params: '{"menuId":"2005"}', status: '成功', errorInfo: '-', time: '2026-05-03 14:26' },
  { id: 2, adminId: 'A1001', name: '超级管理员', action: '保存角色授权', method: 'PUT', path: '/api/admin/roles/R1002/permissions', params: '{"menus":["内容审核"],"permissions":["voucher:audit"]}', status: '成功', errorInfo: '-', time: '2026-05-03 14:18' },
  { id: 3, adminId: 'A1003', name: '系统管理员', action: '手动刷新榜单', method: 'POST', path: '/api/admin/rankings/refresh', params: '{"scope":"all"}', status: '成功', errorInfo: '-', time: '2026-05-03 13:42' },
  { id: 4, adminId: 'A1001', name: '超级管理员', action: '新增权限', method: 'POST', path: '/api/admin/permissions', params: '{"code":"ranking:refresh"}', status: '成功', errorInfo: '-', time: '2026-05-03 13:30' },
  { id: 5, adminId: 'A1002', name: '内容管理员', action: '审核拒绝凭证', method: 'PUT', path: '/api/admin/vouchers/RV10023/reject', params: '{"reason":"凭证模糊"}', status: '成功', errorInfo: '-', time: '2026-05-03 12:38' },
  { id: 6, adminId: 'A1003', name: '系统管理员', action: '修改系统设置', method: 'PUT', path: '/api/admin/settings/ranking', params: '{"refreshTime":"02:00"}', status: '失败', errorInfo: '参数 refreshTime 格式错误', time: '2026-05-03 11:57' },
  { id: 7, adminId: 'A1001', name: '超级管理员', action: '删除管理员账号', method: 'DELETE', path: '/api/admin/accounts/A1005', params: '{"account":"audit_wang"}', status: '成功', errorInfo: '-', time: '2026-05-02 18:22' },
  { id: 8, adminId: 'A1004', name: '店铺管理员', action: '确认待确认店铺', method: 'PUT', path: '/api/admin/shops/pending/S3002/confirm', params: '{"shopName":"二楼黄焖鸡"}', status: '成功', errorInfo: '-', time: '2026-05-02 16:20' },
  { id: 9, adminId: 'A1002', name: '内容管理员', action: '处理举报', method: 'PUT', path: '/api/admin/audits/reports/RP10012/handle', params: '{"result":"dismissed"}', status: '成功', errorInfo: '-', time: '2026-05-02 15:42' },
  { id: 10, adminId: 'A1001', name: '超级管理员', action: '新增权限', method: 'POST', path: '/api/admin/permissions', params: '{"code":"shop:confirm"}', status: '成功', errorInfo: '-', time: '2026-05-02 15:10' },
  { id: 11, adminId: 'A1002', name: '内容管理员', action: '二次审核通过', method: 'PUT', path: '/api/admin/audits/second/SA10008/approve', params: '{"reviewId":"RV20260502009"}', status: '成功', errorInfo: '-', time: '2026-05-02 14:38' },
  { id: 12, adminId: 'A1005', name: '用户和店铺信息管理员', action: '封禁用户', method: 'PUT', path: '/api/admin/users/10052/ban', params: '{"reason":"发布广告"}', status: '失败', errorInfo: '用户已处于封禁状态', time: '2026-05-02 13:55' }
]

export const logsStore = reactive({ items: [...initialLogs] })

let logId = initialLogs.length + 1

export function formatNow() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 根据操作文案推断 HTTP 方法（原型演示逻辑）
export function guessMethod(action) {
  if (/删除|下架|拒绝/.test(action)) return 'DELETE'
  if (/编辑|修改|保存|授权|更新|刷新|重试|确认/.test(action)) return 'PUT'
  if (/新增|创建|批量/.test(action)) return 'POST'
  return 'GET'
}

// 根据模块与操作推断接口路径（原型演示逻辑）
export function guessPath(moduleName, action) {
  if (moduleName.includes('权限')) {
    if (action.includes('角色')) return '/api/admin/roles'
    if (action.includes('权限')) return '/api/admin/permissions'
    if (action.includes('菜单')) return '/api/admin/menus'
    if (action.includes('管理员')) return '/api/admin/accounts'
    return '/api/admin/rbac'
  }
  if (moduleName.includes('系统')) return '/api/admin/settings'
  if (moduleName.includes('榜单')) return '/api/admin/rankings'
  if (moduleName.includes('内容')) return '/api/admin/audits'
  return '/api/admin/actions'
}

const adminIdMap = {
  超级管理员: 'A1001',
  内容管理员: 'A1002',
  系统管理员: 'A1003',
  店铺管理员: 'A1004',
  用户和店铺信息管理员: 'A1005',
  榜单运营: 'A1006'
}

// 写入一条操作日志（最新操作放在最前面）
export function appendLog(operator, moduleName, action, target, status = '成功', errorInfo = '') {
  logsStore.items.unshift({
    id: logId++,
    adminId: adminIdMap[operator] || 'A1001',
    name: operator,
    action,
    method: guessMethod(action),
    path: guessPath(moduleName, action),
    params: target ? JSON.stringify({ target }) : '{}',
    status,
    errorInfo: status === '成功' ? '-' : errorInfo || '未知错误',
    time: formatNow()
  })
}
