const BaseService = require('../../../base/BaseService');

class TuitionPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.tuition.TuitionPCFacade';
  }

  /**
   * @description 失效攒学费活动
   * @link http://zanapi.qima-inc.com/site/service/view/941753
   */
  async invalid(kdtId, id) {
    return this.invoke('invalid', [kdtId, id]);
  }

  /**
   * @description 删除攒学费活动
   * @link http://zanapi.qima-inc.com/site/service/view/941754
   */
  async delete(kdtId, id) {
    return this.invoke('delete', [kdtId, id]);
  }

  /**
   * @description 活动详情查询(B端)
   * @link http://zanapi.qima-inc.com/site/service/view/941751
   */
  async getDetailById(kdtId, id) {
    return this.invoke('getDetailById', [kdtId, id]);
  }

  /**
   * @description 活动数据查询活动概况
   * @link http://zanapi.qima-inc.com/site/service/view/941756
   */
  async getBrief(kdtId, activityId) {
    return this.invoke('getBrief', [kdtId, activityId]);
  }

  /**
   * @description 编辑攒学费活动
   * @link http://zanapi.qima-inc.com/site/service/view/941750
   */
  async edit(kdtId, command) {
    return this.invoke('edit', [kdtId, command]);
  }

  /**
   * @description 创建攒学费活动
   * @link http://zanapi.qima-inc.com/site/service/view/941749
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   * @description 活动数据查看裂变效果排行
   * @link http://zanapi.qima-inc.com/site/service/view/941757
   */
  async getRankList(kdtId, pageRequest, query) {
    return this.invoke('getRankList', [kdtId, pageRequest, query]);
  }

  /**
   * @description 活动列表查询
   * @link http://zanapi.qima-inc.com/site/service/view/941755
   */
  async findByPage(kdtId, pageRequest, query) {
    return this.invoke('findByPage', [kdtId, pageRequest, query]);
  }

  /**
   * @description 活动数据参与人明细查看
   * @link http://zanapi.qima-inc.com/site/service/view/941758
   */
  async getRewardList(kdtId, pageRequest, query) {
    return this.invoke('getRewardList', [kdtId, pageRequest, query]);
  }

  /**
   * @description 活动裂变效果数据导出
   * @link http://zanapi.qima-inc.com/site/service/view/944661
   */
  async exportRewardList(kdtId, query) {
    return this.invoke('exportRewardList', [kdtId, query]);
  }
};

module.exports = TuitionPCFacade;
