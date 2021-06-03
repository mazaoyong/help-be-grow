const BaseController = require('../base/BaseController');

class LogController extends BaseController {
  // 性能上报
  async logPerf(ctx) {
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
            ua,
            log,
          },
          extra
        )
      );
    }
    ctx.json(0, 'ok', {});
  }
}

module.exports = LogController;
