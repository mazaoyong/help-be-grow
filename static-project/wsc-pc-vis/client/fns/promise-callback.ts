// 用于处理一整个重复使用的then...catch逻辑
import { Notify } from 'zent';
import { get } from 'lodash';

type FunctionLike = (params: any) => any;

// 就是不想写import { Notify } from 'zent'和Notify.error(err)语句
function promiseCallback(
  fetch: any,
  done?: FunctionLike | [string, string, FunctionLike],
  err?: FunctionLike
): Promise<any> {
  if (!(fetch instanceof Promise)) {
    throw new Error('请检查fetch方法是否是promise类型');
  }
  fetch.then((params: any) => {
    if (Array.isArray(done)) {
      const [key, msg, cb] = done;
      const isSuccess = !!get(params, key);
      if (isSuccess) {
        Notify.success(msg);
      }
      if (cb && typeof cb === 'function') {
        cb(params);
      }
    }
    if (typeof done === 'function') {
      done(params);
    }
  }).catch((errMsg: Error) => {
    Notify.error(errMsg);
    if (typeof err === 'function') {
      err(errMsg);
    }
  });

  return fetch;
}

export default promiseCallback;
