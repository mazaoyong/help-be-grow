const EduBaseService = require('./EduBaseService');

class StudentFacadeService extends EduBaseService {
  get COURSER_STUDENTFACADE_SERVICES() {
    return 'com.youzan.owl.edu.api.student.StudentFacade';
  }

  // 获取学员列表信息
  async getStudentList(payload) {
    const res = await this.invoke(this.COURSER_STUDENTFACADE_SERVICES, 'getCustomerStudentList', [payload]);
    return res;
  }

  async getRecentOrderStudentByCustomer(kdtId, customerId) {
    const res = await this.invoke(
      this.COURSER_STUDENTFACADE_SERVICES,
      'getRecentOrderStudentByCustomer',
      [kdtId, customerId]
    );

    return res;
  }
}

module.exports = StudentFacadeService;
