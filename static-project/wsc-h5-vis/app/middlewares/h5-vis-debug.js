/**
 * 前端 debug
 */

module.exports = (options = {}) => {
  return async function h5VisDebugdebug(ctx, next) {
    // 只对页面接口判断
    if (!ctx.acceptJSON) {
      const safeTime = typeof options.safeTime === 'number' ? options.safeTime : 10;
      const diffSeconds = safeTime * 60 * 1000;
      const { zanDebug = '' } = ctx.query || {};
      const currentTime = +new Date();
      const [tag, timestamp = 0] = zanDebug.split('_');
      const realDiffSeconds = currentTime - timestamp;

      if ((tag === 'debug' && realDiffSeconds < diffSeconds && realDiffSeconds > 0) || process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'pre') {
        ctx.setState('zanFeDebugMode', true);
      } else {
        ctx.setState('zanFeDebugMode', false);
      }
    }
    await next();
  };
};
