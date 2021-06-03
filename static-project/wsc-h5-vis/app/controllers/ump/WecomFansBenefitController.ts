import BaseNewController from '../base/BaseNewController';
import FansBenefitCommandService from '../../services/api/wecom/ump/FansBenefitCommandService';
import { IYzUserGoodsReqDTO } from 'definitions/api/wecom/helper/WecomCustomerService/recordUserGoods';
import UserInfoService from '../../services/api/uic/api/UserInfoService';
import OmniChannelService from '../../services/api/uic/acl/OmniChannelService';

class WecomFansBenefitController extends BaseNewController {
  /** @description 上报用户最新浏览商品记录 */
  async postRecordUserGoodsJson() {
    const { ctx } = this;
    const { goodsAlias, goodsUrl } = ctx.getPostData<Pick<IYzUserGoodsReqDTO, 'goodsAlias' | 'goodsUrl'>>();

    this.validator.required(goodsAlias, 'goodsAlias 为必传参数');
    this.validator.required(goodsUrl, 'goodsUrl 为必传参数');

    const yzUserGoodsReqDTO: IYzUserGoodsReqDTO = {
      goodsAlias,
      goodsUrl,
      yzKdtId: ctx.kdtId,
      yzUserId: ctx.userId,
    };

    const result = await new FansBenefitCommandService(ctx).recordUserGoods(yzUserGoodsReqDTO);
    ctx.success(result);
  }

  async checkUnionId() {
    const { ctx } = this;
    const { url } = ctx.query;
    const { platform } = ctx.getLocalSession();
    const platformFansId = platform.platform_fans_id;
    const fansInfo = await new UserInfoService(
      ctx
    ).getPlatformUserInfoByFansId({ platformFansId });

    if (fansInfo.unionId) {
      return ctx.fastJson(0, 'ok', { hasUnionId: true, authRedirectUrl: '' });
    }

    const params = {
      kdtId: ctx.kdtId,
      resourceUrl: url,
      platformName: ctx.platform,
      sessionId: ctx.sessionId,
    };

    const result = await new OmniChannelService(ctx).getPlatformOauthUrl(
      params
    );
    return ctx.fastJson(0, 'ok', {
      hasUnionId: false,
      authRedirectUrl: result,
    });
  }
}

export = WecomFansBenefitController;
