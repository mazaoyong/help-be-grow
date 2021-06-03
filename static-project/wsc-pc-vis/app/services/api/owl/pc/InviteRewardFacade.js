const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.ump.invitereward.InviteRewardFacade -  */
class InviteRewardFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.invitereward.InviteRewardFacade';
  }

  /**
   *  创建教育转介绍活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836028
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建转介绍活动请求
   *  @param {Object} command.introductionInfo -
   *  @param {Object} command.introductionInfo.ruleSetting - 活动规则设置
   *  @param {number} command.introductionInfo.id - 活动id
   *  @param {Object} command.introductionInfo.newStudentPageSetting - 新学员活动页面设置
   *  @param {Object} command.introductionInfo.baseInfoSetting - 活动基本信息设置
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  校验时间范围内是否存在活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836029
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {Object} command - 检查时间范围请求
   *  @param {number} command.endAt - 活动结束时间
   *  @param {number} command.startAt - 活动开始时间
   *  @return {Promise}
   */
  async checkTimeRange(kdtId, command) {
    return this.invoke('checkTimeRange', [kdtId, command]);
  }

  /**
   *  编辑教育转介绍活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836030
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 编辑转介绍活动请求
   *  @param {Object} command.introductionInfo -
   *  @param {Object} command.introductionInfo.ruleSetting - 活动规则设置
   *  @param {number} command.introductionInfo.id - 活动id
   *  @param {Object} command.introductionInfo.newStudentPageSetting - 新学员活动页面设置
   *  @param {Object} command.introductionInfo.baseInfoSetting - 活动基本信息设置
   *  @return {Promise}
   */
  async edit(kdtId, command) {
    return this.invoke('edit', [kdtId, command]);
  }

  /**
   *  转介绍活动列表查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/883889
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询列表请求
   *  @param {string} query.name - 活动名称, 精确匹配
   *  @param {number} query.status - 活动状态 -1全部, 0未开始，1进行中，2已结束，3已失效
   *  @return {Promise}
   */
  async findByPage(kdtId, pageRequest, query) {
    return this.invoke('findByPage', [kdtId, pageRequest, query]);
  }

  /**
   *  转介绍活动详情查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836032
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询详情请求
   *  @param {number} query.id - 活动id
   *  @return {Promise}
   */
  async getDetail(kdtId, query) {
    return this.invoke('getDetail', [kdtId, query]);
  }

  /**
   *  失效教育转介绍活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836033
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 失效转介绍活动请求
   *  @param {number} command.id - 活动id
   *  @return {Promise}
   */
  async invalid(kdtId, command) {
    return this.invoke('invalid', [kdtId, command]);
  }

  /**
   *  删除教育转介绍活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836034
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 删除转介绍活动请求
   *  @param {number} command.id - 活动id
   *  @return {Promise}
   */
  async delete(kdtId, command) {
    return this.invoke('delete', [kdtId, command]);
  }

  /**
   *  查询转介绍活动效果数据(活动维度)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836035
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询请求
   *  @param {number} query.introductionId - 转介绍活动id
   *  @param {string} query.oldStudentName - 老学员姓名
   *  @return {Promise}
   */
  async findPromotionList(kdtId, pageRequest, query) {
    return this.invoke('findPromotionList', [kdtId, pageRequest, query]);
  }

  /**
   *  查询转介绍活动新学员效果数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/883894
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询请求
   *  @param {number} query.newStudentStatus - 新学员跟进状态
   *  @param {number} query.activityId - 活动id
   *  @param {string} query.newStudentName - 新学员姓名, 精确匹配
   *  @param {string} query.newPhoneNo - 新学员手机号
   *  @param {string} query.oldStudentName - 介绍人姓名
   *  @return {Promise}
   */
  async findNewStudentList(kdtId, pageRequest, query) {
    return this.invoke('findNewStudentList', [kdtId, pageRequest, query]);
  }

  /**
   *  导出新学员数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/904636
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询
   *  @param {number} query.newStudentStatus - 新学员跟进状态
   *  @param {number} query.activityId - 活动id
   *  @param {string} query.introduceEndTime - 介绍结束时间
   *  @param {string} query.newStudentName - 新学员姓名, 精确匹配
   *  @param {string} query.newPhoneNo - 新学员手机号
   *  @param {string} query.introduceStartTime - 介绍开始时间
   *  @param {string} query.operatorName - 操作人姓名
   *  @param {string} query.oldStudentName - 介绍人姓名
   *  @param {string} query.operatorMobile - 操作人手机号
   *  @return {Promise}
   */
  async exportNewStudentData(kdtId, query) {
    return this.invoke('exportNewStudentData', [kdtId, query]);
  }

  /**
   * 活动数据统计
   * zanApi文档地址  http://zanapi.qima-inc.com/site/service/view/1040793
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询
   *  @param {number} query.id - 活动id
   */

  async getSummary(kdtId, query) {
    return this.invoke('getSummary', [kdtId, query]);
  }
}

module.exports = InviteRewardFacade;
