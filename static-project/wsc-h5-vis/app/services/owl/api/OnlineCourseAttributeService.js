const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.client.attributeitem.OnlineCourseAttributeFacade -  */
class OnlineCourseAttributeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.attributeitem.OnlineCourseAttributeFacade';
  }

  /**
   *  查询知识付费商品的信息采集配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/673231
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 查询条件
   *  @param {Array.<Array>} query.aliasList[] - 商品别名
   *  @param {Array} query.aliasList[] -
   *  @param {number} query.scene - 信息采集场景类型 1=线上课
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async findProductCollectInfo(kdtId, query) {
    return this.invoke('findProductCollectInfo', [kdtId, query]);
  }

  /**
   * @description 提交信息采集资料项
   * @link http://zanapi.qima-inc.com/site/service/view/1020126
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 查询条件
   *  @param {string} command.mobile - 手机号
   *  @param {number} command.scene - 发送验证码的场景类型(必传) 1:线上课信息采集, 2:好友助力/涨粉海报 3:转介绍活动 4:攒学费活动 5:报名表单
   *  @param {string} command.verifyCode - 验证码(必传)
   */

  async submitAttributes(kdtId, command) {
    return this.invoke('submitAttributes', [kdtId, command]);
  }
}

module.exports = OnlineCourseAttributeFacade;
