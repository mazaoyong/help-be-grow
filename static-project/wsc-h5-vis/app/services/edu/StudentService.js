const EduBaseService = require('./EduBaseService');

class StudentService extends EduBaseService {
  get STUDENT_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.student.StudentFacade';
  }

  get STUDENT_COURSE_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.student.StudentCourseFacade';
  }

  // 教育培训-课程管理 获取学员详细信息
  async getStudentDetail(params) {
    const result = await this.invoke(this.STUDENT_FACADE_SERVICE, 'getStudentBaseMessage', [params]);

    return result;
  }

  /**
   * 查询学员
   */
  async queryStudent(params) {
    const res = await this.invoke(this.STUDENT_FACADE_SERVICE, 'getStudentBaseMessage', [params]);
    return res;
  }

  /**
   * 新增学员
   */
  async createStudent(params) {
    const res = await this.invoke(this.STUDENT_FACADE_SERVICE, 'createStudent', [params]);
    return res;
  }

  /**
   * 编辑学员
   */
  async updateStudent(params) {
    const res = await this.invoke(this.STUDENT_FACADE_SERVICE, 'updateStudent', [params]);
    return res;
  }

  /**
   * 删除学员
   */
  async deleteStudent(params) {
    const res = await this.invoke(this.STUDENT_FACADE_SERVICE, 'deleteStudent', [params]);
    return res;
  }

  /**
   * 查询课程
   */
  async queryCourse(params) {
    const { kdtId, customerUserId, pageable } = params;
    const res = await this.invoke(
      this.STUDENT_COURSE_FACADE_SERVICE,
      'findPageAboutPurchasedCourse',
      [
        kdtId,
        customerUserId,
        pageable,
      ]
    );
    return res;
  }
}

module.exports = StudentService;
