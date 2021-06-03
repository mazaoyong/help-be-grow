/**
 * @description session 过期校验
 * 配置 middleware.default.js，该中间件权重必须比session中间件靠后, 比login中间件靠前
 * @author: <yanghaibo@youzan.com>
 */

module.exports = () => async (ctx, next) => {
  const sessionData = ctx.getLocalSession();
  const isPageReqest = !ctx.acceptJSON;
  if (sessionData['userInfo'] === undefined) {
    if (isPageReqest) {
      ctx.redirect(`/v4/vis/h5/error/session?redirect_url=${encodeURIComponent(ctx.url)}`);
    } else {
      ctx.json(0, 'ok', {
        code: 'VIS_SESSION_EXPIRED',
        message: '登录信息已过期'
      });
    }

    return;
  }

  return next();
};
