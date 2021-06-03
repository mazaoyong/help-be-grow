const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.holiday.CustomHolidayFacade -  */
class CustomHolidayFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.holiday.CustomHolidayFacade';
  }

  /**
   *  创建自定义节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702059
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 创建命令
   *  @param {string} command.name - 节假日名称 （0-15个字符）
   *  @param {string} command.startTime - 节假日开始时间 （不小于当前时间）
   *  @param {string} command.endTime - 节假日结束时间 （需大于开始时间）
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  修改自定义节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702060
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 修改命令
   *  @param {string} command.name - 节假日名称
   *  @param {string} command.startTime - 节假日开始时间
   *  @param {string} command.endTime - 节假日结束时间
   *  @param {number} command.holidayId - 节假日id
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  删除自定义节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702061
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {number} holidayId - 节假日id
   *  @return {Promise}
   */
  async delete(kdtId, holidayId) {
    return this.invoke('delete', [kdtId, holidayId]);
  }

  /**
   *  根据ID查询节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702062
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {number} holidayId - 节假日id
   *  @return {Promise}
   */
  async getById(kdtId, holidayId) {
    return this.invoke('getById', [kdtId, holidayId]);
  }

  /**
   *  分页查询节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702063
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 总部查询指定校区(或总部)店铺id,为空查询所有
   *  @param {string} query.name - 节假日名称
   *  @param {number} query.campusQueryMode - 校区查询模式： NULL or 0 -> 总部+校区，1 -> 总部， 2 -> 校区
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }

  /**
   *  查询节假日
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/702064
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 总部查询指定校区(或总部)店铺id,为空查询所有
   *  @param {string} query.name - 节假日名称
   *  @param {number} query.campusQueryMode - 校区查询模式： NULL or 0 -> 总部+校区，1 -> 总部， 2 -> 校区
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async find(kdtId, query) {
    return this.invoke('find', [kdtId, query]);
  }
}

module.exports = CustomHolidayFacade;
