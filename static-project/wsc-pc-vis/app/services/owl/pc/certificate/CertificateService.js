const BaseService = require('../../../base/BaseService');

class CertificateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.certificate.CertificateFacadeV2';
  }

  /**
   *  查找证书记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484667
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.sourceId - 证书来源 id
   *  @param {number} query.certType - 证书类型  1 入学证书 2 毕业证书
   *  @param {number} query.sourceType - 证书来源类型 1 线下课
   *  @param {number} query.kdtId - 店铺 id
   *  @param {Array.<Array>} query.certIds[] - 证书 ids
   *  @param {string} query.userName - 用户名称
   *  @param {string} query.title - 证书标题
   *  @param {number} query.popStatus - 证书弹出状态 0 未弹出 1 已弹出
   *  @param {number} query.userId - 学员 id
   *  @param {number} query.status - 证书状态 0 未处理 1 未查看 2 已查看
   *  @return {Promise}
   */
  async find(kdtId, pageRequest, query) {
    return this.invoke('find', [kdtId, pageRequest, query]);
  }
}

module.exports = CertificateService;
