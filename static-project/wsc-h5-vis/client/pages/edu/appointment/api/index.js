import { ajax } from '@youzan/vis-ui';

const baseUrl = '/wscvis/edu/appointment';

export default {
  /**
   * 获取预约课程
   *
   * @page 预约列表页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/353168
   * @param {*} data 参数
   */
  getAppointmentList(data) {
    return ajax({
      url: `${baseUrl}/list.json`,
      data,
    });
  },

  /**
   * 获学员信息
   *
   * @page 预约页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/357808
   * @param {*} data 参数
   */
  getStudentInfo(data) {
    return ajax({
      url: `${baseUrl}/studentInfo.json`,
      data,
    });
  },

  /**
   * 获取日历数据
   *
   * @page 预约页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/347451
   * @param {*} data 参数
   */
  getCalendar(data) {
    return ajax({
      url: `${baseUrl}/calendar.json`,
      data,
    });
  },

  /**
   * 查询具体某一天的机构课表及学员已预约的课表，可以通过条件进行筛选
   *
   * @page 预约页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/348519
   * @param {*} data 参数
   */
  getListByDate(data) {
    return ajax({
      url: `${baseUrl}/listByDate.json`,
      data,
    });
  },

  /**
   * 获取日历数据 order
   */
  getCalendarForOrder(data) {
    return ajax({
      url: `${baseUrl}/calendarForOrder.json`,
      data,
    });
  },

  /**
   * 查询具体某一天的机构课表及学员已预约的课表，可以通过条件进行筛选 order
   */
  getListByDateForOrder(data) {
    return ajax({
      url: `${baseUrl}/listByDateForOrder.json`,
      data,
      rawResponse: true,
    });
  },

  /**
   * 创建预约
   *
   * @page 预约页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/347453
   * @param {*} data 参数
   */
  getMakeAppointment(data) {
    return ajax({
      url: `${baseUrl}/create.json`,
      data,
    });
  },

  /**
   * 取消预约
   *
   * @page 预约页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/347454
   * @param {*} data 参数
   */
  getCancelAppointment(data) {
    return ajax({
      url: `${baseUrl}/cancel.json`,
      data,
    });
  },

  /**
   * 预约信息
   *
   * @page 预约结果页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/351395
   * @param {*} data 参数
   */
  getInfo(data) {
    return ajax({
      url: `${baseUrl}/info.json`,
      data,
    });
  },

  /**
   * 查询预约详情
   *
   * @page 预约详情页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/347450
   * @param {*} data 参数
   */
  getDetail(data) {
    return ajax({
      url: `${baseUrl}/detail.json`,
      data,
    });
  },

  /**
   * 查询预约记录
   *
   * @page 预约记录页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/348516
   * @param {*} data 参数
   */
  getRecordList(data) {
    return ajax({
      url: `${baseUrl}/recordList.json`,
      data,
    });
  },

  /**
   * 查询是否可预约 来源是下单时
   */
  canTradeWithLessonAppointmentInfo(data) {
    return ajax({
      url: `${baseUrl}/canTradeWithLessonAppointmentInfo.json`,
      data,
      rawResponse: true,
    });
  },

  findPageByCondition(data) {
    return ajax({
      url: `${baseUrl}/findPageByCondition.json`,
      data,
      loading: false,
    });
  },

  /**
   * 用户合约时间冲突检测
   *
   * @page 预约记录页
   * @dubbo http://zanapi.qima-inc.com/site/service/view/496414
   * @param {*} data 参数
   */
  detectConflict(data) {
    return ajax({
      url: `${baseUrl}/conflict.json`,
      data,
    });
  },

  /**
   * 获取上课地点列表
   */
  getAddressList() {
    return ajax({
      url: `${baseUrl}/getAddressList.json`,
    });
  },

  /**
   * 获取老师列表
   */
  getTeacherList() {
    return ajax({
      url: `${baseUrl}/getTeacherList.json`,
    });
  },

  // 创建预约
  createStudentLessonV2(data) {
    return ajax({
      url: '/wscvis/edu-admin/appointment/createStudentLessonV2.json',
      type: 'post',
      data,
    });
  },

  // 查询被冻结信息
  findLockedPage(data) {
    return ajax({
      url: '/wscvis/edu-admin/appointment/findLockedPage.json',
      data,
    });
  },

  // 从冻结数据中移除
  batchCancel(data) {
    return ajax({
      url: '/wscvis/edu-admin/appointment/batchCancel.json',
      type: 'post',
      data,
    });
  },
};
