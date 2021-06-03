const BaseController = require('../base/BaseController');
const VisibilityConfigService = require('../../services/owl/VisibilityConfigService');
const map = require('lodash/map');

class HideInfoController extends BaseController {
  // 获取店铺指定开发可见性配置
  async getVisibilityJson(ctx) {
    const kdtId = ctx.kdtId;
    const { switchFun } = ctx.request.query || {};
    const res = await new VisibilityConfigService(ctx).getVisibility(kdtId, switchFun);
    ctx.json(0, 'ok', res);
  }

  async getBatchVisibilityJson(ctx) {
    const { kdtId } = ctx;
    let { switchFuns } = ctx.getQueryData();
    switchFuns = JSON.parse(switchFuns);
    const result = await Promise.all(map(switchFuns, (switchFun) => {
      return new VisibilityConfigService(ctx).getVisibility(kdtId, switchFun);
    }));
    ctx.json(0, 'ok', result);
  }

  // 全局店铺设置(首次)
  async postKdtVisibilityOneJson(ctx) {
    const kdtId = ctx.kdtId;
    const { operatorId } = this.operator;
    const { switchFun, showType, itemFields } = ctx.request.body || {};
    const res = await new VisibilityConfigService(ctx).createKdtVisibility(
      kdtId,
      switchFun,
      showType,
      itemFields,
      String(operatorId)
    );
    ctx.json(0, 'ok', res);
  }

  // 切换店铺可见性开关
  async putKdtVisibilityJson(ctx) {
    const kdtId = ctx.kdtId;
    const { operatorId } = this.operator;
    const { switchFun, showType } = ctx.request.body || {};
    const res = await new VisibilityConfigService(ctx).putKdtVisibility(
      kdtId,
      switchFun,
      showType,
      String(operatorId)
    );
    ctx.json(0, 'ok', res);
  }

  // 获取直播所有可见性配置
  async getVisibilityConfigForLiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { alias } = ctx.request.query || {};
    const res = await new VisibilityConfigService(ctx).getVisibilityConfigForLive(kdtId, alias);
    ctx.json(0, 'ok', res);
  }

  // 单商品可见性设置「首次」
  async postSingleVisibilityConfigJson(ctx) {
    const kdtId = ctx.kdtId;
    const { singleVisibilityCreateReqDTOList } = ctx.request.body || {};
    const res = await new VisibilityConfigService(ctx).createSingleVisibilityConfig(kdtId,
      singleVisibilityCreateReqDTOList
    );
    ctx.json(0, 'ok', res);
  }

  // 单商品可见性切换「单个商品」
  async putSingleVisibilityConfigJson(ctx) {
    const kdtId = ctx.kdtId;
    const { singleVisibilityPutReqDTOList } = ctx.request.body || {};
    const res = await new VisibilityConfigService(ctx).putSingleVisibilityConfig(kdtId,
      singleVisibilityPutReqDTOList
    );
    ctx.json(0, 'ok', res);
  }
}

module.exports = HideInfoController;
