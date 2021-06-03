const BaseService = require('../../../base/BaseService');

/** com.youzan.pay.unified.cert.api.unified.qualification.UnifiedQualificationCertQueryService */
class UnifiedQualificationCertQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.pay.unified.cert.api.unified.qualification.UnifiedQualificationCertQueryService';
  }

  /**
   * 统一有效资质状态查询
   * @link http://zanapi.qima-inc.com/site/service/view/900036
   * @param {Object} request -
   * @param {string} request.sourceId - 数据id
   * @param {Object} request.sourceIdType - 数据类型
   * @return {Promise}
   */
  async queryUnitedQualStatus(request) {
    return this.invoke('queryUnitedQualStatus', [request]);
  }
}

module.exports = UnifiedQualificationCertQueryService;
