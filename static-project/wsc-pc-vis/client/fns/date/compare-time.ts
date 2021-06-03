/**
 * 判断 timeLeft 是否晚于 timeRight
 *
 * @param { string } timeLeft - 要判断的时间字符串, 为"HH:mm"类型
 * @param { string } timeRight - 要判断的时间字符串, 为"HH:mm"类型
 * @return {boolean}
 */
export default (timeLeft: string, timeRight: string) => {
  const hourLeft = parseInt(timeLeft.slice(0, 2));
  const hourRight = parseInt(timeRight.slice(0, 2));
  if (hourLeft === hourRight) {
    const minuteLeft = parseInt(timeLeft.slice(-2));
    const minuteRight = parseInt(timeRight.slice(-2));
    return minuteLeft > minuteRight;
  } else {
    return hourLeft > hourRight;
  }
};
