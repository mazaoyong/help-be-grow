const BaseService = require('../base/BaseService');
/** com.youzan.owl.ump.api.exam.ExamResultFacade -  */
class PosterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.exam.ExamResultFacade';
  }

  /**
   *  获取结果列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178049
   *
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 店铺的id
   *  @param {number} query.examId - 测试的id
   *  @param {number} query.id - 结果的id
   *  @param {string} query.title - 标题
   *  @return {Object}
   */
  async getResultList(query) {
    return this.invoke('getResultList', [query]);
  }

  /**
   *  保存结果集：支持批量的新建结果，修改结果
   *
   *  @param {Object} result - 待保存的结果集
   *  @return {Object}
   */
  async saveResultList(result) {
    return this.invoke('saveResultList', [result]);
  }

  /**
   *  更新结果集
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/438127
   *
   *  @param {Object} result -
   *  @param {number} result.kdtId - 店铺id
   *  @param {number} result.examId - 店铺id
   *  @param {Array.<Array>} result.deleteResultIdList[] - 需要删除的结果id列表
   *  @param {Array} result.deleteResultIdList[] -
   *  @param {Array.<Object>} result.resultSaveList[] - 创建的结果集
   *  @return {Promise}
   */
  async updateResultList(result) {
    return this.invoke('updateResultList', [result]);
  }
}

module.exports = PosterService;
