const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.pc.api.clue.enrollsetting.ClueSourcePcFacade -  */
class ClueSourcePcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueSourcePcFacade';
  }

  /**
   *  获取来源分组列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417290
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 是否需要返回系统分组
   *  @param {boolean} query.needSystemDefault - 是否需要系统默认
   *  @param {number} query.kdtId - 总店或校区店铺id
   *  @return {Promise}
   */
  async findSourceGroupList(kdtId, query) {
    return this.invoke('findSourceGroupList', [kdtId, query]);
  }

  /**
   *  分页查询线索来源分组（含有线索来源）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/422952
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query -
   *  @param {boolean} query.needSystemDefault - 是否需要系统默认
   *  @return {Promise}
   */
  async findSourceGroupPage(kdtId, pageRequest, query) {
    return this.invoke('findSourceGroupPage', [kdtId, pageRequest, query]);
  }

  /**
   *  创建自定义来源分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417291
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建实体
   *  @param {string} command.name - 分组名称
   *  @return {Promise}
   */
  async createSourceGroup(kdtId, command) {
    return this.invoke('createSourceGroup', [kdtId, command]);
  }

  /**
   *  更新来源分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417292
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 更新实体
   *  @param {number} command.groupId - 线索分组id
   *  @param {string} command.name - 分组名称
   *  @return {Promise}
   */
  async updateSourceGroup(kdtId, command) {
    return this.invoke('updateSourceGroup', [kdtId, command]);
  }

  /**
   *  删除来源分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417293
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} groupId - 更新实体
   *  @return {Promise}
   */
  async deleteSourceGroup(kdtId, groupId) {
    return this.invoke('deleteSourceGroup', [kdtId, groupId]);
  }

  /**
   *  分页查询线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417294
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 分组id
   *  @param {number} query.kdtId - 总部或校区的id
   *  @param {number} query.groupId - 来源分组id
   *  @return {Promise}
   */
  async findSourcePage(kdtId, pageRequest, query) {
    return this.invoke('findSourcePage', [kdtId, pageRequest, query]);
  }

  /**
   *  创建来源
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417295
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建实体
   *  @param {number} command.groupId - 分组id
   *  @param {string} command.name - 分组名称
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async createSource(kdtId, command) {
    return this.invoke('createSource', [kdtId, command]);
  }

  /**
   *  更新来源
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417296
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 更新实体
   *  @param {number} command.sourceId - 来源id
   *  @param {number} command.groupId - 分组id
   *  @param {string} command.name - 名称
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async updateSource(kdtId, command) {
    return this.invoke('updateSource', [kdtId, command]);
  }

  /**
   *  换组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417298
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 操作实体
   *  @param {number} command.newGroupId - 新分组id
   *  @param {Array.<Array>} command.sourceIds[] - 来源id
   *  @param {Array} command.sourceIds[] -
   *  @return {Promise}
   */
  async changeGroup(kdtId, command) {
    return this.invoke('changeGroup', [kdtId, command]);
  }

  /**
   *  删除来源
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417297
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Array} sourceIds - 来源id
   *  @return {Promise}
   */
  async batchDeleteSource(kdtId, sourceIds) {
    return this.invoke('batchDeleteSource', [kdtId, sourceIds]);
  }
}

module.exports = ClueSourcePcService;
