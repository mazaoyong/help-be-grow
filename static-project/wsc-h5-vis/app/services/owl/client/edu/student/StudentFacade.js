const BaseService = require('../../../../base/BaseService');

class StudentFacade extends BaseService {
  /**
   * http://zanapi.qima-inc.com/site/collection/3352
   */
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.student.StudentFacade';
  }

  /**
   *  根据客户id查询关联学员信息列表
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 客户id
   *  @return {Promise}
   */
  async findByCustomerId(kdtId, userId) {
    return this.invoke('findByCustomerId', [kdtId, userId]);
  }

  /**
   *  查询可参与考试的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/903140
   *
   *  @param {number} kdtId -
   *  @param {number} userId -
   *  @param {number} examId -
   *  @return {Promise}
   */
  async findJoinExamStudentsByUserId(kdtId, userId, examId) {
    return this.invoke('findJoinExamStudentsByUserId', [kdtId, userId, examId]);
  }

  /**
   *  根据客户id查询关联学员信息列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357808
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} studentId - 学员id
   *  @return {Promise}
   */
  async getSimpleById(kdtId, studentId, userId) {
    return this.invoke('getSimpleByIdV2', [kdtId, studentId, userId]);
  }

  /**
   *  创建
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建参数
   *  @param {string} command.wechatAccount - 微信号
   *  @param {number} command.fansId - 客户粉丝id
   *  @param {string} command.address - 地址
   *  @param {number} command.gender - 性别「1.男 2.女」
   *  @param {number} command.kdtId - kdtId「必填」
   *  @param {string} command.nickName - 昵称
   *  @param {string} command.mobile - 手机号码
   *  @param {string} command.bornDate - 出生日期「年月日」
   *  @param {string} command.avatar - 头像
   *  @param {number} command.userId - 客户有赞user_id「必填」
   *  @param {string} command.contact - 联系人姓名
   *  @param {string} command.grade - 年级
   *  @param {string} command.name - 学员姓名「必填」
   *  @param {number} command.fansType - 客户粉丝类型
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  更新
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 更新参数
   *  @param {number} command.studentId - 学员id
   *  @param {string} command.wechatAccount - 微信号
   *  @param {string} command.address - 地址
   *  @param {number} command.gender - 性别「1.男 2.女」
   *  @param {number} command.kdtId - kdtId「必填」
   *  @param {string} command.nickName - 昵称
   *  @param {string} command.contact - 联系人姓名
   *  @param {string} command.grade - 年级
   *  @param {string} command.mobile - 手机号码
   *  @param {string} command.bornDate - 出生日期「年月日」
   *  @param {string} command.avatar - 头像
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  根据学员id删除
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} studentId - 根据学员id删除
   *  @return {Promise}
   */
  async delete(kdtId, studentId, userId) {
    return this.invoke('deleteById', [kdtId, studentId, userId]);
  }

  /**
   *  查询关联学员信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/437213
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 学员id
   *  @param {string} query.alias - alias（兼容）
   *  @param {number} query.id - 学员id
   *  @return {Promise}
   */
  async getByQuery(kdtId, query) {
    return this.invoke('getByQuery', [kdtId, query]);
  }

  /**
   *  根据场景查询学员信息，用于B/C端展示，已排序
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484613
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.applicableType - 1：学员报名，2：线索管理
   *  @param {Array.<Array>} query.studentIds[] -
   *  @param {Array} query.studentIds[] -
   *  @return {Promise}
   */
  async findByApplicableScene(kdtId, query) {
    return this.invoke('findByApplicableScene', [kdtId, query]);
  }

  /**
   * 查询当前用户下的所有成员
   * zanAPI文档地址： http://zanapi.qima-inc.com/site/service/view/704717
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} query - 入参数
   * @param {integer} query.size - 查出来的数量
   * @param {integer} query.userId - 用户的id
   * @return {Promise}
   */
  async findSimpleByUserId(kdtId, query) {
    return this.owlInvoke('findSimpleByUserId', [kdtId, query]);
  }
}

module.exports = StudentFacade;
