export const getIntNumber = (n: number) => {
  const isInvalid = isNaN(n)
  if (isInvalid) console.error('Invalid number', n)
  return [isInvalid ? 0 : Math.trunc(n), isInvalid] as [number, boolean]
}
