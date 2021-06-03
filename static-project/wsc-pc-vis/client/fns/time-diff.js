// 计算两个时间的时间差

// 计算毫秒
export function timeDiff(start, end) {
  try {
    start = new Date(start);
    end = new Date(end);
  } catch (err) {
    throw new Error(`传入时间不正确: ${err}`);
  }

  return Math.abs(end - start);
}

// 秒差
export function secondsDiff(start, end) {
  const diffTime = timeDiff(start, end);
  return parseInt(diffTime / 1000);
}

// 分差
export function minutesDiff(start, end) {
  const diffTime = timeDiff(start, end);
  return parseInt(diffTime / 1000 / 60);
}

// 时差
export function hoursDiff(start, end) {
  const diffTime = timeDiff(start, end);
  return parseInt(diffTime / 1000 / 60 / 60);
}

// 天差
export function daysDiff(start, end) {
  const diffTime = timeDiff(start, end);
  return parseInt(diffTime / 1000 / 60 / 60 / 24);
}
