const BaseService = require('../../../base/BaseService');

/**
 * 买赠相关接口
 */
class BuyGiveFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.buygive.BuyGiveFacade';
  }

  /**
   * 分页查询知识付费买赠信息的列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/291551
   * @param {*} kdtId
   * @param {*} zanQuery
   * @param {*} pageRequest
   * @return {dubboRequest}
   * @memberof BuyGiveFacadeService
   */
  async getLists(kdtId, zanQuery, pageRequest) {
    const result = await this.invoke('findPageByCondition', [kdtId, zanQuery, pageRequest]);
    return result;
  }

  /**
   * 创建买赠活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/291549
   * @param {*} kdtId
   * @param {*} saveBuyGiveActivityDTO
   * @return {dubboRequest}
   * @memberof BuyGiveFacadeService
   */
  async create(kdtId, saveBuyGiveActivityDTO) {
    const result = await this.invoke('create', [kdtId, saveBuyGiveActivityDTO]);
    return result;
  }

  /**
   * 根据id查询买赠服务
   *
   * @see http://zanapi.qima-inc.com/site/service/view/263872
   * @param {*} kdtId
   * @param {*} id
   * @return {dubboRequest}
   * @memberof BuyGiveFacadeService
   */
  async getDetail(kdtId, id) {
    const result = await this.invoke('getDetailById', [kdtId, id]);
    return result;
  }

  /**
   * 编辑买赠活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/291550
   * @param {*} kdtId
   * @param {*} editBuyGiveActivityDTO
   * @return {dubboRequest}
   * @memberof BuyGiveFacadeService
   */
  async update(kdtId, editBuyGiveActivityDTO) {
    const result = await this.invoke('update', [kdtId, editBuyGiveActivityDTO]);
    return result;
  }

  /**
   * 根据id删除活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/263873
   * @param {*} kdtId
   * @param {*} id
   * @return {dubboRequest}
   * @memberof BuyGiveFacadeService
   */
  async delete(kdtId, id) {
    const result = await this.invoke('deleteById', [kdtId, id]);
    return result;
  }
}

module.exports = BuyGiveFacadeService;
