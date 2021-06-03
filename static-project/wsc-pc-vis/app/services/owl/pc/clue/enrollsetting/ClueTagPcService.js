const BaseService = require('../../../../base/BaseService');

class ClueTagPcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueTagPcFacade';
  }

  /**
   *  分页查询线索标签分组（含有线索标签）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404007
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async findTagGroupList(kdtId) {
    return this.invoke('findTagGroupList', [kdtId]);
  }

  /**
   *  创建标签分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/403999
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建实体
   *  @param {string} command.name - 分组名称
   *  @param {number} command.multiSelect - 是否可以多选
   *  @return {Promise}
   */
  async createTagGroup(kdtId, command) {
    return this.invoke('createTagGroup', [kdtId, command]);
  }

  /**
   *  更新标签分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404000
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 更新实体
   *  @param {number} command.groupId - 线索分组id
   *  @param {string} command.name - 分组名称
   *  @param {number} command.multiSelect - 是否可以多选
   *  @return {Promise}
   */
  async updateTagGroup(kdtId, command) {
    return this.invoke('updateTagGroup', [kdtId, command]);
  }

  /**
   *  删除标签分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404001
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} groupId - 更新实体
   *  @return {Promise}
   */
  async deleteTagGroup(kdtId, groupId) {
    return this.invoke('deleteTagGroup', [kdtId, groupId]);
  }

  /**
   *  分页查询线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404002
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findTagGroupPage(kdtId, pageRequest) {
    return this.invoke('findTagGroupPage', [kdtId, pageRequest]);
  }

  /**
   *  分页查询线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404002
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {number} groupId - 分组id
   *  @return {Promise}
   */
  async findTagPage(kdtId, pageRequest, query) {
    return this.invoke('findTagPage', [kdtId, pageRequest, query]);
  }

  /**
   *  创建标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404003
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建实体
   *  @param {number} command.groupId - 分组id
   *  @param {string} command.name - 分组名称
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async createTag(kdtId, command) {
    return this.invoke('createTag', [kdtId, command]);
  }

  /**
   *  更新标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404004
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 更新实体
   *  @param {number} command.tagId - 标签id
   *  @param {string} command.name - 标签名称
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async updateTag(kdtId, command) {
    return this.invoke('updateTag', [kdtId, command]);
  }

  /**
   *  删除标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404005
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} tagId - 标签id
   *  @return {Promise}
   */
  async deleteTag(kdtId, tagId) {
    return this.invoke('deleteTag', [kdtId, tagId]);
  }

  /**
   *  批量删除标签
   *  zanAPI文档地址: -
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Array<number>} tagIds - 标签id
   *  @return {Promise}
   */
  async deleteTags(kdtId, tagIds) {
    return this.invoke('batchDeleteTag', [kdtId, tagIds]);
  }

  /**
   *  标签换组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404006
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 操作实体
   *  @param {Array.<Array>} command.tagIds[] - 标签id列表
   *  @param {Array} command.tagIds[] -
   *  @param {string} command.newGroupId - 新分组id
   *  @return {Promise}
   */
  async changeGroup(kdtId, command) {
    return this.invoke('changeGroup', [kdtId, command]);
  }
}

module.exports = ClueTagPcService;
