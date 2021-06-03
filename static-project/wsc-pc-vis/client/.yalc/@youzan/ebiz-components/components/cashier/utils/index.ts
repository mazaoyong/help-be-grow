import accMul from '@youzan/utils/number/accMul';
import accDiv from '@youzan/utils/number/accDiv';

// from cent to yuan, number to string
export function cent2yuan(num = 0, format?: boolean): string {
  return accDiv(num, 100).toFixed(format ? 2 : undefined);
}

// from yuan to cent, string to number
export function yuan2cent(num: string): number {
  return accMul(Number(num) || 0, 100).valueOf();
}
