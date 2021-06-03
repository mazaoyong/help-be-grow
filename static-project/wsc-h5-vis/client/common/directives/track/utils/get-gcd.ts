/**
 * @description 求一个数集中的最大公约数，用于求一个定时器的最大间隔
 * 比如在1200和1000毫秒的定时器中，要保证两个定时器的方法都能被运行，要用他们的最大公约数200ms作为定时器的间隔
 * @param {number[]} nums 待求的数集合
 * @return {number} 返回他们的公约数
 */
function getGCD(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const { newNums, scale } = quickScaleDown(nums);
  const minNum = Math.min(...newNums);
  let isGCD = false;
  let GCD = 0;
  for (let dividend = minNum; dividend >= 1; dividend--) {
    isGCD = newNums.every(num => num % dividend === 0);
    if (isGCD) {
      GCD = dividend;
      break;
    }
  }
  return GCD * scale;
}

export default getGCD;

// 将每个数都除以10，获取他们最小的数
function quickScaleDown(nums: number[]): {
  newNums: number[];
  scale: number;
} {
  let newNums = nums;
  let scale = 1;
  while (1) {
    const temp: number[] = [];
    const isAllInt = newNums.every(newNum => {
      const mod = newNum % 10;
      // 确保后续除法都能拿到整数
      temp.push(newNum - mod);

      return mod === 0;
    });
    if (!isAllInt) break;
    newNums = temp.map(num => num / 10);
    scale *= 10;
  }

  return {
    scale,
    newNums,
  };
}
