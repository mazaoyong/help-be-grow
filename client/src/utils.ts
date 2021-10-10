export const formatMsToStr = (ms: number) => {
  const sec = ms / 1000
  const minutes = Math.floor(sec / 60) % 60;
  const seconds = Math.floor(sec) % 60
  const minStr = minutes ? minutes + '分' : ''
  const secStr = seconds + '秒'
  return minStr + secStr
}