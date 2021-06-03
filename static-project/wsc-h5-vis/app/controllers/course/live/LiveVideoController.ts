import { Context } from 'astroboy';
import buildUrl from '@youzan/utils/url/buildUrl';
import { PageException } from '@youzan/iron-base';

import LiveBaseController from './LiveBaseController';
import LiveDashboardFacade from '../../../services/api/owl/api/LiveDashboardFacade';
import EduLiveVideoFacade from '../../../services/api/owl/api/EduLiveVideoFacade';
import ClientContentProductFacade from '../../../services/owl/client/product/ClientContentProductFacade';
import LiveRewardOrderFacade from '../../../services/owl/trade/LiveRewardOrderFacade';

class LiveVideoController extends LiveBaseController {
  public async getRoomHtml(ctx: Context) {
    const { kdtId, userId } = ctx;
    const { alias } = ctx.getQueryData();
    await this.setGlobalTheme();

    let liveLink: string;

    if (!alias) {
      throw new PageException(
        'WSC_H5_VIS_ERROR_LIVE_LINK' as any,
        '直播间链接错误'
      );
    }

    try {
      const result = await new EduLiveVideoFacade(ctx).getEduLiveLink(kdtId, {
        alias,
        userId,
      });
      liveLink = result.link;
    } catch (error) {
      // 资产校验失败跳到商详页
      if (error.code === 321100099) {
        return ctx.redirect(
          buildUrl(
            `/wscvis/knowledge/index?page=livedetail&alias=${alias}&kdt_id=${kdtId}`,
            'h5',
            kdtId
          )
        );
      }

      return ctx.redirect(
        buildUrl(
          `/wscvis/course/live/waiting?liveType=5&alias=${alias}&kdt_id=${kdtId}`,
          'h5',
          kdtId
        )
      );
    }

    // 埋点需要 goodsId，可降级
    const goodsInfo = await new ClientContentProductFacade(ctx)
      .getByAlias(kdtId, alias)
      .catch(() => {});
    const productId = goodsInfo ? goodsInfo.productId : 0;
    this.setSpm('pclm', productId);

    this.hideFooter();
    await ctx.render('course/live/video/room.html', {
      title: '直播间',
      liveLink,
    });
  }

  // 为了发布平滑，暂先不下
  public async getEduLiveLinkJson(ctx: Context) {
    const { kdtId, userId } = ctx;
    const { alias } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).getEduLiveLink(kdtId, {
      alias,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  // 查询直播间设置设置
  public async getLiveSettingJson(ctx: Context) {
    const { kdtId, userId } = ctx;
    const { alias } = ctx.getQueryData();
    const { openReward } = await new EduLiveVideoFacade(ctx).getLiveRewardSetting(
      kdtId,
      {
        tag: alias,
        userId,
      });

    const { liveFlowId, switchStatus } = await new LiveDashboardFacade(ctx).getLiveMarketingSetting(kdtId, alias);
    const result = {
      openReward: Boolean(openReward),
      liveSellingState: Boolean(switchStatus),
      liveFlowId: Number(liveFlowId),
    };
    ctx.json(0, 'ok', result);
  }

  // 视频直播打赏下单
  public async createJson(ctx: Context) {
    const { kdtId, userId } = ctx;
    const {
      realPay,
      callbackUrl,
      alias,
    } = ctx.getPostData();

    const result = await new LiveRewardOrderFacade(ctx).create({
      kdtId,
      userId,
      realPay,
      callbackUrl,
      alias,
    });
    ctx.json(0, 'ok', result);
  }
}

export = LiveVideoController;
