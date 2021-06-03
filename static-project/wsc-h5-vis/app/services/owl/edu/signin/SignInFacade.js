/* com.youzan.owl.edu.api.signin.SignInFacade -  */
const BaseService = require('../../../base/BaseService');

class SignInFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.signin.SignInFacade';
  }

  /**
   *  学员查询可签到的机构课表或者是学员课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357600
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 用户id，有可能是客户或者是学员
   *  @return {Promise}
   */
  async findStudentLessons(kdtId, userId) {
    return this.owlInvoke('findStudentLessons', [kdtId, userId]);
  }

  /**
  *  进行签到
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347462
   *
  *  @param {number} kdtId - 店铺id
  *  @param {Object} signInCommand - 签到参数
  *  @param {number} signInCommand.signInType - 签到类型
0 到课 1 请假 2 旷课
  *  @param {string} signInCommand.lessonNo - 需要签到的课表编号
  *  @param {boolean} signInCommand.signInAllStudents - 是否为所有学员签到
  *  @param {Array.<Array>} signInCommand.studentIds[] - 需要签到的学员列表
  *  @param {Array} signInCommand.studentIds[] -
  *  @param {number} signInCommand.lessonType - 课表类型 0 机构课表  1 学员课表
  *  @param {number} signInCommand.userId - 签到人id
  *  @return {Promise}
  */
  async signIn(kdtId, signInCommand) {
    return this.owlInvoke('signIn', [kdtId, signInCommand]);
  }

  /**
   *  签到成功后查询学员课程简略信息及已签到次数和剩余课时
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/350105
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 学员课表编号
   *  @return {Promise}
   */
  async getStudentLessonAfterSignIn(kdtId, studentLessonNo) {
    return this.owlInvoke('getStudentLessonAfterSignIn', [kdtId, studentLessonNo]);
  }

  /**
   *  指定资产进行签到
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/476127
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 签到参数
   *  @param {number} command.studentId - 需要签到的学员
   *  @param {string} command.lessonNo - 需要签到的课表编号
   *  @param {Array.<Array>} command.assetNos[] - 签到-指定资产编号集合
   *  @param {Array} command.assetNos[] -
   *  @param {boolean} command.signInAllStudents - 是否为所有学员签到
   *  @param {number} command.lessonType - 课表类型 0 机构课表  1 学员课表
   *  @param {number} command.userId - 签到人id
   *  @return {Promise}
   */
  async signInWithAssets(kdtId, command) {
    return this.owlInvoke('signInWithAssets', [kdtId, command]);
  }
}

module.exports = SignInFacade;
