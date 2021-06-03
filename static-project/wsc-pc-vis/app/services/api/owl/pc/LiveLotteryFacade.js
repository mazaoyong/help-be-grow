const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.onlinecourse.LiveLotteryFacade */
class LiveLotteryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.LiveLotteryFacade';
  }

  /**
   * 分页查询直播间的抽奖记录
   * @link http://zanapi.qima-inc.com/site/service/view/1060661
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} pageQuery -
   * @param {string} pageQuery.alias - 直播商品alias
   * @return {Promise}
   */

  async findWinLotteryPage(kdtId, pageRequest, pageQuery) {
    return this.invoke('findWinLotteryPage', [kdtId, pageRequest, pageQuery]);
  }

  /**
   * 提交直播间中奖记录的导出任务
   * @link http://zanapi.qima-inc.com/site/service/view/1060662
   * @param {number} kdtId -
   * @param {Object} query -
   * @param {string} query.alias - 直播商品alias
   * @param {string} query.lotteryId - 抽奖场次ID
   * @param {Object} query.operator - 操作人
   * @return {Promise}
   */

  async submitExportTask(kdtId, query) {
    return this.invoke('submitExportTask', [kdtId, query]);
  }
}

module.exports = LiveLotteryFacade;
