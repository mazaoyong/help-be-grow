const BaseService = require('../base/BaseService');
/**
 * 小测试详情以及结果
 */
class PosterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.exam.ExamFacade';
  }

  /**
   *  获取测试列表
   *
   *  @param {Object} query - 测试的查询信息
   *  @param {Object} page - 分页信息
   *  @return {Object}
   */
  async listExamByQuery(query, page) {
    return this.invoke('listExamByQuery', [query, page]);
  }

  /**
   *  获取测试的详情
   *
   *  @param {Object} item - id不可为空
   *  @return {Object}
   */
  async getExamDetail(item) {
    return this.invoke('getExamDetail', [item]);
  }

  /**
   *  保存测试：测试存在则更新，不存在则新建
   *
   *  @param {Object} createDTO - 创建测试的参数
   *  @return {Object}
   */
  async saveExam(createDTO) {
    return this.invoke('saveExam', [createDTO]);
  }

  /**
    *  修改测试信息
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/261504
    *
    *  @param {Object} item - 待更新的测试信息
    *  @param {string} item.summary - 简介
    *  @param {Object} item.nextQuestionMenuPic - 下一题的按钮图片
    *  @param {number} item.kdtId - 店铺的id
    *  @param {Array.<Object>} item.campusKdtIds[] - 选中的校区集合
    *  @param {Object} item.startMenuPic - 开始测试按钮图片
    *  @param {string} item.title - 标题
    *  @param {number} item.endAt - 结束时间
    *  @param {Object} item.questionBackgroundPic - 问题统一背景
    *  @param {number} item.mode - 测试的模式:1:从多个选项中选择正确答案,2:从多个选项中选择匹配程度
    *  @param {number} item.style - 测试的样式:1:固定模版,2:自定义
    *  @param {number} item.id - 测试id
    *  @param {Object} item.coverPic - 封面
    *  @param {number} item.isAllCampus - 是否选中所有店铺适用，枚举值: (0,部分校区适用)，(1,全部校区)
    *  @param {Object} item.backgroundPic - 详情背景
    *  @param {number} item.startAt - 开始时间
    *  @param {number} item.status - 状态:0:草稿,1:可用,2:转码/审核中,3:转码/审核失败
    *  @return {Promise}
    */
  async updateExam(item) {
    return this.invoke('updateExam', [item]);
  }

  /**
   *  激活测试(新建的测试是未激活的状态)
   *
   *  @param {Object} item - 测试信息, id不可为空
   *  @param {Object} shareDTO - 测试分享的设置
   *  @return {Object}
   */
  async activateExam(item, shareDTO) {
    return this.invoke('activateExam', [item, shareDTO]);
  }

  /**
   *  使测试失效
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/173377
   *
   *  @param {Object} item - id不可为空
   *  @param {number} item.kdtId - 店铺id
   *  @param {number} item.id - 测试的id
   *  @return {Object}
   */
  async disabledExam(item) {
    return this.invoke('disabledExam', [item]);
  }

  /**
   *  保存测试：测试存在则更新，不存在则新建
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/470271
   *
   *  @param {Object} command - 复制测试的参数
   *  @param {number} command.kdtId -
   *  @param {number} command.examId -
   *  @return {Promise}
   */
  async copy(command) {
    return this.invoke('copy', [command]);
  }

  /**
   *  删除测试
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/160748
   *
   *  @param {Object} item - id不可为空
   *  @param {number} item.kdtId - 店铺id
   *  @param {number} item.id - 测试的id
   *  @return {Object}
   */
  async delete(item) {
    return this.invoke('delete', [item]);
  }

  /**
   *  获取趣味测试公众号二维码链接
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/464992
   *
   *  @param {number} kdtId -
   *  @param {number} examId -
   *  @return {Promise}
   */
  async getExamMpQrCode(kdtId, examId) {
    return this.invoke('getExamMpQrCode', [kdtId, examId]);
  }
}

module.exports = PosterService;
