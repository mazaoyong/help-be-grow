const BaseService = require('../base/BaseService');

/**
 * 角色相关
 */
class RoleService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.service.v2.RoleService';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/273638
   *
   *  @param {object} criteria - 参数集合
   *  @param {boolean} criteria.withTasteRole -
   *  @param {string} criteria.biz - 业务线id
   *  @param {boolean} criteria.isPhysical - 是否必须是物理关系（主要适配连锁版高级管理员逻辑上属于任何门店员工的场景）
   *  @param {boolean} criteria.withInvisibleRole -
   *  @param {number} criteria.kdtId - 店铺id
   *  @param {number} criteria.pageNo - 分页号
   *  @param {number} criteria.shopTopic -
   *  @param {number} criteria.pageSize - 分页大小
   *  @param {Array.<Array>} criteria.excludeRoles[] -
   *  @return {object}
   */
  async find(criteria) {
    return this.invoke('find', [criteria]);
  }
}

module.exports = RoleService;
