
const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.clue.ClueExportFacade */
class ClueExportFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.ClueExportFacade';
  }

  /**
     * 线索导出的
     *  场景：
     *    全部线索、公海池中的线索导出
     *
     * @see http://zanapi.qima-inc.com/site/service/view/981425
     * @param {number} kdtId -
     * @param {Object} query -
     * @param {number} query.sourceId - 来源id
     * @param {Object} query.recordDateRange - 更新动态时间过滤
     * @param {number} query.kdtId - 店铺id
     *  连锁场景下是校区的店铺id，也可以是总部的id
     *  单校区可以为空
     * @param {string} query.name - 名称
     * @param {string} query.telephone - 电话号码
     * @param {Object} query.createAtDateRange - 创建时间过滤
     * @param {Object} query.revisitDateRange - 回访时间过滤
     * @param {number} query.ownerId - 课程顾问（跟进人）userId,
     * @param {number} query.type - 线索的类型，全部线索，还是公海池
     * @param {Object} query.operator - 操作人，必传
     * @param {Array} query.tags - 标签id列表搜索
     * @return {Promise}
     */
  async exportClue(kdtId, query) {
    return this.invoke('exportClue', [kdtId, query]);
  }

  /**
     * 获取校区是否能够"线索导出"的配置
     *  场景：
     *    连锁场景：总部返回true，校区需要查询配置
     *    单店：返回true
     *
     * @link http://zanapi.qima-inc.com/site/service/view/983729
     * @param {number} kdtId -
     * @return {Promise}
     */
  async getClueExportConfig(kdtId) {
    return this.invoke('getClueExportConfig', [kdtId]);
  }
}

module.exports = ClueExportFacade;
