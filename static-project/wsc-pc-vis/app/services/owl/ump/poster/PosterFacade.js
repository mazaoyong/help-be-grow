const BaseService = require('../../../base/BaseService');
/** com.youzan.owl.ump.api.poster.PosterFacade -  */
class PosterFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.poster.PosterFacade';
  }

  /**
   *  分页查询海报活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275531
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[]} pageRequest.sort.orders -
   *  @param {Object} query -
   *  @param {string} query.title - 海报标题
   *  @param {number} query.status - 海报活动状态
   *  @return {Promise}
   */
  async find(kdtId, pageRequest, query) {
    return this.invoke('find', [kdtId, pageRequest, query]);
  }

  /**
   *  创建海报
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275527
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {Object} command.product - 参加活动的商品
   *  @param {number} command.custom - 是否自定义海报背景
   *  @param {string} command.title - 海报标题
   *  @param {number} command.endAt - 活动结束时间戳
   *  @param {number} command.targetFansNum - 目标拉粉丝人数
   *  @param {string} command.url - 海报背景url
   *  @param {string} command.content - 海报文案
   *  @param {number} command.startAt - 活动开始时间戳
   *  @param {number} command.fansType - 本次海报活动，新粉丝类型定义
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  根据海报id删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275530
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async delete(kdtId, id) {
    return this.invoke('delete', [kdtId, id]);
  }

  /**
   *  编辑海报
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275528
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {Object} command.product - 参与活动的商品
   *  @param {number} command.custom - 是否自定义海报背景
   *  @param {number} command.id - 海报模版id
   *  @param {string} command.title - 海报标题
   *  @param {number} command.endAt - 活动结束时间戳
   *  @param {number} command.targetFansNum - 目标拉粉丝人数
   *  @param {string} command.url - 海报背景url
   *  @param {string} command.content - 海报文案
   *  @param {number} command.startAt - 活动开始时间戳
   *  @param {number} command.fansType - 本次海报活动，新粉丝类型定义
   *  @return {Promise}
   */
  async edit(kdtId, command) {
    return this.invoke('edit', [kdtId, command]);
  }

  /**
   *  根据海报id获取海报详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275529
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getById(kdtId, id) {
    return this.invoke('getById', [kdtId, id]);
  }

  /**
   *  推广正在进行中的活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275533
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async popularize(kdtId, id) {
    return this.invoke('popularize', [kdtId, id]);
  }

  /**
   *  结束进行中的活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/275532
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async terminate(kdtId, id) {
    return this.invoke('terminate', [kdtId, id]);
  }
}

module.exports = PosterFacade;
