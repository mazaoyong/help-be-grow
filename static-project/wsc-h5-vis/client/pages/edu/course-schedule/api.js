import { ajax } from '@youzan/vis-ui';

const baseUrl = '/wscvis/edu/course-schedule';

export default {
  /**
   * 获取日历数据
   *
   * @page 我的课表页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/351532
   * @param {*} data 参数
   */
  getCalendarData(data) {
    return ajax({
      url: `${baseUrl}/calendarData.json`,
      data,
    });
  },

  /**
   * 查询学员某天的课程
   *
   * @page 我的课表页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/357964
   * @param {*} data 参数
   */
  getLessonsByDate(data) {
    return ajax({
      url: `${baseUrl}/lessonsByDate.json`,
      data,
    });
  },

  // 获取当前用户关联的学员列表
  getStudentWidthCurrentUser(data = {}) {
    return ajax({
      url: '/wscvis/edu/student/findByCustomerId.json',
      data,
    });
  },
};
