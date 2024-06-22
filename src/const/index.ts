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
