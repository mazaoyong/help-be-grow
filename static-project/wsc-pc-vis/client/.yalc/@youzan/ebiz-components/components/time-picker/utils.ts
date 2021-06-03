import { ITimePickerValue, IPickerType } from './types';

export function generateArray(n: number) {
  return Array.from(new Array(n), (_, i) => i);
}

export function formatOptions(n: number): string {
  let str = n.toString();
  if (str.length < 2) {
    str = '0' + str;
  }
  return str;
}

export function formatValueString(
  valueObj: ITimePickerValue,
  picker: IPickerType
) {
  let str = '';
  if (picker.hour) {
    str += formatOptions(valueObj.hour || 0);
  }

  if (picker.minute) {
    str !== '' && (str += ':');
    str += formatOptions(valueObj.minute || 0);
  }

  if (picker.second) {
    str !== '' && (str += ':');
    str += formatOptions(valueObj.second || 0);
  }
  return str;
}

// 判断是否为零值
export function isEmpty(val: ITimePickerValue): boolean {
  let n = 0;

  Object.keys(val).forEach(k => {
    n += (val as any)[k];
  });
  return n === 0;
}
