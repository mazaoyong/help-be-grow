const BaseService = require('../../base/BaseService');

/**
 * 店铺能力接口
 */
class AbilityReadService extends BaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @constructor
   */
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopprod.api.service.ability.AbilityReadService';
  }

  /**
   * 查询店铺能力
   * 文档: https://doc.qima-inc.com/pages/viewpage.action?pageId=46094595
   *
   * @param {number} kdtId
   * @param {string} abilityCode
   * @return {Promise<Object>} result
   * @return {number} [result.abilityStatus]
   * @return {boolean} [result.valid]
   */
  async queryShopAbilityInfo(kdtId, abilityCode) {
    return this.invoke('queryShopAbilityInfo', [kdtId, abilityCode]);
  }
}

module.exports = AbilityReadService;
