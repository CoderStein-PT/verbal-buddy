export const findLastId = (array: any[]) => {
  if (array.length === 0) return 0
  return Math.max(...array.map((item) => item.id))
}

export const getAverageDelay = (delays: number[]) => {
  const convertedDelays: number[] = []

  if (!delays.length) return 0

  delays.reduce((a, b) => {
    convertedDelays.push(b - a)

    return b
  }, 0)

  console.log(delays, convertedDelays)

  return convertedDelays.reduce((a, b) => a + b, 0) / convertedDelays.length
}
