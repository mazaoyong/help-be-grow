const BaseController = require('../base/BaseNewController');
const PackageBuyCustomerFacade = require('../../services/owl/client/ump/packagebuy/PackageBuyCustomerFacade');
const ActivityService = require('../../services/owl/client/ump/activity/ActivityService');
const BuyGiveService = require('../../services/owl/client/ump/buygive/BuyGiveFacade');
const PresentService = require('../../services/ump/present/PresentService');

class ActivityController extends BaseController {
  // 根据商品alias查询参加的套餐
  async listActivityDetailJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const query = {
      productAlias: ctx.query.productAlias || null,
      activityAlias: ctx.query.activityAlias || null,
      userId,
    };
    const result = await new PackageBuyCustomerFacade(ctx).listActivityDetail(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  // 查询商品的所有sku信息
  async getGoodsAllSkuJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = {
      productAlias: ctx.query.productAlias || null,
      activityId: ctx.query.activityId || null,
    };
    const result = await new PackageBuyCustomerFacade(ctx).getGoodsAllSku(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async findActivityPosterByAlias(ctx) {
    const { kdtId } = ctx;
    const { alias: activityAlias, type } = ctx.query;

    const result = await new ActivityService(ctx).findActivityPosterByAlias(kdtId, {
      activityAlias,
      type,
    });
    ctx.json(0, 'ok', result);
  }

  // 获取赠品列表
  async findPresentByCondition(ctx) {
    const { kdtId } = ctx;
    // receiveStatus = 1; 已领取
    // receiveStatus = 0; 未领取
    const { orderNo, receiveStatus = null, alias } = ctx.query;
    const query = {
      userId: this.buyer.buyerId,
      orderNo,
      alias,
      receiveStatus,
    };
    const result = await new BuyGiveService(ctx).findPresentByCondition(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  // 领取赠品
  async receive(ctx) {
    const { kdtId, buyerId } = ctx;
    const { kdt_id: _, ...postData } = ctx.getPostData();
    postData.userId = buyerId;

    const result = await new BuyGiveService(ctx).receive(Number(kdtId), postData);
    ctx.json(0, 'ok', result);
  }

  // 获取赠品列表 - 通用化赠品接口
  async listPresentsByCondition(ctx) {
    const { kdtId, buyerId } = ctx;
    const {
      alias = '',
      orderNo = '',
      presentSource = '',
      presentQueryParams = '',
      receiveStatus = '',
    } = ctx.query;
    const dto = {
      userId: buyerId,
      receiveStatus: Number(receiveStatus) || 0,
      presentSource: Number(presentSource) || 16,
    };
    if (alias) {
      dto.alias = alias;
    }
    if (orderNo) {
      dto.orderNo = orderNo;
    }
    if (presentQueryParams) {
      try {
        dto.presentQueryParams = JSON.parse(presentQueryParams);
      } catch (error) {}
    }
    const result = await new PresentService(ctx).listPresentsByCondition(kdtId, dto);
    ctx.json(0, 'ok', result);
  }

  // 领取赠品 - 通用化赠品接口
  async receivePresent(ctx) {
    const { alias, orderNo, presentSource, presentRecords, studentId } = ctx.request.body;
    const { kdtId, buyerId } = ctx;
    const dto = {
      orderNo,
      presentSource,
      userId: buyerId,
    };
    if (alias) {
      dto.alias = alias;
    }
    if (studentId) {
      dto.studentId = studentId;
    }
    if (presentRecords && presentRecords.length > 0) {
      dto.presentRecords = presentRecords;
    }

    const result = await new PresentService(ctx).receivePresent(kdtId, dto);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ActivityController;
