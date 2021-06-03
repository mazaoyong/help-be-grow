const BaseService = require('../../../base/BaseService');

/** com.youzan.showcase.front.api.service.appcenter.NationalHolidayReadService -  */
class NationalHolidayReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.showcase.front.api.service.appcenter.NationalHolidayReadService';
  }

  /**
   *  按年查询当年所有法定节假日列表,  年份字段必传
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/693744
   *
   *  @param {Object} request -
   *  @param {number} request.year - 过滤条件， 按年筛选 比如，2020
   *  @return {Promise}
   */
  async listAllByYear(request) {
    return this.invoke('listAllByYear', [request]);
  }
}

module.exports = NationalHolidayReadService;
