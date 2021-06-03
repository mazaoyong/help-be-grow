const BaseService = require('../base/BaseService');

class PunchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciCustomerFacade';
  }

  get GCI_CUSTOMER_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciCustomerFacade';
  }

  get GCI_COLUMN_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciColumnFacade';
  }

  get GCI_ORDER_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciOrderFacade';
  }

  // !!!review 重点关注地方MATERIAL_FACADE
  get MATERIAL_FACADE_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.MaterialFacade';
  }

  // 打卡介绍页-获取打卡介绍页详细信息
  async getPunchDetailByAlias(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getGciDetailByKdtIdAlias', query);

    return result;
  }

  // 打卡介绍页-获取打卡介绍页详细信息
  async getIntroDesc(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getGciDescription', query);

    return result;
  }

  // 打卡介绍页-获取专辑的信息
  async getColumn(query) {
    let result = await this.owlInvoke(this.GCI_COLUMN_SERVICE_NAME, 'getColumn', query);

    return result;
  }

  // 打卡介绍页-验证密码
  async postValidatePassword(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'validatePassword', query);

    return result;
  }

  // 打卡介绍页-生成用户
  async generateUser(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'generateUser', query);

    return result;
  }

  // 打卡页-提交打卡数据
  async postAddPunchData(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'gci', query);

    return result;
  }

  // 打卡页-获取录音token
  async uploadMaterialToken(query) {
    let result = await this.owlInvoke(this.MATERIAL_FACADE_SERVICE_NAME, 'generateUploadMaterialToken', query);

    return result;
  }

  // 日历页-页面加载日历和任务详情
  async getCalenderDetail(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getUserGciCalenders', query);

    return result;
  }

  // 排行榜页-获取个人信息
  async getPersonRank(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getPersonRank', query);

    return result;
  }

  // 排行榜页-获取打卡排行榜列表
  async getRankList(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'listRanks', query);

    return result;
  }

  /**
   * 获取全部打卡列表
   */
  async getAllPunchList(query) {
    let result = await this.owlInvoke(this.GCI_CUSTOMER_SERVICE_NAME, 'listGcis', [query]);

    return result;
  }

  /**
   * 获取用户已购列表
   */
  async getBoughtList(query) {
    let list = await this.owlInvoke(this.GCI_ORDER_SERVICE_NAME, 'listPersonOrderHistory', [query]);

    return list;
  }

  /**
   * 获取用户已购列表
   */
  async getFeatureList(query) {
    let list = await this.owlInvoke(this.GCI_CUSTOMER_SERVICE_NAME, 'listGcisMiniAppWym', [query]);

    return list;
  }

  /**
   * 判断专栏是否已关联打卡
   */
  async getSupportPunch(query) {
    let result = await this.owlInvoke(
      this.GCI_COLUMN_SERVICE_NAME,
      'batchGetGciInfoByColumnAlias',
      query
    );

    return result;
  }

  /**
   *  查询专栏详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1004005
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.userId - 用户ID
   *  @param {string} query.columnAlias - 专栏
   *  @return {Promise}
   */
  async getGciInfoByColumnAlias(kdtId, query) {
    return this.owlInvoke(this.GCI_COLUMN_SERVICE_NAME, 'getGciInfoByColumnAlias', [kdtId, query]);
  }
}

module.exports = PunchService;
