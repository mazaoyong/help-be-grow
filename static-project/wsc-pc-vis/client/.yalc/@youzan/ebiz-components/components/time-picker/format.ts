import {
  timePickerType,
  ITimePickerValue,
  valueType,
  IPickerType
} from './types';
import { formatValueString } from './utils';

export const formatType = (type: timePickerType): IPickerType => {
  return {
    hour: /HH/.test(type),
    minute: /mm/.test(type),
    second: /ss/.test(type)
  };
};

// 将不同类型的 value 值格式化对象类型
export function formatValue(
  value: valueType,
  picker: IPickerType
): ITimePickerValue {
  if (typeof value === 'number') {
    return formatNumberValue(value);
  }

  if (typeof value === 'string') {
    const valueArr = value.split(':').map(Number);
    return formatArrayValue(valueArr, picker);
  }

  if (Array.isArray(value)) {
    return formatArrayValue(value, picker);
  }

  return value;
}

export function formatResult<T extends valueType>(
  value: T,
  result: Required<ITimePickerValue>,
  picker: IPickerType
): T {
  if (typeof value === 'number') {
    return formatNumberResult(result) as any;
  }

  if (typeof value === 'string') {
    return formatValueString(result, picker) as any;
  }

  if (Array.isArray(value)) {
    return formatArrayResult(result, picker) as any;
  }

  return result as any;
}

// 将数组类型格式化
function formatArrayValue(
  value: number[],
  picker: IPickerType
): ITimePickerValue {
  let count = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;

  if (picker.hour) {
    hour = value[count];
    count++;
  }

  if (picker.minute) {
    minute = value[count];
    count++;
  }

  if (picker.second) {
    second = value[count];
  }

  return {
    hour,
    minute,
    second
  };
}

// 将数字类型格式化，单位为秒
function formatNumberValue(value: number): ITimePickerValue {
  const hour = Math.floor(value / (60 * 60));
  const minute = Math.floor((value - hour * 60 * 60) / 60);
  const second = value % 60;
  return {
    hour,
    minute,
    second
  };
}

// 返回值格式化数字类型，单位毫秒
function formatNumberResult(result: Required<ITimePickerValue>): number {
  return result.hour * 60 * 60 + result.minute * 60 + result.second;
}

function formatArrayResult(
  result: Required<ITimePickerValue>,
  picker: IPickerType
): number[] {
  let arr: number[] = [];

  ['hour', 'minute', 'second'].forEach(k => {
    if ((picker as any)[k]) {
      arr.push((result as any)[k]);
    }
  });

  return arr;
}
