const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.shop.ShopCourseSettingFacade -  */
class ShopCourseSettingFacade extends BaseService {
  get SHOP_COURSE_SETTING_FACADE() {
    return 'com.youzan.owl.api.shop.ShopCourseSettingFacade';
  }

  /**
   *  查询店铺的所有课程配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400332
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async findCourseSettings(kdtId) {
    const result = await this.owlInvoke(this.SHOP_COURSE_SETTING_FACADE, 'findCourseSettings', [kdtId]);

    return result;
  }
}

module.exports = ShopCourseSettingFacade;
