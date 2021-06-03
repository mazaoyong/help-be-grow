const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.onlinecourse.LiveVideoFacade -  */
class LiveVideoFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.LiveVideoFacade';
  }

  /**
   *  存储商家验证信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722123
   *
   *  @param {number} kdtId -
   *  @param {Object} polyvAuthCommand -
   *  @param {string} polyvAuthCommand.appSecret -
   *  @param {string} polyvAuthCommand.appId -
   *  @param {string} polyvAuthCommand.userId -
   *  @return {Promise}
   */
  async savePolyvAuth(kdtId, polyvAuthCommand) {
    return this.invoke('savePolyvAuth', [kdtId, polyvAuthCommand]);
  }

  /**
   *  获取商家验证信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722124
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getPolyvAuth(kdtId) {
    return this.invoke('getPolyvAuth', [kdtId]);
  }

  /**
   *  授权信息校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722633
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async polyvCheck(kdtId) {
    return this.invoke('polyvCheck', [kdtId]);
  }

  /**
   *  教师端获取进入直播的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/719009
   *
   *  @param {string} enterQuery - 查询参数
   *  @return {Promise}
   */
  async getLiveEnterInfo(kdtId, enterQuery) {
    return this.invoke('getLiveEnterInfo', [kdtId, enterQuery]);
  }

  /**
   *  获取直接进入直播后台接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722125
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getPolyvBackLink(kdtId, alias) {
    return this.invoke('getPolyvBackLink', [kdtId, alias]);
  }

  /**
   *  查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/724248
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Array} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findPoliyvLives(kdtId, pageRequest) {
    return this.invoke('findPoliyvLives', [kdtId, pageRequest]);
  }

  /**
   *  异步创建直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/725207
   *
   *  @param {number} kdtId -
   *  @param {Object} polyvChannelDTO -
   *  @param {number} polyvChannelDTO.filterCode - 过滤原因 0.不过滤 1.已绑定直播商品 2.大班课
   *  @param {string} polyvChannelDTO.name - scene
   *  @param {string} polyvChannelDTO.channelId - channelId
   *  @param {number} polyvChannelDTO.scene - 1. 三分屏场景  2. 普通场景
   *  @return {Promise}
   */
  async asyncCreatePolyvLive(kdtId, polyvChannelDTO) {
    return this.invoke('asyncCreatePolyvLive', [kdtId, polyvChannelDTO]);
  }

  /**
   *  返回当前直播频道的创建状态 0: 创建中 1: 已创建 2.创建失败
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/725208
   *
   *  @param {number} kdtId -
   *  @param {string} createId -
   *  @return {Promise}
   */
  async getAsyncCreateStatus(kdtId, createId) {
    return this.invoke('getAsyncCreateStatus', [kdtId, createId]);
  }
}

module.exports = LiveVideoFacade;
