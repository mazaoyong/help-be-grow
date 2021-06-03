const BaseService = require('../../../base/BaseService');

class CluePluginService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.plat.CluePluginInitFacade';
  }

  /**
   *
   *  查询线索插件初始化状态
   *  http://zanapi.qima-inc.com/site/service/view/589915
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @return {Promise}
   */
  async getInitStatus(kdtId, query = {}) {
    const result = await this.invoke('getInitStatus', [kdtId, query]);
    // 初始化状态 0-未初始化，1-初始化中，99-异常，100-完成
    return result;
  }

  /**
   *  初始化线索插件
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/617853
   *
   *  @param {number} kdtId - 当前操作的店铺信息
   *  @param {Object} command - 初始化操作对象
   *  @param {Object} command.operator - 操作者信息
   *  @return {Promise}
   */
  async initCluePlugin(kdtId, command) {
    return this.invoke('initCluePlugin', [kdtId, command]);
  }
}

module.exports = CluePluginService;
