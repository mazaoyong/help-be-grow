const BaseController = require('../base/BaseNewController');
const ActivityService = require('../../services/owl/ump/core/ActivityService');
const SalesmanService = require('../../services/owl/ump/salesman/SalesmanService.js');
const ClientEduProductFacade = require('../../services/owl/client/product/ClientEduProductFacade');

// 邀请开页面
class InviteController extends BaseController {
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;
    const query = {
      userId: ctx.buyerId,
      // productType: ctx.query.productType,
      productAlias: ctx.query.alias,
    };
    const owlType = ctx.query.owlType;
    let shareUrl = '';
    switch (+owlType) {
      case 1:
        shareUrl = `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${kdtId}&page=columnshow&alias=${query.productAlias || ''}`;
        break;
      case 2:
        shareUrl = `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${kdtId}&page=contentshow&alias=${query.productAlias || ''}`;
        break;
      case 4:
        shareUrl = `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${kdtId}&page=livedetail&alias=${query.productAlias || ''}`;
        break;
      case 10:
        shareUrl = `https://h5.youzan.com/wscvis/edu/prod-detail?kdt_id=${kdtId}&alias=${query.productAlias || ''}`;
        break;
      default:
        break;
    }
    ctx.setGlobal('shareUrl', shareUrl);
    let activityData = [];
    try {
      activityData = await new ActivityService(ctx).findByProduct({
        kdtId, query,
      });
    } catch (error) {
      ctx.visLogger.warn('[邀请卡获取活动]', error);
    }
    let inviteData = {};
    (activityData || []).forEach(item => {
      if (item.type === 'invite') {
        inviteData = item.data;
        ctx.setGlobal('inviteData', inviteData);
      }
    });

    // 如果商品参加了分销员活动
    if (inviteData.isDistribution) {
      await this.baseAcl({
        allowNotLogin: false,
        checkFansLogin: false,
        loginAjaxWithCode: true,
      });
      const distributorStatus = await new SalesmanService(ctx).register(
        [kdtId, ctx.buyerId],
      );
      ctx.setGlobal('distributorStatus', distributorStatus.status);
      if (distributorStatus.status === 1) {
        const salesmanInfo = await new SalesmanService(ctx).getShareIcon({
          redirectUrl: shareUrl,
          kdtId,
          buyerId: ctx.buyerId,
          type: 'paidcontent',
          alias: query.productAlias,
        });
        shareUrl = `${shareUrl}&sls=${salesmanInfo.seller}&from_params=sl~${salesmanInfo.seller}!online_kdt_id~${kdtId}`;
        ctx.setGlobal('salesmanInfo', salesmanInfo);
      }
      ctx.setGlobal('shareUrl', shareUrl);
    }
    await ctx.render('ump/invite-card.html');
  }

  // 针对邀请卡页面的商品信息接口
  async getDistributorDetail(ctx) {
    const { kdtId, query } = ctx;
    const { alias } = query;
    const result = await new ClientEduProductFacade(ctx).getDistributorDetail(kdtId, alias);
    return ctx.json(0, 'ok', result);
  }
};

module.exports = InviteController;
