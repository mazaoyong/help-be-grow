const BaseService = require('../base/BaseService');

/** com.youzan.retail.peripheral.api.service.PeripheralApi */
class PeripheralApi extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.peripheral.api.service.PeripheralApi';
  }

  /**
   * @description 获取零售相关外设列表
   *
   * @param {Object} data - 入参
   * @param {number} data.adminId              - 操作人id
   * @param {number} data.equipmentTypeId      - 外设类型      1001001 - Printer 365 / 1002001 - 大华-TM-A
   * @param {number} data.kdtId                - 店铺ID
   * @param {number} data.pageNo               - 分页号
   * @param {number} data.pageSize             - 分页大小
   * @param {number} data.peripheralTypeId     - 外设类型      1001 - 价签打印机 / 1002 - 条码称
   * @param {string} data.retailSource         - 请求来源,系统名称或前端终端(替代source)
   * @param {number} data.status               - 设备状态      0 - 断开链接 / 1 - 已连接 / 2 - 超时
   * @param {string} data.source               - 请求来源,系统名称或前端终端。
   *
   * @return {Promise.<Object>}
   *
   * @doc: http://zanapi.qima-inc.com/site/service/view/52153
   */
  async queryPage(data) {
    return this.invoke('queryPage', [data]);
  }
}

module.exports = PeripheralApi;
