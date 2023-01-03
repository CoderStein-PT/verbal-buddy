export const findLastId = (array: any[]) => {
  if (array.length === 0) return 0
  return Math.max(...array.map((item) => item.id))
}
