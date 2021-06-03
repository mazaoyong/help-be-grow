const BaseService = require('../../../base/BaseService');

class RelatedImageService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.relatedimage.RelatedImageCustomFacade';
  }

  // 开通商户号
  async findRelatedImg(params) {
    const result = await this.owlInvoke('findRelatedImg', params);

    return result;
  }
}

module.exports = RelatedImageService;
