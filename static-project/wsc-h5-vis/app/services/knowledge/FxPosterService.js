const KnowledgeBaseService = require('./KnowledgeBaseService');

class FxPosterService extends KnowledgeBaseService {
  get RELATED_IMAGE_FACAD_SERVICE() {
    return 'com.youzan.owl.api.facade.RelatedImageFacade';
  }

  /**
   * 获取分销员海报背景图
   * @param {*} params
   * @param params.channel 渠道 1 分销员海报 2 微信拉群
   * @param params.kdtId
   * @param params.targetAlias
   */
  async findRelatedImg(params) {
    const result = this.owlInvoke(this.RELATED_IMAGE_FACAD_SERVICE, 'findRelatedImg', [params]);
    return result;
  }
}

module.exports = FxPosterService;
