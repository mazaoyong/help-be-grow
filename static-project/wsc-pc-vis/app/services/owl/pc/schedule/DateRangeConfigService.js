const BaseService = require('../../../base/BaseService');

/**
 * 课表
 */
class DateRangeConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.schedule.DateRangeConfigFacade';
  }

  /**
   *  根据kdtId获取
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391009
   *
   *  @param {number} kdtId -
   *  @param {number} configType -
   *  @return {Promise}
   */
  async findByKdtId(kdtId, configType = 1) {
    return this.invoke('findByKdtId', [kdtId, configType]);
  }

  /**
   *  创建
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391006
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.startTime - 开始时间
   *  @param {number} command.id - id
   *  @param {string} command.endTime - 开课前几个小时不能预约
   *  @param {number} command.configType - 配置类型
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }
}

module.exports = DateRangeConfigService;
