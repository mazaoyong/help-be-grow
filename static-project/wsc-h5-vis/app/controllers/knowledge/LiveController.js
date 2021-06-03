const KnowledgeBaseController = require('./KnowledgeBaseController');
const ClientLiveFacade = require('../../services/owl/client/onlinecourse/ClientLiveFacade');
const LiveVideoFacade = require('../../services/api/owl/api/LiveVideoFacade');

class LiveController extends KnowledgeBaseController {
  /**
   * 移除讲师
   */
  async getReLectorJson(ctx) {
    const { live_id: liveId = 0, re_wx_uid: reWxUid = '', enable = '', alias, buyerUid = '' } = ctx.query;
    const { openId: wxUid = '' } = ctx.visBuyer;
    const operatorBuyerUid = alias + ctx.userId;
    const ret = await new ClientLiveFacade(ctx).updateEnable(
      ctx.kdtId, liveId, wxUid, reWxUid, enable, alias, buyerUid, operatorBuyerUid,
    );
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取讲师列表
   */
  async getLectorUserJson(ctx) {
    const {
      timestamp = '0',
      alias = '',
    } = ctx.query;

    let {
      openId: uid = '',
      fansId = 0,
      finalAvatar: avatar = '',
      finalUsername: nickname = '',
    } = ctx.visBuyer;
    const {
      kdtId = 0,
      userId: buyerId,
    } = ctx;

    const ret = await new ClientLiveFacade(ctx).getLectorUser(kdtId, {
      kdtId, fansId, nickname, avatar, uid, timestamp, alias, buyerId,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 查询直播详情
   */
  async getLiveJson(ctx) {
    const { alias = '' } = ctx.query;
    const {
      buyerId,
      fansId,
      fansType,
    } = ctx.visBuyer;
    const kdtId = ctx.kdtId;
    const ret = await new ClientLiveFacade(ctx).getLiveDetail(kdtId, {
      alias,
      buyerId,
      fansId,
      fansType,
    });

    ctx.json(0, 'ok', ret);
  }

  /**
   * 分页查询直播列表
   */
  async getLivesJson(ctx) {
    const {
      show_in_store: showInStore = 1,
      sell_status: sellStatus = 0,
      title = '',
      page = 1,
      page_size: pageSize = 10,
    } = ctx.query;
    const kdtId = ctx.kdtId;
    const buyerId = ctx.buyerId;
    const ret = await new ClientLiveFacade(ctx).findLivesByPage(kdtId, {
      kdtId, showInStore, sellStatus, title, buyerId,
    }, {
      pageNumber: page,
      pageSize: pageSize,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取讲师邀请码
   */
  async getInviteLecturerCodeJson(ctx) {
    const { alias } = ctx.query;
    const ret = await new ClientLiveFacade(ctx).getInviteLecturerQr({
      kdtId: ctx.kdtId,
      alias,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取讲师邀请码中间页数据
   */
  async getInviteLecturerCentreJson(ctx) {
    const { alias = '', timestamp = '', live_id: liveId = '' } = ctx.query;
    const {
      openId: uid = '',
      fansId = '',
      fansPicture: avatar = '',
      buyerNickname: nickname = '',
    } = ctx.visBuyer;
    const {
      kdtId,
      userId: buyerId,
    } = ctx;

    const ret = await new ClientLiveFacade(ctx).inviteLecturer(kdtId, {
      kdtId, fansId, nickname, avatar, uid, timestamp, liveId: liveId || null, alias, buyerId,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取消息列表
   */
  async getLiveNewsByPage(ctx) {
    const {
      user_type: userType = 0,
      msg_id: msgId,
      msg_cat: msgCat = 0,
      msg_site: msgSite = 0,
      live_id: liveId = 0,
      status = 0,
      wx_uid: wxUid,
      q_status: qStatus = 0,
      page_size: pageSize = 0,
      sort = 0,
    } = ctx.query;
    console.log(ctx.query);

    const ret = await new ClientLiveFacade(ctx).getLiveNewsByPage(ctx.kdtId, {
      userType, msgCat, msgSite, liveId: liveId || 0, status, wxUid, pageSize, qStatus, msgId: msgId || null, sort,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 下载微信媒体资源
   */
  async getMediaUploadJson(ctx) {
    const {
      dp_id: kdtId = 0,
      media_id: mediaId = 0,
    } = ctx.query;
    const ret = await new ClientLiveFacade(ctx).wxMediaDownLoadAsyn(mediaId, kdtId);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 下载微信媒体资源，支持高保真
   */
  async getHighMediaUploadJson(ctx) {
    const {
      dpId: kdtId = 0,
      mediaId = 0,
      useHigh,
    } = ctx.query;
    const ret = await new ClientLiveFacade(ctx).highWxMediaDownLoadAsyn(kdtId, mediaId, useHigh);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取讲师信息
   */
  async getLectorUserByWxUidV2(ctx) {
    const { wxUid, liveId, buyerUid } = ctx.query;
    const { kdtId } = ctx;
    const res = await new ClientLiveFacade(ctx).getLectorUserByWxUidV2(kdtId, {
      wxUid,
      liveId: Number(liveId),
      buyerUid,
    });

    ctx.json(0, 'ok', res);
  }

  /**
   * 更新讲师信息
   */
  async updateUserInfo(ctx) {
    const {
      avatar,
      liveId,
      nickname,
      userDesc,
      fansId,
      wxUid,
      reUid,
      alias,
      buyerUid,
    } = ctx.request.body;
    const operatorBuyerUid = alias + ctx.userId;
    const res = await new ClientLiveFacade(ctx).updateUserInfo(ctx.kdtId, {
      avatar,
      fansId,
      liveId,
      nickname,
      userDesc,
      uid: wxUid,
      reUid,
      alias,
      operatorBuyerUid,
      buyerUid,
    });
    ctx.json(0, 'ok', res);
  }

  /**
   * 获取保利威直播间链接
   *
   * @param {any} ctx 上下文
   * @return {undefined}
   */
  async getLiveLink(ctx) {
    const { kdtId, visBuyer: { buyerId }, query: { alias } } = ctx;
    const res = await new LiveVideoFacade(ctx).getLiveLink(kdtId, {
      alias,
      userId: buyerId,
    });
    ctx.json(0, 'ok', res);
  }
}

module.exports = LiveController;
