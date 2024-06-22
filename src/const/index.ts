//性别 0女，1男，2未知
export const genderOptions = [
  { name: '女', code: 0 },
  { name: '男', code: 1 },
  { name: '未知', code: 2 }
]

//通过code获取性别名称
export function getGenderNameByCode(code: number): string {
  return genderOptions.find((item) => item.code === code)?.name || ''
}

//文章状态 draft草稿，pending审核中，published已发布，locked锁定
export const articleStatusOptions = [
  { name: '草稿', code: 'draft', severity: 'warn' },
  { name: '审核中', code: 'pending', severity: 'info' },
  { name: '已发布', code: 'published', severity: 'success' },
  { name: '锁定', code: 'locked', severity: 'secondary' }
]

//通过code获取文章状态名称
export function getArticleStatusNameByCode(code: string): string {
  return articleStatusOptions.find((item) => item.code === code)?.name || ''
}

//获取文章状态Tag的颜色
export function getArticleStatusSeverityByCode(code: string): string {
  return articleStatusOptions.find((item) => item.code === code)?.severity || 'secondary'
}
