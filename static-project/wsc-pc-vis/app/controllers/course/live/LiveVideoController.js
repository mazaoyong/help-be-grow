const BaseController = require('../../base/BaseController');
const EduLiveVideoFacade = require('../../../services/api/owl/pc/EduLiveVideoFacade');
const LiveRewardOrderFacade = require('../../../services/owl/pc/order/LiveRewardOrderFacade');

module.exports = class LiveVideoController extends BaseController {
  // 异步创建直播频道
  async asyncCreateLive(ctx) {
    const { kdtId } = ctx;
    const param = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).asyncCreateLive(kdtId, param);
    return ctx.json(0, 'ok', result);
  }

  // 轮询异步创建直播频道的结果
  async getAsyncCreateStatus(ctx) {
    const { kdtId } = ctx;
    const { createId } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).getAsyncCreateStatus(kdtId, createId);
    return ctx.json(0, 'ok', result);
  }

  // 获取视频直播的剩余能力（时间，金额等）
  async liveVideoSurplus(ctx) {
    const { kdtId } = ctx;
    const { liveType } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).liveVideoSurplus(kdtId, { liveType });
    return ctx.json(0, 'ok', result);
  }

  // 视频直播创建前校验
  async liveVideoCreateCheck(ctx) {
    const { kdtId } = ctx;
    const { liveType } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).liveVideoCreateCheck(kdtId, { liveType });
    return ctx.json(0, 'ok', result);
  }

  // 获取进入直播的信息
  async getLiveEnterInfo(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).getLiveEnterInfo(kdtId, { alias });
    return ctx.json(0, 'ok', result);
  }

  // 新增助教, 嘉宾
  async addRole(ctx) {
    const { kdtId } = ctx;
    const param = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).addRole(kdtId, Object.assign(
      {},
      param,
      { operator: this.formatOperator },
    ));
    return ctx.json(0, 'ok', result);
  }

  // 删除助教，嘉宾
  async deleteRole(ctx) {
    const { kdtId } = ctx;
    const param = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).deleteRole(kdtId, param);
    return ctx.json(0, 'ok', result);
  }

  // 更新助教，嘉宾
  async updateRole(ctx) {
    const { kdtId } = ctx;
    const param = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).updateRole(kdtId, Object.assign(
      {},
      param,
      { operator: this.formatOperator },
    ));
    return ctx.json(0, 'ok', result);
  }

  // 开启/关闭回放
  async playbackOpen(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).playbackOpen(kdtId, alias);
    return ctx.json(0, 'ok', result);
  }

  // 视频直播统计
  async liveVideoSurveyV2(ctx) {
    const { kdtId } = ctx;
    const { pageNumber, pageSize, targetKdtId } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).liveVideoSurveyV2(
      kdtId,
      {
        targetKdtId,
      },
      {
        pageNumber,
        pageSize,
      },
    );
    return ctx.json(0, 'ok', result);
  }

  // 刷新 & 视频直播统计
  async refreshSurveyV2(ctx) {
    const { kdtId } = ctx;
    const { pageNumber, pageSize, targetKdtId } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).refreshSurveyV2(
      kdtId,
      {
        targetKdtId,
      },
      {
        pageNumber,
        pageSize,
      },
    );
    return ctx.json(0, 'ok', result);
  }

  // 充值
  async confirmRecharge(ctx) {
    const { kdtId } = ctx;
    const { value } = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).confirmRecharge(kdtId, value);
    return ctx.json(0, 'ok', result);
  }

  // 查询直播概况
  async getLiveSurvey(ctx) {
    const { kdtId } = ctx;
    const { eduLiveSurveyQuery } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).getLiveSurvey(
      kdtId,
      eduLiveSurveyQuery,
    );
    ctx.json(0, 'ok', result);
  }

  // 查询数据趋势
  async listDateTrend(ctx) {
    const { kdtId } = ctx;
    const { eduLiveDateTrendQuery } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).listDateTrend(
      kdtId,
      eduLiveDateTrendQuery,
    );
    ctx.json(0, 'ok', result);
  }

  // 查询学习明细
  async listWatchDetail(ctx) {
    const { kdtId } = ctx;
    const { eduLiveDetailQuery, pageRequest } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).listWatchDetail(
      kdtId,
      pageRequest,
      eduLiveDetailQuery,
    );
    ctx.json(0, 'ok', result);
  }

  // 导出直播详情
  async exportLiveDetail(ctx) {
    const { kdtId } = ctx;
    const { alias, keyword } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).exportLiveDetail(
      kdtId,
      {
        alias,
        keyword,
        ...this.formatOperator,
      },
    );
    ctx.json(0, 'ok', result);
  }

  // 打赏简要记录查询
  async queryRewardBriefInfo(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryData();
    const result = await new LiveRewardOrderFacade(ctx).queryRewardBriefInfo(kdtId, { alias });
    return ctx.json(0, 'ok', result);
  }

  // 打赏记录查询
  async findByCondition(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse() || {};
    const result = await new LiveRewardOrderFacade(ctx).findByCondition(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.json(0, 'ok', result);
  }

  // 直播间打赏配置
  async liveRewardSetting(ctx) {
    const { kdtId } = ctx;
    const { openReward, alias } = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).liveRewardSetting(
      kdtId,
      {
        openReward,
        tag: alias,
      },
    );
    return ctx.json(0, 'ok', result);
  }

  // 获取直播间配置
  async getLiveRewardSetting(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryData();
    const result = await new EduLiveVideoFacade(ctx).getLiveRewardSetting(
      kdtId,
      { tag: alias },
    );
    return ctx.json(0, 'ok', result);
  }

  // 打赏记录导出
  async exportByCondition(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryData();
    const query = {
      alias,
      ...this.formatOperator,
    };
    const result = await new LiveRewardOrderFacade(ctx).exportByCondition(
      kdtId,
      {},
      query,
    );
    return ctx.json(0, 'ok', result);
  }
};
