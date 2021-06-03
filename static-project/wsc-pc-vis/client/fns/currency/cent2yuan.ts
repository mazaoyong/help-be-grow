// 分转换成元
import accDiv from 'zan-utils/number/accDiv';

export default function cent2yuan(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    num = 0;
  }

  return accDiv(num, 100).toFixed(2);
}
