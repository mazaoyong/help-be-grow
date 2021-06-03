const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.onlinecourse.ClientSubsAggregateFacade -  */
class ClientSubsAggregateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientSubsAggregateFacade';
  }

  /**
    *  C端我的课程 内容、专栏、会员聚合接口，透传到red-line
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505805
    *
    *  @param {number} kdtId - 店铺ID
    *  @param {Object} pageRequest - 分页请求
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object} pageRequest.sort -
    *  @param {Object} query - 查询参数
    *  @param {number} query.tabCode - tab标识 1：专栏 2：内容 3：会员
    *  @param {number} query.userId - 用户id
    *  @return {Promise}
  */
  async findMyCourseAggregationInfo(kdtId, pageRequest, query) {
    return this.invoke('findMyCourseAggregationInfo', [
      kdtId,
      pageRequest,
      query,
    ]);
  }
}

module.exports = ClientSubsAggregateFacade;
