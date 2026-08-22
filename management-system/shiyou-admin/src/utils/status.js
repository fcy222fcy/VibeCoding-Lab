// 状态/标签着色工具：根据文案推断标签颜色，也可由组件显式指定 tone
export function statusTone(text) {
  const t = String(text)
  if (['启用', '正常', '成功', '已审核', '已通过', '上线', '校内', '是'].includes(t)) return 'green'
  if (['禁用', '封禁', '失败', '已拒绝', '已下架', '已注销', '已驳回', '已超时', '已成立下架'].includes(t)) return 'red'
  if (['待审核', '待处理', '待确认', '待补充', '待执行', '已自动隐藏', '校外', '否', '停用'].includes(t)) return 'orange'
  return ''
}
