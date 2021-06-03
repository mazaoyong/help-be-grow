const BaseService = require('../../../base/BaseService');

class CourseGroupService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.coursegroup.CourseGroupFacade';
  }

  /**
  *  分页查询课程分组的信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440073
  *
  *  @param {number} kdtId - 店铺ID
  *  @param {Object} pageRequest - 分页查询参数 排序规则: created_time: 创建时间; update_time:更新时间; goods_count:商品数量;
  *  @param {number} pageRequest.pageNumber -
  *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
  *  @param {number} pageRequest.pageSize -
  *  @param {Object} pageRequest.sort -
  *  @param {Object} groupPagedQuery - 查询条件
  *  @param {number} groupPagedQuery.kdtId - 目标店铺ID,用于区分连锁
  *  @param {string} groupPagedQuery.keyword - 分组信息模糊查询
  *  @param {number} groupPagedQuery.type - 是否查询所有分组的标识
如果type=1 查询所有分组；其他情况，不传或者为空或其他的值 需要过滤'最新' '最热' '其他分组'
  *  @return {Promise}
  */
  async listCourseGroup(kdtId, pageRequest, groupPagedQuery) {
    return this.invoke('listCourseGroup', [
      kdtId,
      pageRequest,
      groupPagedQuery,
    ]);
  }

  /**
   *  删除课程分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/430084
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {number} groupId - 分组ID
   *  @return {Promise}
   */
  async deleteCourseGroup(kdtId, groupId) {
    return this.invoke('deleteCourseGroup', [kdtId, groupId]);
  }

  /**
   *  分组下商品分页搜索接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440076
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页请求  分页查询参数 排序规则: created_time: 创建时间; update_time:更新时间;默认ID
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} itemQuery - 查询条件
   *  @param {number} itemQuery.kdtId - 目标店铺ID,用于区分连锁
   *  @param {number} itemQuery.groupId - 课程分组ID
   *  @param {string} itemQuery.keyword - 知识付费商品模糊搜索
   *  @param {number} itemQuery.type -
   *  @return {Promise}
   */
  async findItemPage(kdtId, pageRequest, itemQuery) {
    return this.invoke('findItemPage', [kdtId, pageRequest, itemQuery]);
  }

  /**
   *  分组添加商品展示所有知识商品以及其对应分组
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440077
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.type - 知识付费，商品类型
   *  @param {string} query.title - 商品名称, 支持模糊匹配
   *  @return {Promise}
   */
  async findAllItemPage(kdtId, pageRequest, query) {
    return this.invoke('findAllItemPage', [kdtId, pageRequest, query]);
  }

  /**
   *  分组批量添加商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440074
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} createMultiItemCommand - 批量添加参数
   *  @param {number} createMultiItemCommand.kdtId - 店铺ID
   *  @param {number} createMultiItemCommand.groupId - 分组Id
   *  @param {Array.<Array>} createMultiItemCommand.itemIds[] - 商品id
   *  @param {Array} createMultiItemCommand.itemIds[] -
   *  @return {Promise}
   */
  async batchCreateMultiItem(kdtId, createMultiItemCommand) {
    return this.invoke('batchCreateMultiItem', [kdtId, createMultiItemCommand]);
  }

  /**
   *  分组下批量移除商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440075
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} deleteMultiItemCommand - 批量移除参数
   *  @param {number} deleteMultiItemCommand.kdtId - 店铺ID
   *  @param {number} deleteMultiItemCommand.groupId - 分组Id
   *  @param {Array.<Array>} deleteMultiItemCommand.itemIds[] - 商品id
   *  @param {Array} deleteMultiItemCommand.itemIds[] -
   *  @return {Promise}
   */
  async batchDeleteMultiItem(kdtId, deleteMultiItemCommand) {
    return this.invoke('batchDeleteMultiItem', [kdtId, deleteMultiItemCommand]);
  }

  /**
   *  批量更新商品的分组信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/452511
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} multiItemCommand - 批量更新的参数
   *  @param {number} multiItemCommand.kdtId - 店铺ID
   *  @param {Object} multiItemCommand.itemIdGroupIds - 商品id与商品分组Id列表,如:{itemId0:[groupId0,...],itemId1:[groupId0,groupId1,...],...}
   *  @return {Promise}
   */
  async batchUpdateItemGroup(kdtId, multiItemCommand) {
    return this.invoke('batchUpdateItemGroup', [kdtId, multiItemCommand]);
  }
};
module.exports = CourseGroupService;
