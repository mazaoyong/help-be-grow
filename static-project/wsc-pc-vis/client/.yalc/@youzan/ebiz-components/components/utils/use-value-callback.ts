import { useMemo, useEffect, useState, useRef } from 'react';
import isEqual from 'lodash/isEqual';

interface IUseValueCBOptions<Value = any> {
  useOnce?: boolean;
  flattenParams?: boolean;
  predicate?(value: Value): boolean;
}

type OriginCallback<Value> = (value: Value) => any;
type FlattenCallback<Value> = (...args: Value[]) => any;

const INITIAL_OPTION: IUseValueCBOptions = {
  useOnce: true,
  flattenParams: true,
};

/**
 *
 * @param watchValue 需要监听的value
 * @param callback 回调函数
 * @param options 选项配置
 * @param options.useOnce 是否只执行一次会回调
 * @param options.flattenParams 是否平展参数
 * @param options.predicate 断言函数
 */
const useValueCallback = <Value = any>(
  watchValue: Value,
  callback: (...args: any[]) => any,
  options?: IUseValueCBOptions<Value>
) => {
  const response = useRef();
  const tempValues = useRef<Value>();
  const { useOnce, flattenParams, predicate } = Object.assign({}, INITIAL_OPTION, options);
  const [invoke, setInvokeState] = useState(false);
  const valueIsNotEmpty = useMemo(
    () => {
      if (isEqual(tempValues.current, watchValue)) return false;
      return predicate ? predicate(watchValue) : isNullable(watchValue);
    },
    [predicate, watchValue]
  );

  useEffect(() => {
    if (!invoke || !useOnce) {
      if (valueIsNotEmpty) {
        if (flattenParams) {
          // @ts-ignore
          const paramsList: Value[] = Array.isArray(watchValue) ? watchValue : [watchValue];
          response.current = (callback as FlattenCallback<Value>)(...paramsList);
        } else {
          response.current = (callback as OriginCallback<Value>)(watchValue);
        }
        setInvokeState(true);
      }
    }
    tempValues.current = watchValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueIsNotEmpty, watchValue]);

  return response.current;
};

function isNullable(value: any): boolean {
  if (Array.isArray(value)) {
    if (!value.length) return false;
    return value.every(isNullable);
  }
  return value !== undefined && value !== null;
}

export default useValueCallback;
