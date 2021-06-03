const WechatMsgService = require('../../services/platform/push/WechatMsgService');
const MsgConfigService = require('../../services/owl/msg/MsgConfigService');
const WeChatSubService = require('../../services/owl/msg/WeChatSubService');
const BaseController = require('../../controllers/base/BaseNewController');

class WechatMsgController extends BaseController {
  async isMpTemplateMsgAvailable(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const res = await new WeChatSubService(ctx).isMpTemplateMsgAvailable({
      kdtId,
      uid,
    });
    ctx.json(0, 'ok', res);
  }

  async getTemplate(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const { scene } = ctx.query;
    const res = await new WeChatSubService(ctx).getTemplate({
      kdtId,
      uid,
      scene,
    });
    ctx.json(0, 'ok', res);
  }

  // V2包含templateName（二期好友助力使用）
  async getTemplateV2(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const { scene } = ctx.query;
    const res = await new WechatMsgService(ctx).getTemplate({
      kdtId,
      uid,
      scene,
    });
    ctx.json(0, 'ok', res);
  }

  async subscriptionCallback(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const { scene, templateIdList } = ctx.getPostData();
    const res = await new WeChatSubService(ctx).subscriptionCallback({
      kdtId,
      uid,
      scene,
      templateIdList,
    });
    ctx.json(0, 'ok', res);
  }

  async shouldPullUpMsgDialog(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const {
      scene,
      scopeType,
      goodsId,
      activityId,
    } = ctx.query;
    const params = {
      kdtId,
      msgConfigGetParams: {
        scopeType,
        scopeValue: `${kdtId}_${uid}_${goodsId}_${activityId}`,
      },
      subscriptionTmplListParam: {
        scene,
        uid,
      },
    };
    const res = await new MsgConfigService(ctx).shouldPullUpMsgDialog(params);
    ctx.json(0, 'ok', res);
  }

  async saveMsgConfig(ctx) {
    const kdtId = ctx.kdtId;
    const uid = ctx.buyerId;
    const {
      scene,
      choiceSaveParams,
      scopeType,
      goodsId,
      activityId,
    } = ctx.getPostData();
    const params = {
      kdtId,
      choiceSaveParams,
      scopeType,
      scopeValue: `${kdtId}_${uid}_${goodsId}_${activityId}`,
      scene,
      uid,
    };
    const res = await new MsgConfigService(ctx).saveMsgConfig(params);
    ctx.json(0, 'ok', res);
  }
}

module.exports = WechatMsgController;
