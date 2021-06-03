import { Context } from 'astroboy';
import BaseController from '../../base/BaseNewController';
import MpService from '../../../services/owl/api/MpService';

class IndexController extends BaseController {
  async renderHtml(ctx: Context) {
    await this.setGlobalTheme();
    // 直接进入作业本领取页先不要求登录
    if (ctx.path.indexOf('homework/workbook') !== -1) {
      this.baseAcl({
        useAjaxLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
      })
    } else {
      await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
      });
    }
    await this.getMpFollowed();
    await ctx.render('supv/homework/index');
  }

  async getMpFollowed() {
    const { ctx } = this;
    let mpFollowed = true;
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
}

export = IndexController;
