const BaseController = require('../base/BaseController');
const TuitionOffsetFacade = require('../../services/api/owl/pc/TuitionPCFacade');
const CommonActivityPCFacade = require('../../services/api/owl/pc/CommonActivityPCFacade');
const OwlCommonService = require('../../services/owl/biz/OwlCommonService');
const ProductPCFacade = require('../../services/api/owl/pc/ProductPCFacade');
const GoodsSelectorConfigService = require('../../services/ump/manage/GoodsSelectorConfigService');
const { checkEduChainStore } = require('@youzan/utils-shop');
const { umpActivityType } = require('../../constants/ump-activity-type');

class TuitionOffsetController extends BaseController {
  // render page
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));
    try {
      const gsConfig = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
        shopId: ctx.kdtId,
        domain: 'UMP',
        umpType: umpActivityType.tuition_offset, // 攒学费
      });
      ctx.setGlobal('gsConfig', gsConfig);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取商品选择器配置出错', error);
    }

    await ctx.render('ump/tuition-offset/index.html');
  }

  // 查询时间段内是否有同类型活动
  async checkExistActivity(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.getQueryParse() || {};
    const res = await new CommonActivityPCFacade(ctx).checkExistActivity(kdtId, command);
    ctx.json(0, 'success', res);
  }
  // 攒学费活动创建
  async create(ctx) {
    const { kdtId } = ctx;
    const { params = {} } = ctx.request.body || {};
    const command = { ...params, operator: this.formatOperator };
    const res = await new TuitionOffsetFacade(ctx).create(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 攒学费活动编辑
  async edit(ctx) {
    const { kdtId } = ctx;
    const { params = {} } = ctx.request.body || {};
    const command = { ...params, operator: this.formatOperator };
    const res = await new TuitionOffsetFacade(ctx).edit(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 攒学费活动详情查询
  async getTuitionOffsetDetailById(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getQueryParse() || {};
    const res = await new TuitionOffsetFacade(ctx).getDetailById(kdtId, id);
    ctx.json(0, 'success', res);
  }

  // 使活动失效
  async expireTuitionOffsetEventById(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.request.body || {};
    const res = await new TuitionOffsetFacade(ctx).invalid(kdtId, id);
    ctx.json(0, 'success', res);
  }

  // 删除活动
  async deleteTuitionOffsetEventById(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.request.body || {};
    const res = await new TuitionOffsetFacade(ctx).delete(kdtId, id);
    ctx.json(0, 'success', res);
  }

  // 活动列表查询
  async findTuitionOffsetEventByPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const res = await new TuitionOffsetFacade(ctx).findByPage(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 活动数据 - 查询活动概况
  async getTuitionOffsetStatsById(ctx) {
    const { kdtId } = ctx;
    const { activityId } = ctx.getQueryParse() || {};
    const res = await new TuitionOffsetFacade(ctx).getBrief(kdtId, activityId);
    ctx.json(0, 'success', res);
  }

  // 活动数据 - 查看裂变效果排行
  async getTuitionOffsetEffectRankListByPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const res = await new TuitionOffsetFacade(ctx).getRankList(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 活动数据 - 参与人明细查看
  async getTuitionOffsetParticipantByPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const res = await new TuitionOffsetFacade(ctx).getRewardList(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 获取店铺H5二维码
  async getWapQrCode(ctx) {
    const params = ctx.query;
    const queryData = {
      width: 540,
      height: 540,
      isShortenUrl: true,
      errorCorrectionLevel: 1,
      ...params,
    };

    const res = await new OwlCommonService(ctx).createQrCode(queryData);
    ctx.json(0, 'ok', res);
  }

  // 获取数据模块基本信息
  async getTuitionOffsetBaseStats(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.getQueryParse() || {};
    const res = await new CommonActivityPCFacade(ctx).getSimpleActivity(kdtId, query);
    ctx.json(0, 'success', res);
  }

  // 数据页 - 裂变效果数据导出
  async exportRewardList(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.request.body || {};
    const { nickName: operatorName, mobile: operatorMobile } = this.formatOperator;
    const data = {
      ...query,
      operatorName,
      operatorMobile,
    };
    const res = await new TuitionOffsetFacade(ctx).exportRewardList(kdtId, data);
    ctx.json(0, 'success', res);
  }

  // 查询商品列表信息,包含sku信息(默认按照传入的商品id顺序)
  async findProductsWithSku(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.request.body || {};
    const res = await new ProductPCFacade(ctx).findProductsWithSku(kdtId, query);
    ctx.json(0, 'success', res);
  }
}

module.exports = TuitionOffsetController;
