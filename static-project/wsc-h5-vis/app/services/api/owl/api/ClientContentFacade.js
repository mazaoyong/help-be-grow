const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.onlinecourse.ClientContentFacade -  */
class ClientContentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientContentFacade';
  }

  /**
   *  查询目录树
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1029361
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页
   *  @param {number} [pageRequest.pageNumber] -
   *  @param {boolean} [pageRequest.countEnabled] - 是否开启count，默认为开启
   *  @param {number} [pageRequest.pageSize] -
   *  @param {Object} [pageRequest.sort] -
   *  @param {Object} [pageRequest.sort.orders] -
   *  @param {Object} queryDTO - 查询dto
   *  @param {number} [queryDTO.columnId] - 专栏id
   *  @param {number} [queryDTO.pid] - 父目录id
   *  @param {string} queryDTO.columnAlias - 专栏的别名
   *  @return {Promise}
   */
  async queryDirectoryList(kdtId, pageRequest, queryDTO) {
    return this.invoke('queryDirectoryList', [kdtId, pageRequest, queryDTO]);
  }

  /**
   *  用户端 - 查询直播和内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511466
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} [query.directoryId] - 目录id
   *  @param {number} query.buyerId - 购买人id
   *  @param {string} query.columnAlias - 专栏别名
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} [pageRequest.countEnabled] - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageContentWithLive(kdtId, query, pageRequest) {
    return this.invoke('findPageContentWithLive', [kdtId, query, pageRequest]);
  }

  /**
   *  c端-分页查询内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509901
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 店铺ID
   *  @param {number} query.buyerId - 用户Id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, query, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, query, pageRequest]);
  }

  /**
   *  查询内容聚合信息，包含内容商品信息、是否订阅、会员卡、0元开关等信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/497979
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.alias - 内容别名
   *  @param {number} query.accessEnvironment - 当前访问环境 0:h5 1:微信 2:小程序 {@link com.youzan.owl.enums.AccessEnvironment}
   *  @param {number} query.userId - 用户id，C端用户查询内容时需要
   *  @return {Promise}
  */
  async getContentAggregateDetail(kdtId, query) {
    return this.invoke('getContentAggregateDetail', [kdtId, query]);
  }
}

module.exports = ClientContentFacade;
