const BaseService = require('../base/BaseService');

/** com.youzan.owl.ump.api.exam.ExamShareFacade -  */
class ExamShareFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.exam.ExamShareFacade';
  }

  /**
   *  获取分享样式信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178905
   *
   *  @param {Object} queryDTO - 查询参数
   *  @param {number} queryDTO.id - 分享的id
   *  @return {Object}
   */
  async getShare(queryDTO) {
    return this.invoke('getShare', [queryDTO]);
  }
}

module.exports = ExamShareFacade;
