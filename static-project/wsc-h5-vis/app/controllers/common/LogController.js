const BaseController = require('../../controllers/base/BaseNewController');
const request = require('request');

class LogController extends BaseController {
  async logPerf(ctx) {
    const { mobileSystem, platform, platformVersion } = ctx;
    const ua = ctx.headers['user-agent'];
    const referer = ctx.headers['referer'];
    const fields = ctx.request.body && ctx.request.body.fields;
    if (fields) {
      const { log, extra = {} } = fields;

      ctx.visLogger.info(
        `[LOG:PERF]-${referer}`,
        '',
        Object.assign(
          {
            mobileSystem,
            platform,
            platformVersion,
            ua,
            log,
          },
          extra
        )
      );
    }
    ctx.json(0, 'ok', {});
  }

  async skynetJson() {
    const ctx = this.ctx;
    const fields = ctx.request.body && ctx.request.body.fields;
    if (fields) {
      const { name, message, level = 'info' } = fields;

      const logFn = ctx.visLogger[level] || ctx.visLogger.info;

      logFn(name, '', message);
    }
    ctx.json(0, 'ok', {});
  }

  async leavepageLog() {
    const ctx = this.ctx;
    const logParams = ctx.request.body;
    await request
      .post('https://tj1.youzanyun.com/v3/js/log', {
        rejectUnauthorized: false,
        body: logParams,
        headers: {
          'Content-type': 'text/plain; charset=utf-8',
          Origin: ctx.request.origin,
        },
      })
      .on('response', function(response) {
        const res = response.toJSON();
        ctx.localLog('info', '[离开页面埋点请求完成]');
        ctx.localLog('info', res);
      })
      .on('error', function(err) {
        ctx.localLog('info', '[离开页面埋点上报错误]');
        ctx.localLog('info', err);
      });
    ctx.json(0, 'ok', { success: 'success' });
  }
}

module.exports = LogController;
