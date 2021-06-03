import { get } from 'lodash';
import { Context } from 'astroboy';
import { keyMap, spmMap, goodsIdKeyMap, isLockKeyMap, designMap } from './page-config';
import { designMap as pcDesignMap } from './pc-page-config';
import BaseController from '../../base/BaseNewController';
import ClientEduProductFacade from '../../../services/api/owl/api/ClientEduProductFacade';
import ActivityService from '../../../services/owl/ump/core/ActivityService';
import SeckillCustomerFacade from '../../../services/owl/ump/seckill/SeckillCustomerFacade';
import ClientEduProduct from '../../../services/owl/client/product/ClientEduProductFacade.js';
import EduBaseService from '../../../services/edu/EduBaseService';
import MpService from '../../../services/owl/api/MpService';
import ConsumerRewardFacade from '../../../services/owl/edu/reward/ConsumerRewardFacade';
import ClientCourseFacade from '../../../services/owl/api/courseitem/offlinecourse/ClientCourseFacade';
const BehaviorQueryService = require('../../../services/scrm/behavior/BehaviorQueryService');

const detailInvokeErrorMap = {
  LOSTED: 320100017,
};
class DetailLostException extends Error {}
class DetailLockException extends Error {}

export = class DetailController extends BaseController {
  async detailAcl() {
    if (this.ctx.isGuang || this.ctx.isWeapp) {
      await this.needPlatformAcl();
    } else {
      await this.baseAcl({
        useAjaxLogin: true,
      });
    }
  }

  // 进店逻辑
  async enterCampus() {
    const subKdtId = await this.getAutoEnterCampusInfo();

    if (subKdtId) {
      // 默认使用传入的课程alias
      let targetAlias = this.ctx.params.alias;

      // 在子校区中查找对应课程alias
      targetAlias =
        (await this.getChainCampusTargetAlias({
          sourceKdtId: this.ctx.kdtId,
          targetKdtId: subKdtId,
          sourceProductAlias: targetAlias,
        })) || targetAlias;

      // 无论子校区是否包含该课程，都进入子校区对应课程，后续流程要考虑异常处理
      this.ctx.redirect(`/wscvis/course/detail/${targetAlias}?kdt_id=${subKdtId}`);
      return true;
    } else {
      // 如果自动进店失败，并且 kdtId 是总部的 kdtId
      // 这说明会进入总部的商详页
      // 这时候需要重定向至进店页面
      const { ctx } = this;
      const { kdtId } = ctx;
      const shopMetaInfo = ctx.getGlobal('shopMetaInfo' as never) as any;

      if (shopMetaInfo && Number(kdtId) === Number(shopMetaInfo.rootKdtId)) {
        const offlineData = ctx.getGlobal('offlineData' as never) as any;
        if (offlineData && offlineData.url) {
          ctx.redirect(offlineData.url);
          return true;
        }
      }
    }
    return false;
  }

  async getShopConfig() {
    const { ctx } = this;
    let shopConfig = {};
    try {
      const res = await new EduBaseService(ctx).getShopConfigAndTeamStatus(ctx.kdtId);
      shopConfig = res[0];
    } catch (error) {
      // 店铺配置查询失败不影响页面展示
    }
    ctx.setGlobal('shopConfig', shopConfig);
  }

  async getMpFollowed() {
    const { ctx } = this;
    let mpFollowed = false;
    try {
      const { kdtId = 0, buyerId = 0 } = ctx;
      if (kdtId && buyerId) {
        const res = await new MpService(ctx).checkMpFollow(kdtId, buyerId);
        mpFollowed = res.isFollow;
      }
    } catch (error) {
      // 公众号关注状态查询失败不影响页面展示
    }
    ctx.setGlobal('mpFollowed', mpFollowed);
  }

  async bindSalesman() {
    /**
     * 2020-11-25 优先取 sl 分销员参数
     * @see https://jira.qima-inc.com/browse/ONLINE-222711
     * */
    const { sls, sl = sls } = this.ctx.query;
    if (sl) {
      // TODO 未登录态无法绑定关系
      try {
        await this.bindCustomerRelationJson(sl, this.ctx.kdtId);
      } catch (error) {
        try {
          await this.bindCustomerRelationJson(sl, this.ctx.kdtId);
        } catch (error) {
          this.ctx.visLogger.error('[bindSalesman] error', error, {});
        }
      }
    }
  }

  async fetchGoods(alias: string, sortType: string) {
    const { ctx } = this;
    const { kdtId, visBuyer, isWeixin } = ctx;
    const query = {
      alias,
      fansId: visBuyer.fansId,
      fansType: visBuyer.fansType,
      userId: visBuyer.buyerId,
      isWechatEnvironment: isWeixin,
    };

    const result = await new ClientEduProductFacade(ctx).getDetail(kdtId, query);
    const goodsData = {
      ...result[keyMap[result.type]],
      isOwnAsset: result.isOwnAsset,
      showCollectInfo: result.showCollectInfo,
      needOrder: result.needOrder,
    };

    // 风控锁
    if (get(goodsData, isLockKeyMap[result.type], false)) {
      throw new DetailLockException();
    }

    // 课程商品额外查询下奖励信息
    // reason: 证书、奖励不属于营销，属于教务，目前证书信息已经在商详中返回，所以这里把奖励信息也放在商详数据中
    // ps: 蛇皮
    if (result.type === 6) {
      try {
        const rewards = await new ConsumerRewardFacade(ctx).findCourseProductRewardActivity(kdtId, {
          courseProductAlias: alias,
        });
        goodsData.course.rewards = rewards;
      } catch (e) {
        // 奖励查询失败不影响页面正常展示
      }
    }

    return {
      goodsType: result.type,
      goodsData,
    };
  }

  async getDetail() {
    const { ctx } = this;
    const { params } = ctx;
    try {
      const { goodsType, goodsData } = await this.fetchGoods(params.alias, params.sortType);

      /** 店铺休息 **/
      if (!goodsData.isOwnAsset) {
        await this.injectShopRest();
      }

      /** 埋点相关数据 start */
      ctx.setGlobal('spm', {
        logType: spmMap[goodsType],
        logId: get(goodsData, goodsIdKeyMap[goodsType], 0),
      });
      if (ctx.query.resourceAlias) {
        ctx.setGlobal('source', 'enrollment_poster');
        ctx.setGlobal('sourceID', ctx.query.resourceAlias);
      }
      /** 埋点相关数据 end */

      ctx.setGlobal('goodsType', goodsType);
      ctx.setGlobal('goodsData', escape(JSON.stringify(goodsData)));
      let design = designMap[goodsType] as any;
      // 如果是PC端访问视频直播商详页，返回PC版design
      const { is_mobile: isMobile = true } = ctx.getState('platformInfo' as never);
      if (!isMobile && goodsType === 5 && goodsData.liveType === 5) {
        ctx._renderPcDetail = true;
        design = pcDesignMap[goodsType];
      }

      ctx.setGlobal('design', design);
    } catch (error) {
      if (error instanceof DetailLockException) {
        throw error;
      }
      if (get(error, 'code') === detailInvokeErrorMap.LOSTED) {
        throw new DetailLostException();
      } else {
        // ctx.visLogger.warn('[getDetail] warn', error, {});
        // throw new PageException('YZ_DETAIL_LIVE' as any, '服务器开了个小差,请稍后重试');

        // 除了商品不存在以外的后端错误都统一抛给中间件处理
        // 使用 pageException 会导致 businessError 也会发 error 报错
        throw error;
      }
    }
  }

  async fetchActivity(alias: string) {
    const { ctx } = this;
    const { kdtId, visBuyer } = ctx;
    if (ctx.query.ump_type === 'seckill') {
      const query = {
        goodsAlias: alias,
        seckillAlias: ctx.query.ump_alias || ctx.query.ump_alias_bak,
        userId: visBuyer.buyerId,
        includeSalesman: true,
      };

      const { secKill, salesman } = await new SeckillCustomerFacade(ctx).getWithAggregate(kdtId, query);

      return [
        {
          type: 'seckill',
          data: secKill,
        },
        {
          type: 'invite',
          data: salesman,
        },
      ];
    }
    let platform = null;
    if (ctx.isWeixin) {
      platform = 'weixin';
    }
    if (ctx.isWeapp) {
      platform = 'weapp';
    }
    const query = {
      userId: visBuyer.buyerId,
      productType: 31,
      productAlias: alias,
      platform,
    };
    const result = await new ActivityService(ctx).findByProduct({
      kdtId,
      query,
    });
    return result;
  }

  async getActivity() {
    const { ctx } = this;
    const { params } = ctx;
    let activityData = [];
    try {
      activityData = await this.fetchActivity(params.alias);
    } catch (error) {
      ctx.visLogger.warn('[getActivity] warn', error, {});
      // 活动查询失败不影响页面展示
    }
    ctx.setGlobal('activityData', escape(JSON.stringify(activityData)));
  }

  async getSalesmanInfo() {
    const { alias } = this.ctx.params;
    try {
      await this.getShareIcon(this.ctx, alias);
    } catch (error) {
      this.ctx.visLogger.error('[getSalesmanInfo] error', error, {});
    }
  }

  async prepare() {
    await this.setGlobalTheme();
    try {
      if (!(await this.enterCampus())) {
        await Promise.all([
          this.setPointsName(),
          this.getShopConfig(),
          this.getMpFollowed(),
          this.bindSalesman(),
          this.getSalesmanInfo(),
          this.getDetail(),
          this.getActivity(),
        ]);
      }
    } catch (error) {
      if (error instanceof DetailLockException) {
        await this.ctx.render('course/lock/index.html');
        return;
      }
      if (error instanceof DetailLostException) {
        await this.ctx.render('edu/empty-page.html');
        return;
      }
      throw error;
    }
  }

  async getIndexHtml() {
    if (this.ctx._renderPcDetail) {
      this.hideFooter();
      await this.ctx.render('course/pc-detail/index.html');
    } else {
      await this.ctx.render('course/detail/index.html');
    }
  }

  /**
   * 查询直播详情
   */
  async getLiveJson() {
    const ctx = this.ctx;
    const { alias = '' } = ctx.query;
    const kdtId = ctx.kdtId;
    const ret = await new ClientEduProduct(ctx).getSimple(kdtId, alias);

    ctx.json(0, 'ok', ret);
  }

  // 单独查询商详信息接口
  async goods() {
    const { ctx } = this;
    const { query } = ctx;

    try {
      const { goodsType, goodsData } = await this.fetchGoods(query.alias, query.sortType);
      const design = designMap[goodsType];

      ctx.json(0, 'ok', {
        goodsType,
        goodsData,
        design,
      });
    } catch (error) {
      if (error instanceof DetailLockException) {
        ctx.json(1, 'WSC-H5-VIS-GOODS-LOCKED', {});
      } else {
        ctx.visLogger.warn('[getDetail] warn', error, {});
        throw error;
      }
    }
  }

  // 单独查询活动信息接口
  async activity() {
    const { ctx } = this;
    const { query } = ctx;
    try {
      const result = await this.fetchActivity(query.alias);
      ctx.json(0, 'ok', result);
    } catch (error) {
      ctx.json(0, 'ok', []);
    }
  }

  // 查询sku信息
  async getSkuFormatModel() {
    const { ctx } = this;
    const { query, kdtId } = ctx;
    const result = await new ClientCourseFacade(ctx).getSkuFormatModel(kdtId, query.alias);
    ctx.json(0, 'ok', result);
  }

  async getAssetState(ctx: Context) {
    const { query, kdtId, userId } = ctx;
    const { alias } = query;
    const result = await new ClientEduProduct(ctx).getAssetState(kdtId, {
      alias,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  // 获取当前用户是否下过订单，用以在老带新拼团时判断是否为老客
  async getHasBookedOrder() {
    const { ctx } = this;
    const params = {
      kdtId: +ctx.kdtId,
      userId: ctx.userId,
    };
    const hasBookedOrder = await new BehaviorQueryService(ctx).hasBookedOrder(params);
    ctx.setGlobal('hasBookedOrder', hasBookedOrder);
  }
};
