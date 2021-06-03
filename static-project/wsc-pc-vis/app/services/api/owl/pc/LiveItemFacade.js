const BaseService = require('../../../base/BaseService');

class LiveItemFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.livemarketing.LiveItemFacade';
  }

  /**
   * @description 分页查询直播间商品
   * @link http://zanapi.qima-inc.com/site/service/view/941331
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }

  /**
   * @description 保存（创建&更新）直播商品
   * @link http://zanapi.qima-inc.com/site/service/view/941329
   */
  async save(kdtId, command) {
    return this.invoke('save', [kdtId, command]);
  }

  /**
   * @description 移除直播间商品
   * @link http://zanapi.qima-inc.com/site/service/view/941330
   */
  async remove(kdtId, command) {
    return this.invoke('remove', [kdtId, command]);
  }
}

module.exports = LiveItemFacade;
