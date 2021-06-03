const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.shop.ShopCourseSettingFacade -  */
class ShopCourseSettingFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.shop.ShopCourseSettingFacade';
  }

  /**
   *  查询店铺的所有课程配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400332
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async findCourseSettings(kdtId) {
    return this.invoke('findCourseSettings', [kdtId]);
  }

  /**
   *  保存当前的店铺的课程设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400333
   *
   *  @param {number} kdtId -
   *  @param {Array} shopCourseSettingDTOS -
   *  @return {Promise}
   */
  async saveCourseSettings(kdtId, shopCourseSettingDTOS) {
    return this.invoke('saveCourseSettings', [kdtId, shopCourseSettingDTOS]);
  }
}

module.exports = ShopCourseSettingFacade;
