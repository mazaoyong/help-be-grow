import { ajax } from '@youzan/vis-ui';

const baseUrl = '/wscvis/edu/student';

export default {
  /**
   * 查询学员列表
   *
   * @page 学习记录页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/351531
   * @param {*} data 参数
   */
  getStudentList(data) {
    return ajax({
      url: `${baseUrl}/studentList.json`,
      data,
    });
  },

  /**
   * 查询某个学员所有上课记录
   *
   * @page 学习记录页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/357627
   * @param {*} data 参数
   */
  getStudyRecords(data) {
    return ajax({
      url: `${baseUrl}/studyRecords.json`,
      data,
    });
  },
};
