const lodash = require('lodash');
const _find = lodash.find;
const _get = lodash.get;
const _isNil = lodash.isNil;
const BaseController = require('../base/BaseController');
const GoodsSelectorGroupService = require('../../services/paidcontent/GoodsSelectorGroupService');
const GoodsSelectorItemService = require('../../services/paidcontent/GoodsSelectorItemService');

const GoodsSelectorEduItemService = require('../../services/owl/ic/aggregate/OwlProductAggregateFacade');
const ActivityPermissionFacadeService = require('../../services/owl/ump/core/ActivityPermissionFacade');
const ProductFacadeService = require('../../services/owl/ic/core/ProductFacade');

const { checkEduHqStore } = require('@youzan/utils-shop');

const {
  GOODS_TYPES,
  CHANNELS,
  PCT_NEW_GROUPS,
  PCT_NEW_MEDIA_GROUPS,
} = require('../../constants/goods-selector');
class GoodsSelectorController extends BaseController {
  async getGoodsListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const result = await new GoodsSelectorItemService(ctx).getGoodsList(req);

    ctx.json(0, 'ok', result);
  }

  // 获取分组信息
  async getGroupListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const result = await new GoodsSelectorGroupService(ctx).getGroupList(req);

    ctx.json(0, 'ok', result);
  }

  // 新版 获取分组信息
  async getNewGroupListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const eduDetailGroup = +req.eduDetailGroup;
    let result;

    if (req.channel !== CHANNELS.online && req.type === GOODS_TYPES.knowledge) {
      result = {
        items: [PCT_NEW_GROUPS.column],
        paginator: { page: 1, pageSize: 20, totalCount: 20 },
      };
    } else if (req.type === GOODS_TYPES.knowledge) {
      result = {
        items: Object.values(eduDetailGroup === 1 ? PCT_NEW_MEDIA_GROUPS : PCT_NEW_GROUPS),
        paginator: { page: 1, pageSize: 20, totalCount: 20 },
      };
    } else {
      req.kdtId = kdtId;
      result = await new GoodsSelectorGroupService(ctx).getGroupList(req);
    }

    ctx.json(0, 'ok', result);
  }

  // 新版 获取商品列表
  async getNewGoodsListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    let result;
    if (req.type === GOODS_TYPES.knowledge) {
      const reqForEdu = {
        channel: req.eduChannel,
        subType: req.subType,
        keyword: req.keyword,
      };

      // 连锁总部需要查询库存为 0 的虚拟商品
      if (checkEduHqStore(ctx.getState('shopInfo'))) {
        reqForEdu.showSoldOut = 2;
      }

      typeof req.mediaType !== 'undefined' && (reqForEdu.mediaType = req.mediaType);
      const pageRequest = {
        pageNumber: req.page,
        pageSize: req.pageSize,
      };
      result = await new GoodsSelectorEduItemService(ctx).findPageWithIc(
        kdtId,
        pageRequest,
        reqForEdu
      );

      // 兼容无效商品返回没有 id 字段
      _get(result, 'content', []).forEach(item => {
        if (item.invalid || typeof item.id === 'undefined') {
          item.isConflict = true;
          item.error = '商品已失效';
          item.id = null;
        }
      });

      // 添加活动信息
      if (result.content.length && typeof req.activityType !== 'undefined') {
        const ids = result.content.map(item => item.id).filter(item => !_isNil(item));
        const activityReq = {
          idList: ids,
          activityType: req.activityType,
          activityId: req.activityId,
        };
        // 附加字段
        if (req.ext) {
          activityReq.ext = req.ext;
        }
        const activityResult = await new ActivityPermissionFacadeService(ctx).filter(kdtId, activityReq);
        result.content.forEach(item => {
          const target = _find(activityResult, { id: item.id });
          if (target) {
            item.isConflict = target.isConflict;
            item.error = target.error;
            item.activityJoins = target.activityJoins;
          }
        });
      }
    } else {
      req.kdtId = kdtId;
      result = await new GoodsSelectorItemService(ctx).getGoodsList(req);
    }
    ctx.json(0, 'ok', result);
  }

  async getGoodInfoJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    const result = await new ProductFacadeService(ctx).getByAlias(kdtId, req.alias);
    ctx.json(0, 'ok', result);
  }

  async getGoodSkuJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    const result = await new ProductFacadeService(ctx).getSkuByAlias(kdtId, req.alias);
    ctx.json(0, 'ok', result);
  }
}

module.exports = GoodsSelectorController;
