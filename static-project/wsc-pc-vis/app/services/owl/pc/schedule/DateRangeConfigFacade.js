const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.schedule.DateRangeConfigFacade -  */
class DateRangeConfigFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.schedule.DateRangeConfigFacade';
  }

  /**
   *  创建
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391006
   *
   *  @param {number} kdtId - 店铺 id
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

  /**
   *  根据kdtId获取时间段列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391009
   *
   *  @param {number} kdtId - 店铺 id
   *  @param {number} configType - 配置类型
   *  @return {Promise}
   */
  async findByKdtId(kdtId, configType) {
    return this.invoke('findByKdtId', [kdtId, configType]);
  }

  /**
   *  更新
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391007
   *
   *  @param {number} kdtId - 店铺 id
   *  @param {Object} command -
   *  @param {string} command.startTime - 开始时间
   *  @param {number} command.id - id
   *  @param {string} command.endTime - 开课前几个小时不能预约
   *  @param {number} command.configType - 配置类型
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391008
   *
   *  @param {number} kdtId - 店铺 id
   *  @param {number} id - 时间段 id
   *  @return {Promise}
   */
  async delete(kdtId, id) {
    return this.invoke('delete', [kdtId, id]);
  }
}

module.exports = DateRangeConfigFacade;
