const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.questions.QuestionCategoryFacade -  */
class QuestionCategoryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.questions.QuestionCategoryFacade';
  }

  /**
   *  按照条件查询相关的分类列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895498
   *
   *  @param {number} kdtId -
   *  @param {Object} categoryQuery -
   *  @param {number} categoryQuery.parentId - 分类id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, categoryQuery, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, categoryQuery, pageRequest]);
  }

  /**
   *  创建试题库分类
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895494
   *
   *  @param {number} kdtId -
   *  @param {Object} createCommand -
   *  @param {string} createCommand.name - 分类名称
   *  @param {number} createCommand.parentId - 直属父分类id（如果是根节点，此字段传0或不传）
   *  @param {Object} createCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async createCategory(kdtId, createCommand) {
    return this.invoke('createCategory', [kdtId, createCommand]);
  }

  /**
   *  更新试题库分类
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895495
   *
   *  @param {number} kdtId -
   *  @param {Object} updateCommand -
   *  @param {string} updateCommand.name - 分类名称
   *  @param {number} updateCommand.id - 当前分类id
   *  @param {Object} updateCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async updateCategory(kdtId, updateCommand) {
    return this.invoke('updateCategory', [kdtId, updateCommand]);
  }

  /**
   *  删除试题库分类
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895496
   *
   *  @param {number} kdtId -
   *  @param {Object} deleteCommand -
   *  @param {number} deleteCommand.id - 分类id
   *  @param {Object} deleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async deleteCategory(kdtId, deleteCommand) {
    return this.invoke('deleteCategory', [kdtId, deleteCommand]);
  }

  /**
   *  移动试题库分类
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895497
   *
   *  @param {number} kdtId -
   *  @param {Object} deleteCommand -
   *  @param {number} deleteCommand.targetParentId - 目标直属分类id
   *  @param {number} deleteCommand.currentId - 当前分类id
   *  @param {Object} deleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async moveCategory(kdtId, deleteCommand) {
    return this.invoke('moveCategory', [kdtId, deleteCommand]);
  }
}

module.exports = QuestionCategoryFacade;
