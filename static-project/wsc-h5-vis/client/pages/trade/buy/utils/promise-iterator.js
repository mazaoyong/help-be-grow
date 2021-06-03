/**
 * 顺序执行一个promise 函数数组
 *
 * @param {Array.<(param: any) => Promise<any>>} promises - promise 函数数组
 * @param {any} param -传递给promises里函数的参数
 * @return {Promise}
 */
export function promiseIterator(promises, param) {
  return func(promises, param);
}

function func(promises, param) {
  function dispatch(promise) {
    if (!promise) return Promise.resolve(true);

    return promise(param)
      .then((tem) => {
        const nextPromise = promises.shift();
        if (nextPromise) {
          return dispatch(nextPromise);
        }
        return tem;
      })
      .catch((error) => {
        throw error;
      });
  }

  return dispatch(promises.shift());
}
