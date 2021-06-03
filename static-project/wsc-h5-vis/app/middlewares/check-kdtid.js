/**
 * kdtid 存在性校验
 */
const ParamsError = require('../exceptions/ParamsError');

module.exports = (options = {}) => {
  return async function checkKdtId(ctx, next) {
    if (!ctx.kdtId || ctx.kdtId <= 0) {
      const code = 'KDTID_EXCEPTION';
      const message = 'kdtId 必须大于 0';
      const error = new ParamsError(code, message);
      throw error;
    }

    await next();
  };
};
