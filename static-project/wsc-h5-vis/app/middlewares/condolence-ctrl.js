
module.exports = (options, app) => {
  return async function ctrl(ctx, next) {
    // 页面启用疫情哀悼日标记
    if (!ctx.acceptJSON) {
      ctx.setState('condolenceScript', `https://h5.m.youzan.com/v3/gray/${ctx.kdtId || 0}/style.js`);
    }

    await next();
  };
};
