const BaseService = require('../../../base/BaseService');

// 线索查询
class ClueQueryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.ClueQueryFacade';
  }

  /**
   *  全部线索列表分页接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/415220
   *
   *  @param {number} kdtId - 商家id
   *  @param {Object} request - 分页参数
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} clueInfoQuery - 查询参数
   *  @param {number} clueInfoQuery.phase - 线索阶段 (0,默认态),(1,待分配),(2,待跟进),(3,待邀约),(4,待试听),(5,已试听),(6,已成交),(7,放弃线索),(8,已删除)
   *  @param {number} clueInfoQuery.sourceId - 来源id
   *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
   *  @param {number} clueInfoQuery.kdtId - 校区kdtId
   *  @param {string} clueInfoQuery.name - 名称
   *  @param {string} clueInfoQuery.telephone - 电话号码
   *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
   *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
   *  @param {number} clueInfoQuery.ownerId - 课程顾问userId
   *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
   *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
   *  @return {Promise}
   */
  async findAllByPage(kdtId, request, clueInfoQuery) {
    return this.invoke('findAllByPage', [kdtId, request, clueInfoQuery]);
  }

  /**
   *  公海池列表分页接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/415221
   *
   *  @param {number} kdtId - 商家id
   *  @param {Object} request - 分页参数
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} clueInfoQuery - 查询参数
   *  @param {number} clueInfoQuery.phase - 线索阶段 (0,默认态),(1,待分配),(2,待跟进),(3,待邀约),(4,待试听),(5,已试听),(6,已成交),(7,放弃线索),(8,已删除)
   *  @param {number} clueInfoQuery.sourceId - 来源id
   *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
   *  @param {number} clueInfoQuery.kdtId - 校区kdtId
   *  @param {string} clueInfoQuery.name - 名称
   *  @param {string} clueInfoQuery.telephone - 电话号码
   *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
   *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
   *  @param {number} clueInfoQuery.ownerId - 课程顾问userId
   *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
   *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
   *  @return {Promise}
   */
  async findPublicPoolByPage(kdtId, request, clueInfoQuery) {
    return this.invoke('findPublicPoolByPage', [kdtId, request, clueInfoQuery]);
  }

  /**
   *  我的线索列表分页接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/415222
   *
   *  @param {number} kdtId - 商家id
   *  @param {Object} request - 分页参数
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} clueInfoQuery - 查询参数
   *  @param {number} clueInfoQuery.phase - 线索阶段 (0,默认态),(1,待分配),(2,待跟进),(3,待邀约),(4,待试听),(5,已试听),(6,已成交),(7,放弃线索),(8,已删除)
   *  @param {number} clueInfoQuery.sourceId - 来源id
   *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
   *  @param {number} clueInfoQuery.kdtId - 校区kdtId
   *  @param {string} clueInfoQuery.name - 名称
   *  @param {string} clueInfoQuery.telephone - 电话号码
   *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
   *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
   *  @param {number} clueInfoQuery.ownerId - 课程顾问userId
   *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
   *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
   *  @return {Promise}
   */
  async findMyClueByPage(kdtId, request, clueInfoQuery) {
    return this.invoke('findMyClueByPage', [kdtId, request, clueInfoQuery]);
  }

  /**
   *  全部线索列表分页接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/824296
   *
   *  @param {number} kdtId - 商家id
   *  @param {Object} request - 分页参数
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} clueInfoQuery - 查询参数
   *  @param {number} clueInfoQuery.phase - 线索阶段
  (0,默认态),(1,待分配),(2,待跟进),(3,跟进中),(4,已邀约),(5,已试听),(6,已成交),(7,放弃线索)
   *  @param {number} clueInfoQuery.sourceId - 来源id
   *  @param {number} clueInfoQuery.kdtId - 校区kdtId
   *  @param {string} clueInfoQuery.telephone - 电话号码
   *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
   *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
   *  @param {number} clueInfoQuery.ownerId - 跟进人userId
   *  @param {number} clueInfoQuery.deleteReason - 线索删除原因
   *  @param {Object} clueInfoQuery.operator - 操作人
  前端暂未传参
   *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
   *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
   *  @param {string} clueInfoQuery.name - 名称
   *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
   *  @return {Promise}
   */
  async findAllByPageWithCount(kdtId, request, clueInfoQuery) {
    return this.invoke('findAllByPageWithCount', [kdtId, request, clueInfoQuery]);
  }

  /**
    *  公海池列表分页接口
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/824297
    *
    *  @param {number} kdtId - 商家id
    *  @param {Object} request - 分页参数
    *  @param {number} request.pageNumber -
    *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
    *  @param {number} request.pageSize -
    *  @param {Object} request.sort -
    *  @param {Object} clueInfoQuery - 查询参数
    *  @param {number} clueInfoQuery.phase - 线索阶段
(0,默认态),(1,待分配),(2,待跟进),(3,跟进中),(4,已邀约),(5,已试听),(6,已成交),(7,放弃线索)
    *  @param {number} clueInfoQuery.sourceId - 来源id
    *  @param {number} clueInfoQuery.kdtId - 校区kdtId
    *  @param {string} clueInfoQuery.telephone - 电话号码
    *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
    *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
    *  @param {number} clueInfoQuery.ownerId - 跟进人userId
    *  @param {number} clueInfoQuery.deleteReason - 线索删除原因
    *  @param {Object} clueInfoQuery.operator - 操作人
前端暂未传参
    *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
    *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
    *  @param {string} clueInfoQuery.name - 名称
    *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
    *  @return {Promise}
    */
  async findPublicPoolByPageWithCount(kdtId, request, clueInfoQuery) {
    return this.invoke('findPublicPoolByPageWithCount', [kdtId, request, clueInfoQuery]);
  }

  /**
    *  我的线索列表分页接口
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/824298
    *
    *  @param {number} kdtId - 商家id
    *  @param {Object} request - 分页参数
    *  @param {number} request.pageNumber -
    *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
    *  @param {number} request.pageSize -
    *  @param {Object} request.sort -
    *  @param {Object} clueInfoQuery - 查询参数
    *  @param {number} clueInfoQuery.phase - 线索阶段
(0,默认态),(1,待分配),(2,待跟进),(3,跟进中),(4,已邀约),(5,已试听),(6,已成交),(7,放弃线索)
    *  @param {number} clueInfoQuery.sourceId - 来源id
    *  @param {number} clueInfoQuery.kdtId - 校区kdtId
    *  @param {string} clueInfoQuery.telephone - 电话号码
    *  @param {Object} clueInfoQuery.createAtDateRange - 创建时间过滤
    *  @param {Object} clueInfoQuery.revisitDateRange - 回访时间过滤
    *  @param {number} clueInfoQuery.ownerId - 跟进人userId
    *  @param {number} clueInfoQuery.deleteReason - 线索删除原因
    *  @param {Object} clueInfoQuery.operator - 操作人
前端暂未传参
    *  @param {Array.<Array>} clueInfoQuery.tags - 标签id列表搜索
    *  @param {Object} clueInfoQuery.recordDateRange - 更新动态时间过滤
    *  @param {string} clueInfoQuery.name - 名称
    *  @param {string} clueInfoQuery.key - 手机号或者名称搜索，C端搜索使用
    *  @return {Promise}
    */
  async findMyClueByPageWithCount(kdtId, request, clueInfoQuery) {
    return this.invoke('findMyClueByPageWithCount', [kdtId, request, clueInfoQuery]);
  }

  /**
   *  根据kdtId查询所有资料项菜单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/411206
   *
   *  @param {number} kdtId - 商家id
   *  @return {Promise}
   */
  async getAttributeItemsByKdtId(kdtId) {
    return this.invoke('getAttributeItemsByKdtId', [kdtId]);
  }

  /**
   *  查询线索详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/402420
   *
   *  @param {number} kdtId - 商家id
   *  @param {number} clueId - 线索主键id
   *  @return {Promise}
   */
  async getDetailById(kdtId, clueId) {
    return this.invoke('getDetailById', [kdtId, clueId]);
  }

  /**
   *  获取下一条线索详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/413131
   *
   *  @param {number} kdtId - 商家id
   *  @param {number} clueId - 线索主键id(当前线索id)
   *  @return {Promise}
   */
  async getNextDetailById(kdtId, clueId) {
    return this.invoke('getNextDetailById', [kdtId, clueId]);
  }

  /**
   *  查询线索所有资料项键值（用于编辑线索资料项）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/411169
   *
   *  @param {number} kdtId - 商家id
   *  @param {number} clueId - 线索主键id
   *  @return {Promise}
   */
  async getAttributesById(kdtId, clueId) {
    return this.invoke('getAttributesById', [kdtId, clueId]);
  }

  /**
   *  线索资料项更新接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/405950
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {Array.<Object>} command.attributes[] - 线索资料项；清空已有资料项值，attrValue 传空字符串
   *  @param {number} command.clueId - 线索唯一主键id
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  线索回收站搜索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/496389
   *
   *  @param {number} kdtId -
   *  @param {Object} request -
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} recycleBinQuery -
   *  @param {number} recycleBinQuery.phase - 线索阶段 (0,默认态),(1,待分配),(2,待跟进),(3,待邀约),(4,待试听),(5,已试听),(6,已成交),(7,放弃线索),(8,已删除)
   *  @param {number} recycleBinQuery.sourceId - 来源id
   *  @param {Object} recycleBinQuery.recordDateRange - 更新动态时间过滤
   *  @param {number} recycleBinQuery.kdtId - 校区kdtId
   *  @param {string} recycleBinQuery.name - 名称
   *  @param {string} recycleBinQuery.telephone - 电话号码
   *  @param {Object} recycleBinQuery.createAtDateRange - 创建时间过滤
   *  @param {Object} recycleBinQuery.revisitDateRange - 回访时间过滤
   *  @param {number} recycleBinQuery.ownerId - 课程顾问userId
   *  @param {number} recycleBinQuery.deleteReason - 删除原因
   *  @param {string} recycleBinQuery.key - 手机号或者名称搜索，C端搜索使用
   *  @param {Array.<Array>} recycleBinQuery.tags - 标签id列表搜索
   *  @return {Promise}
   */
  async findClueInRecycleBinByPage(kdtId, request, recycleBinQuery) {
    return this.invoke('findClueInRecycleBinByPage', [kdtId, request, recycleBinQuery]);
  }

  /**
   *  查询线索详情【脱敏】
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/745590
   *
   *  @param {number} kdtId - 商家id
   *  @param {number} clueId - 线索主键id
   *  @return {Promise}
   */
  async getDetailByIdForHide(kdtId, clueId) {
    return this.invoke('getDetailByIdForHide', [kdtId, clueId]);
  }
}

module.exports = ClueQueryFacade;
