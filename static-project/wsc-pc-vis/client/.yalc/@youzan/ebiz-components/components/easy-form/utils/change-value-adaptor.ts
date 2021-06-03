import get from 'lodash/get';

const presetKey = 'value';
const supportPrimitiveType = ['number', 'string', 'boolean'];
export function changeValueAdaptor<T = any>(input: any, specificKey?: string): T {
  // 如果输入是基本类型，就直接返回
  if (supportPrimitiveType.some((type) => typeof input === type)) return input;
  if (Array.isArray(input)) return (input as unknown) as T;
  const changeValue = get(input, specificKey || presetKey);
  if (!changeValue) {
    if (input instanceof Event || Object.keys(input).includes('target')) {
      // 如果是合成事件或者是eventTarget
      const { target } = input;
      if (target) return get(target, specificKey || presetKey);
    }
  }
  return changeValue || input;
}
