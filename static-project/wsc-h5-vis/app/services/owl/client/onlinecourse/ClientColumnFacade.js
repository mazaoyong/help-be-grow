const BaseService = require('../../../base/BaseService');
/* com.youzan.owl.api.client.onlinecourse.ClientColumnFacade -  */
class ClientColumnFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientColumnFacade';
  }

  /**
   *  C端专栏详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467689
   *
   *  @param {number} kdId -
   *  @param {Object} clientQueryCommand -
   *  @param {string} clientQueryCommand.alias -
   *  @param {number} clientQueryCommand.userId -
   *  @return {Promise}
   */
  async getColumnDetail(kdId, clientQueryCommand) {
    return this.owlInvoke('getColumnDetail', [kdId, clientQueryCommand]);
  }

  /**
   *  C端微页面组件分页查询专栏列表

todo... 和前端确认微页面组件具体用了哪些字段
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467687
*
    *  @param {number} kdtId -
    *  @param {Object} clientQueryCommand -
    *  @param {string=} clientQueryCommand.alias -
    *  @param {number} clientQueryCommand.userId -
    *  @param {Object} pageRequest -
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean=} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object=} pageRequest.sort -
    *  @return {Promise}
    */
  async findPageByKdtIdAndUserId(kdtId, clientQueryCommand, pageRequest) {
    return this.owlInvoke('findPageByKdtIdAndUserId', [
      kdtId,
      clientQueryCommand,
      pageRequest,
    ]);
  }

  /**
   *  已订购专栏列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467688
   *
   *  @param {number} kdtId -
   *  @param {Object} clientQueryCommand -
   *  @param {string=} clientQueryCommand.alias -
   *  @param {number} clientQueryCommand.userId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean=} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object=} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageColumnsByKdtIdAndUserIdSub(
    kdtId,
    clientQueryCommand,
    pageRequest
  ) {
    return this.owlInvoke('findPageColumnsByKdtIdAndUserIdSub', [
      kdtId,
      clientQueryCommand,
      pageRequest,
    ]);
  }
}

module.exports = ClientColumnFacade;
