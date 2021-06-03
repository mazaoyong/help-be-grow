/**
 * 判断对象是不是 Promise-like
 * @param obj - 要判断的对象
 * @return 结果
 */

export default function isPromise(obj: any): boolean {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
