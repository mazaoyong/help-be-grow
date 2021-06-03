const BaseController = require('../../base/BaseController');
const LiveVideoFacade = require('../../../services/api/owl/pc/LiveVideoFacade');

module.exports = class PolyvController extends BaseController {
  async getPolyvAuth(ctx) {
    const { kdtId } = ctx;
    const res = await new LiveVideoFacade(ctx).getPolyvAuth(kdtId);
    ctx.json(0, 'ok', res);
  }

  async savePolyvAuth(ctx) {
    const { kdtId } = ctx;
    const { userId, appId, appSecret } = ctx.request.body;
    const res = await new LiveVideoFacade(ctx).savePolyvAuth(kdtId, {
      userId,
      appId,
      appSecret,
    });
    ctx.json(0, 'ok', res);
  }

  async findPoliyvLives(ctx) {
    const { kdtId } = ctx;
    const { pageNumber, pageSize } = ctx.query;
    const res = await new LiveVideoFacade(ctx).findPoliyvLives(kdtId, {
      pageNumber,
      pageSize,
    });
    ctx.json(0, 'ok', res);
  }

  async asyncCreatePolyvLive(ctx) {
    const { kdtId } = ctx;
    const { name, scene } = ctx.request.body;
    const res = await new LiveVideoFacade(ctx).asyncCreatePolyvLive(kdtId, {
      name,
      scene,
    });
    ctx.json(0, 'ok', res);
  }

  async getAsyncCreateStatus(ctx) {
    const { kdtId } = ctx;
    const { createId } = ctx.query;
    const res = await new LiveVideoFacade(ctx).getAsyncCreateStatus(kdtId, createId);
    ctx.json(0, 'ok', res);
  }

  async polyvCheck(ctx) {
    const { kdtId } = ctx;
    const result = await new LiveVideoFacade(ctx).polyvCheck(kdtId);
    ctx.json(0, 'ok', result);
  }

  async getLiveEnterInfo(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new LiveVideoFacade(ctx).getLiveEnterInfo(kdtId, {
      alias,
    });
    ctx.json(0, 'ok', result);
  }

  async getPolyvBackLink(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new LiveVideoFacade(ctx).getPolyvBackLink(kdtId, alias);
    ctx.json(0, 'ok', result);
  }
};
