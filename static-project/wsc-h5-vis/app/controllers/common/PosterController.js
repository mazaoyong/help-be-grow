const SnapshotService = require('../../services/snap-shot/SnapShotService');

class PosterController {
  async getVuePoster(ctx) {
    const { userId: operatorId } = ctx;
    const query = ctx.request.body;

    const {
      pathname,
      data = {},
      snapshotConfig = {},
    } = query;

    try {
      if (['qa', 'development'].indexOf(process.env.NODE_ENV) > -1) {
        const dataParams = Object.keys(data).map(key => {
          return `&data[${key}]=${data[key]}`;
        });
        const snapshotConfigParams = Object.keys(snapshotConfig).map(key => {
          return `&snapshotConfig[${key}]=${snapshotConfig[key]}`;
        });
        const testURL = `http://127.0.0.1:${process.env.NODE_PORT}/wscvis/common/poster/testVuePoster?kdt_id=${ctx.kdtId}&pathname=${pathname}${dataParams}${snapshotConfigParams}`;
        console.log('--------');
        console.log('测试地址：', testURL);
        console.log('--------');
      }
    } catch (err) {}

    let result;
    try {
      const html = await ctx.renderVuePoster(pathname, data);

      result = await new SnapshotService(ctx).postSnapshot(
        Object.assign({
          html,
          operatorId,
          height: 490,
          width: 325,
          alwaysCdn: 1,
          quality: 100,
          ratio: 2,
        }, snapshotConfig)
      );
    } catch (err) {
      return ctx.json('WSC-H5-VIS-POSTER-ERROR', 'error', '分享海报生成失败');
    }

    ctx.json(0, 'ok', result);
  }

  async testVuePoster(ctx) {
    const {
      pathname,
      data,
    } = ctx.getQueryParse();

    const html = await ctx.renderVuePoster(pathname, data);
    ctx.body = html;
  }
}

module.exports = PosterController;
