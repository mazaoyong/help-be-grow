import filter from 'lodash/filter';
import reject from 'lodash/reject';

export default function useArrayEffect(effect, arr) {
  switch(effect.key) {
    case 'filter':
      return useFilterEffect(arr, effect.value);
    case 'reject':
      return useRejectEffect(arr, effect.value);
    default:
      return arr;
  }
}

// refer to: https://www.lodashjs.com/docs/lodash.filter
export function useFilterEffect(arr, _) {
  return filter(arr, _);
}

// https://www.lodashjs.com/docs/lodash.reject
export function useRejectEffect(arr, _) {
  return reject(arr, _);
}
