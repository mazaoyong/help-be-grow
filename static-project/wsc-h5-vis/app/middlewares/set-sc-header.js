/**
 * 获取请求header中携带的sc标签, 保存在global中
 */
module.exports = (options, app) => {
  return async function setScHeader(ctx, next) {
    // 只获取并赋值一次
    if (!global.__sc__) {
      let chain = ctx.request.header['x-service-chain'] || ctx.request.header['X-Service-Chain'];
      if (chain) {
        try {
          let name = JSON.parse(chain)['name'];
          if (name.indexOf('prj') >= 0) {
            let without = name.replace('prj', '');
            global.__sc__ = parseInt(without, 10); // 10进制转换
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    await next();
  };
};
