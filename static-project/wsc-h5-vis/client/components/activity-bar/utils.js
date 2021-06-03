import format from '@youzan/utils/money/format';

export function splitPrice(price = 0) {
  const priceStr = format(price, true, false);
  const hasDot = priceStr.indexOf('.') > -1;
  const priceArr = priceStr.split('.');
  if (hasDot) {
    priceArr[1] = `.${priceArr[1]}`;
  } else {
    priceArr.push('');
  }
  return priceArr;
}

export function prependZero(num) {
  if (num < 10) {
    return `0${num}`;
  }
  if (num === 0) {
    return '00';
  }
  return num;
}

const secondNum = 1000;
const minuteNum = 60 * secondNum;
const hourNum = 60 * minuteNum;
const dayNum = 24 * hourNum;
export function parseTime(time) {
  const day = Math.floor(time / dayNum);
  const dayLeft = time - day * dayNum;
  const hour = Math.floor(dayLeft / hourNum);
  const hourLeft = dayLeft - hour * hourNum;
  const minute = Math.floor(hourLeft / minuteNum);
  const minuteLeft = hourLeft - minute * minuteNum;
  const second = Math.floor(minuteLeft / secondNum);
  const millisecond = minuteLeft - second * secondNum;
  return {
    day,
    hour,
    minute,
    second,
    millisecond: Math.floor(millisecond / 10),
  };
}
