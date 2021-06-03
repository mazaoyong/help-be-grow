const BaseService = require('../../services/base/BaseService');
const BaseController = require('../base/BaseController');

class KnowledgeBaseController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.knowledgeAcl();
      await this.setYZEduToGlobal();
    }

    // 只有页面请求才打日志
    if (!this.ctx.acceptJSON) {
      this.ctx.visLogger.info('[KnowledgeBaseController] path result global', '', this.ctx.getGlobal());
    }
  }

  async setYZEduToGlobal() {
    const { ctx } = this;
    const { kdtId } = ctx;

    // FIX: 消除特殊情况kdtid null时的店铺借口报错
    const data = kdtId ? await new BaseService(ctx).queryShopMetaInfo(kdtId) : null;
    if (data && data.shopTopic && data.shopTopic === 1) {
      ctx.setGlobal('isYZEdu', true);
      return;
    }
    ctx.setGlobal('isYZEdu', false);
  }

  /**
   * 知识付费ACL
   */
  async knowledgeAcl() {
    // 权限验证 acl
    if (this.ctx.query.sg === 'live') {
      // 直播页面做了登录处理 此处不需要 acl
      return false;
    }
    if (this.ctx.platform === 'weixin') {
      // 微信页面访问不做处理 在 index 中做处理
      return false;
    }
    await this.baseAcl({
      useAjaxLogin: true,
    });
  }
}

module.exports = KnowledgeBaseController;
