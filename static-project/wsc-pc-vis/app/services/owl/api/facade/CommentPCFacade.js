const BaseService = require('../../../base/BaseService');

/**
 * 评论相关接口
 * @class CommentPCFacade
 * @extends {BaseService}
 */
class CommentPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.facade.CommentPCFacade';
  }

  /**
   *  获取一家店的知识付费的所有内容的未读评论总数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/121796
   *
   *  @param {number} kdtId - 店铺id 必填
   *  @return {Promise}
   */
  async getNonReadCommentsCountByKdtId(kdtId) {
    return this.invoke('getNonReadCommentsCountByKdtId', [{ kdtId }]);
  }
}

module.exports = CommentPCFacade;
