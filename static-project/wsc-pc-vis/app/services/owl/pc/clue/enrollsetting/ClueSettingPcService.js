const BaseService = require('../../../../base/BaseService');

class ClueSettingPcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueSettingPcFacade';
  }

  /**
   *  获取线索设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/416100
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async getClueSetting(kdtId) {
    return this.invoke('getClueSetting', [kdtId]);
  }

  /**
   *  保存线索设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/416101
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 保存实体
   *  @param {number} command.allowCampus - 是否允许校区设置线索重复 1：允许 0：不允许
   *  @param {number} command.auditionSetting - 办理试听配置 0： 只能安排到现有日程（默认） 1： 不受日程限制，直接安排试听时间
   *  @param {Object} command.autoAddClueSetting - 系统自动添加的线索设置
   *  @param {number} command.allowPhoneRepeat - 是否允许录入手机号重复的线索 1：允许 0：不允许
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async saveClueSetting(kdtId, command) {
    return this.invoke('saveClueSetting', [kdtId, command]);
  }

  /**
   *  查询员工列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/404024
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findStaffPage(kdtId, pageRequest) {
    return this.invoke('findStaffPage', [kdtId, pageRequest]);
  }
}

module.exports = ClueSettingPcService;
