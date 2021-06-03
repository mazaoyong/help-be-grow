const BaseService = require('../../../../base/BaseService');
/* com.youzan.owl.api.client.edu.exam.CourseExamFacade -  */
class CourseExamFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.exam.CourseExamFacade';
  }

  /**
   *  获取商品关联的最近一场考试
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902455
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} alias - 商品alias
   *  @return {Promise}
   */
  async getLatestExamByProduceAlias(kdtId, alias) {
    return this.invoke('getLatestExamByProduceAlias', [kdtId, alias]);
  }

  /**
   *  查询课程可以参加的考试有哪些
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902454
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query - 查询条件
   *  @param {string} query.alias - 别名
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async findPageByQuery(kdtId, pageRequest, query) {
    return this.invoke('findPageByQuery', [kdtId, pageRequest, query]);
  }

  /**
   *  根据examTemplateId, 获取推荐的商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902557
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {number} examTemplateId - 考试目标id
   *  @return {Promise}
   */
  async findProductByExam(kdtId, pageRequest, examTemplateId) {
    return this.invoke('findProductByExam', [
      kdtId,
      pageRequest,
      examTemplateId,
    ]);
  }
}

module.exports = CourseExamFacade;
