const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.examination.ExamTemplateFacade -  */
class ExamTemplateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.examination.ExamTemplateFacade';
  }

  /**
   *  批量获取试卷题目
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902627
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Array} questionIds - 题目id
   *  @return {Promise}
   */
  async findPaperQuestions(kdtId, questionIds) {
    return this.invoke('findPaperQuestions', [kdtId, questionIds]);
  }

  /**
   *  考试模版创建
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897892
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 考试创建command
   *  @param {number} command.fansId - 粉丝id
   *  @param {string} command.nickName - 用户名称
   *  @param {string} command.mobile - 用户手机号
   *  @param {string} command.source - 操作来源
   *  @param {string} command.title - 考试标题
   *  @param {Object} command.courseSetting - 是否开启课程
   *  @param {number} command.userId - 用户id
   *  @param {Object} command.picture - 考试封面图片
   *  @param {number} command.duration - 考试时长
   *  @param {number} command.displayType - 答案展示类型
   *  @param {number} command.publishType - 发布类型
   *  @param {Object} command.examFrequency - 考试频率设置
   *  @param {string} command.clientIp - 客户端ip
   *  @param {Object} command.infoCollectSetting - 信息采集设置
   *  @param {string} command.timerPublishAt - 定时上架时间
   *  @param {string} command.detail - 详情
   *  @param {Object} command.validity - 有效期
   *  @param {number} command.fansType - 粉丝type
   *  @return {Promise}
   */
  async createExamTemplate(kdtId, command) {
    return this.invoke('createExamTemplate', [kdtId, command]);
  }

  /**
   *  考试编辑
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897894
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 考试编辑command
   *  @param {number} command.fansId - 粉丝id
   *  @param {string} command.nickName - 用户名称
   *  @param {string} command.mobile - 用户手机号
   *  @param {string} command.source - 操作来源
   *  @param {string} command.title - 考试标题
   *  @param {Object} command.courseSetting - 是否开启课程
   *  @param {number} command.userId - 用户id
   *  @param {Object} command.picture - 考试封面图片
   *  @param {number} command.duration - 考试时长
   *  @param {number} command.displayType - 答案展示类型
   *  @param {number} command.publishType - 发布类型
   *  @param {Object} command.examFrequency - 考试频率设置
   *  @param {string} command.clientIp - 客户端ip
   *  @param {Object} command.infoCollectSetting - 信息采集设置
   *  @param {string} command.timerPublishAt - 定时上架时间
   *  @param {number} command.id - id
   *  @param {string} command.detail - 详情
   *  @param {Object} command.validity - 有效期
   *  @param {number} command.fansType - 粉丝type
   *  @return {Promise}
   */
  async updateExamTemplate(kdtId, command) {
    return this.invoke('updateExamTemplate', [kdtId, command]);
  }

  /**
   *  考试试卷创建
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897893
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 考试创建command
   *  @param {number} command.examTemplateId - 考试模版id
   *  @param {number} command.fansId - 粉丝id
   *  @param {Array.<Object>} command.examQuestions[] - 考试题目
   *  @param {string} command.nickName - 用户名称
   *  @param {string} command.clientIp - 客户端ip
   *  @param {string} command.mobile - 用户手机号
   *  @param {string} command.source - 操作来源
   *  @param {number} command.userId - 用户id
   *  @param {number} command.fansType - 粉丝type
   *  @return {Promise}
   */
  async createExamPaper(kdtId, command) {
    return this.invoke('createExamPaper', [kdtId, command]);
  }

  /**
   *  获取考试详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902597
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} examTemplateId - 考试模版id
   *  @return {Promise}
   */
  async getExamTemplateDetail(kdtId, examTemplateId) {
    return this.invoke('getExamTemplateDetail', [kdtId, examTemplateId]);
  }

  /**
   *  获取考试最新试卷详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902598
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} examTemplateId - 考试模版id
   *  @return {Promise}
   */
  async getExamPaperDetail(kdtId, examTemplateId) {
    return this.invoke('getExamPaperDetail', [kdtId, examTemplateId]);
  }

  /**
   *  查询考试模版
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897896
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {string} query.title - 考试标题
   *  @param {number} query.status - 考试状态（未发布，已发布，已停用）
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }

  /**
   *  更新考试状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897897
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 考试id
   *  @param {number} command.fansId - 粉丝id
   *  @param {string} command.nickName - 用户名称
   *  @param {string} command.clientIp - 客户端ip
   *  @param {string} command.mobile - 用户手机号
   *  @param {number} command.id - id
   *  @param {string} command.source - 操作来源
   *  @param {number} command.userId - 用户id
   *  @param {number} command.status - 状态
   *  @param {number} command.fansType - 粉丝type
   *  @return {Promise}
   */
  async quickUpdate(kdtId, command) {
    return this.invoke('quickUpdate', [kdtId, command]);
  }

  /**
   *  删除考试
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897898
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 考试id
   *  @param {number} command.fansId - 粉丝id
   *  @param {string} command.nickName - 用户名称
   *  @param {string} command.clientIp - 客户端ip
   *  @param {string} command.mobile - 用户手机号
   *  @param {number} command.id - id
   *  @param {string} command.source - 操作来源
   *  @param {number} command.userId - 用户id
   *  @param {number} command.status - 状态
   *  @param {number} command.fansType - 粉丝type
   *  @return {Promise}
   */
  async delete(kdtId, command) {
    return this.invoke('delete', [kdtId, command]);
  }

  /**
   *  统计考试参加的用户数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/907233
   *
   *  @param {number} kdtId -
   *  @param {number} examTemplateId -
   *  @return {Promise}
   */
  async countJoinUsers(kdtId, examTemplateId) {
    return this.invoke('countJoinUsers', [kdtId, examTemplateId]);
  }
}

module.exports = ExamTemplateFacade;
