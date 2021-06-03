const BaseService = require('../base/BaseService');

class DiaryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciLogFacade';
  }

  get PRAISE_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.PraiseFacade';
  }

  get COMMENT_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.CommentFacade';
  }

  /**
   * 获取打卡日记列表
   * @param {Object} query
   */
  async getDiaryList(query) {
    let list = await this.owlInvoke(this.SERVICE_NAME, 'listGciLogs', [query]);

    return list;
  }

  /**
   * 获取单篇打卡日记
   */
  async getDiary(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getMyGciLogWithComments', [query]);

    return result;
  }

  async postDiary(query) {
    let list = await this.owlInvoke(this.SERVICE_NAME, 'listGciLogs', query);

    return list;
  }

  async getTeacherComments(query) {
    let list = await this.owlInvoke(this.COMMENT_SERVICE_NAME, 'listTeacherComments', [query]);

    return list;
  }

  async postComment(query) {
    let rst = await this.owlInvoke(this.COMMENT_SERVICE_NAME, 'commentEachOther', [query]);

    return rst;
  }

  async postCommentOnDiary(query) {
    let rst = await this.owlInvoke(this.COMMENT_SERVICE_NAME, 'commentLog', [query]);

    return rst;
  }

  async getStudentsComments(query) {
    let list = await this.owlInvoke(this.COMMENT_SERVICE_NAME, 'listStudentComments', [query]);

    return list;
  }

  async deleteComment(query) {
    let list = await this.owlInvoke(this.COMMENT_SERVICE_NAME, 'deleteComment', [query]);

    return list;
  }

  /**
   * 分页获取点赞列表
   */
  async getPraiseList(query) {
    let list = await this.owlInvoke(this.PRAISE_SERVICE_NAME, 'listPraises', [query]);

    return list;
  }

  /**
   * 学员点赞
   */
  async postPraise(query) {
    let list = await this.owlInvoke(this.PRAISE_SERVICE_NAME, 'praise', [query]);

    return list;
  }

  /**
   * 学员取消点赞
   */
  async postUnPraise(query) {
    let list = await this.owlInvoke(this.PRAISE_SERVICE_NAME, 'unPraise', [query]);

    return list;
  }

  // 查询我的群打卡日记详情
  async getMyGciLog(query) {
    let list = await this.owlInvoke(this.SERVICE_NAME, 'getMyGciLog', query);

    return list;
  }

  // 打卡页-提交打卡数据
  async postUpdatePunchData(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'updateUserGciLog', query);

    return result;
  }
}

module.exports = DiaryService;
