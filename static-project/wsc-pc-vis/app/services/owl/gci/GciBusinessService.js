// 打卡活动相关接口
const BaseService = require('../../base/BaseService');

class GciBusinessService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciBusinessFacade';
  }

  /**
   * 打卡列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/191190
   * @param {Object} req - 查询列表参数
   * @param {number} req[].kdtId - kdtId
   * @param {string} req[].orderBy - 排序字段
   * @param {string} req[].order - 排序
   * @param {string} req[].title - 打卡名
   * @param {number} req[].page - 页码
   * @param {number} req[].size - 每页大小
   * @return {Promise.<Object>} 返回列表
   */
  async list(req) {
    const result = await this.invoke('listGcis', [req]);
    return result;
  }

  /**
   * 新建打卡
   *
   * @see http://zanapi.qima-inc.com/site/service/view/166667
   * @param {Object} req - 创建参数
   * @returns {Promise.<number>} 打卡 id
   */
  async create(req) {
    const result = await this.invoke('createGci', [req]);
    return result;
  }

  /**
   * 查询打卡详情
   * http://zanapi.qima-inc.com/site/service/view/166669
   *
   * @param {number} kdtId - kdtId
   * @param {string} gciAlias - 打卡别名
   * @return {Promise.<Object>} 打卡详情
   */
  async detail(kdtId, gciAlias) {
    const result = await this.invoke('getGciDetail', [kdtId, gciAlias]);
    return result;
  }

  /**
   * 更新打卡
   * http://zanapi.qima-inc.com/site/service/view/166668
   *
   * @param {Object} req - 更新参数
   * @returns {Promise.<number>} 打卡 id
   */
  async update(req) {
    const result = await this.invoke('updateGci', [req]);
    return result;
  }

  /**
   * 删除打卡
   * http://zanapi.qima-inc.com/site/service/view/173385
   *
   * @param {number} kdtId - kdtId
   * @param {string} gciAlias - 打卡别名
   * @param {Object} operator - 操作人
   * @returns {Promise.<boolean>} - 删除结果，true 表示删除成功
   */
  async delete(req) {
    const result = await this.invoke('deleteGci', req);
    return result;
  }

  /**
   * 上下架
   *
   * @see http://zanapi.qima-inc.com/site/service/view/191192
   * @param {Object} req - 查询打卡参数
   * @param {number} req.kdtId - kdtId
   * @param {string} req.gciAlias - 打卡别名
   * @param {Object} req.operator - 操作人
   * @param {number} req.status - 打卡状态，1：上架，2：下架
   * @return {Promise.<Object>} 打卡详情
   */
  async upOrDown(req) {
    const result = await this.invoke('takeUpOrDownGci', [req]);
    return result;
  }

  /**
   * 获取群打卡简要信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/200890
   * @param {number} kdtId - kdtId
   * @param {string} gciAlias - 打卡别名
   * @return {Promise.<Object>} 打卡简要信息
   */
  async brief(kdtId, gciAlias) {
    const result = await this.invoke('getGciBrief', [kdtId, gciAlias]);
    return result;
  }

  /**
   * 获取群打卡的推广配置
   * http://zanapi.qima-inc.com/site/service/view/191193
   *
   * @param {number} kdtId - kdtId
   * @param {string} gciAlias - 打卡别名
   * @returns {Promise.<Object>} - 推广配置详情
   */
  async getPromotionSetting(kdtId, gciAlias) {
    const result = await this.invoke('getGciPromotionSetting', [kdtId, gciAlias]);
    return result;
  }

  /**
   * 更新群打卡推广配置
   * http://zanapi.qima-inc.com/site/service/view/191194
   *
   * @param {Object} req - 打卡推广数据
   * @returns {Promise.<boolean>} - 更新结果，true 表示成功, false 表示失败
   */
  async updateGciPromotionSetting(req) {
    const result = await this.invoke('updateGciPromotionSetting', [req]);
    return result;
  }

  /**
   * 分页展示打卡每日数据
   * http://zanapi.qima-inc.com/site/service/view/166677
   *
   * @param {*} req - 请求参数
   * @returns {Promise.<Object>} - 每日打卡列表数据
   */
  async listDailyData(req) {
    const result = await this.invoke('listGciDailyData', [req]);
    return result;
  }

  /**
   * 分页展示打卡学员数据
   * http://zanapi.qima-inc.com/site/service/view/191196
   *
   * @param {*} req - 请求参数
   * @returns {Promise.<Object>} - 打卡学员数据
   */
  async listStudentData(req) {
    const result = await this.invoke('listGciStudentData', [req]);
    return result;
  }

  /**
   * 获取群打卡统计信息
   * http://zanapi.qima-inc.com/site/service/view/191195
   *
   * @param {number} kdtId - kdtId
   * @param {string} gciAlias - 打卡别名
   * @returns {Promise.<Object>} - 打卡统计信息
   */
  async getStatistics(kdtId, gciAlias) {
    const result = await this.invoke('getGciStatistics', [kdtId, gciAlias]);
    return result;
  }

  /**
   * 导出打卡数据
   *
   * @see http://zanapi.qima-inc.com/site/service/view/191199
   * @param {Object} req - 导出参数
   * @param {number} req.kdtId - kdtId
   * @param {string} req.gciAlias - 打卡别名
   * @param {number} req.type - 导出类型 2 学员数据 3 每日数据
   * @param {string} req.operatorName - 操作人昵称
   * @param {string} req.operatorMobile - 操作人手机号
   * @returns {Promise.<boolean>} - 导出结果，true 表示成功, false 表示失败
   */
  async export(req) {
    const result = await this.invoke('exportGciData', [req]);
    return result;
  }

  /**
   * PC端微页面配置-查询群打卡列表
   * http://zanapi.qima-inc.com/site/service/view/179158
   *
   * @param {Object} req - 请求参数
   * @param {number} req.kdtId - kdtId
   * @param {string} req.title - 群打卡名称
   * @param {number} req.page - 页码
   * @param {number} req.size - 每页大小
   */
  async listWym(req) {
    const result = await this.invoke('listGcisPCWymSetting', [req]);
    return result;
  }

  async listGcisPCWymSetting(req) {
    if (req.title === '') {
      delete req.title;
    }
    const result = await this.invoke('listGcisPCWymSetting', [req]);
    result.list = result.content;
    return result;
  }
}

module.exports = GciBusinessService;
