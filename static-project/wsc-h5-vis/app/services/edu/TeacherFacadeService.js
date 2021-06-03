const EduBaseService = require('./EduBaseService');

class TeacherFacadeService extends EduBaseService {
  get COURSER_TEACHERFACADE_SERVICES() {
    return 'com.youzan.owl.edu.api.course.TeacherFacade';
  }

  // 获取教师信息
  async getTeacherInfo(payload) {
    const result = await this.invoke(this.COURSER_TEACHERFACADE_SERVICES, 'listTeacher', [payload]);

    return result;
  }

  // 根据id获取教师的课程列表
  async listCourseByTeacherId(payload) {
    const result = await this.invoke(this.COURSER_TEACHERFACADE_SERVICES, 'listCourseByTeacherId', payload);

    return result;
  }

  /**
   * 查询某个店铺下的老师信息列表，带分页
   * 接口文档：http://zanapi.qima-inc.com/site/service/view/278209
   *
   * @param {Object} requestDTO 请求参数
   * @param {Object} pageRequest 分页信息
   */
  async listTeacherForWym(requestDTO, pageRequest) {
    const res = await this.invoke(this.COURSER_TEACHERFACADE_SERVICES, 'listTeacherForWym', [requestDTO, pageRequest]);
    return res;
  }
}

module.exports = TeacherFacadeService;
