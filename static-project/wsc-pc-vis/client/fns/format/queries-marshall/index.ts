import { omitBy } from 'lodash';
export * from './predicator-collection';

type PredicatorType<R> = (value: any, key: string) => R;
function dataMatchOne(conditions: PredicatorType<boolean>[]) {
  return (value: any, key: string) => {
    if (conditions.length) {
      return conditions.some((step) => step(value, key));
    }
    return false;
  };
}

/**
 * 运行这个方法，指定predicator来消除query中不存在的值的项，返回值是一个浅拷贝的值
 *
 * @param query 参数对象，如果不是对象会直接返回
 * @param predicator 遍历过程中会调用这个断言函数，返回`boolean`，返回`false`则会将这个值从对象中删除
 */
function queriesDropper<OriginDataType = any>(query: any, predicator: PredicatorType<boolean>[]) {
  if (typeof query === 'object' && predicator.length) {
    return omitBy<OriginDataType>(query, dataMatchOne(predicator));
  }
  return query;
}

/**
 * 运行这个方法，来修改query的值，**在替换数据之前，会对对象进行一次浅拷贝**
 *
 * @param query 参数对象，如果不是对象会直接返回
 * @param modifiers 修改函数列表，注意顺序，第一个返回非`null`的值会覆盖原有的值
 */
function queriesAdaptor<OriginDataType = Record<string, any>>(
  query: any,
  modifiers: PredicatorType<unknown>[],
) {
  if (typeof query === 'object' && modifiers.length) {
    const shallowCloneQuery = {} as OriginDataType;
    Object.entries(query).forEach(([key, value]) => {
      let replacer: unknown = null;
      modifiers.some((modifier) => {
        replacer = modifier(value, key);
        return replacer !== null;
      });
      shallowCloneQuery[key] = replacer || value;
    });
    return shallowCloneQuery;
  }
  return query;
}

export const queriesMarshall = {
  queriesDropper,
  queriesAdaptor,
};
