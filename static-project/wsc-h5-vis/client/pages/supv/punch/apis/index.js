import { ajax } from '@youzan/vis-ui';

const apis = {
  getPointsName(data) { // 获取积分名称
    return ajax({
      url: '/wscuser/membercenter/pointsName.json',
      data,
    });
  },
  getIntroDesc(data) { // 打卡介绍页 - 获取打卡详情
    return ajax({
      url: '/wscvis/supv/punch/getIntroDesc.json',
      data,
    });
  },
  getColumn(data) { // 打卡介绍页 - 获取专栏信息
    return ajax({
      url: '/wscvis/supv/punch/getColumn.json',
      data,
    });
  },
  postValidatePassword(data) { // 打卡介绍页 - 校验打卡密码
    return ajax({
      url: '/wscvis/supv/punch/postValidatePassword.json',
      method: 'POST',
      data,
    });
  },
  generateUser(data) { // 打卡介绍页 - 生成用户
    return ajax({
      url: '/wscvis/supv/punch/generateUser.json',
      method: 'POST',
      data,
    });
  },

  /**
   * 获取打卡详情
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getDiary({
    gciId,
    taskId,
    shareFansId,
    shareFansType,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/getDiary.json',
      method: 'GET',
      data: {
        gciId,
        taskId,
        shareFansId,
        shareFansType,
      },
    });
  },
  /**
   * 获取打卡点赞列表
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getLikeList({
    gciId,
    logId,
    page,
    size,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/getLikeList.json',
      method: 'GET',
      data: {
        gciId,
        logId,
        page,
        size,
      },
      loading: false,
    });
  },
  /**
   * 获取打卡老师评论列表
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getTeacherComments({
    gciLogId,
    taskId,
    page,
    size,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/getTeacherComments.json',
      method: 'GET',
      data: {
        gciLogId,
        taskId,
        page,
        size,
      },
      loading: false,
    });
  },
  /**
   * 获取打卡学生评论列表
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getStudentsComments({
    gciLogId,
    taskId,
    page,
    size,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/getStudentsComments.json',
      method: 'GET',
      data: {
        gciLogId,
        taskId,
        page,
        size,
      },
      loading: false,
    });
  },
  /**
   * 点赞打卡
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  postLike({
    gciLogId,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/postLike.json',
      method: 'GET',
      data: {
        gciLogId,
      },
    });
  },
  /**
   * 取消点赞打卡
   * 使用到的页面：打卡详情页
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  postCancelLike({
    gciLogId,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/postCancelLike.json',
      method: 'GET',
      data: {
        gciLogId,
      },
    });
  },
  /**
   * 回复评论
   * 使用到的页面：打卡详情页，打卡任务详情
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  postComment({
    commentUserType, // 1 学员 2 教师
    comment,
    gciLogId,
    commentId,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/postComment.json',
      method: 'POST',
      data: {
        commentUserType,
        comment,
        gciLogId,
        commentId,
      },
    });
  },
  /**
   * 评论打卡日记，非回复
   * 使用到的页面：打卡详情页，打卡任务详情
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  postCommentOnDiary({
    commentUserType, // 1 学员 2 教师
    comment,
    gciLogId,
  }) {
    return ajax({
      url: '/wscvis/supv/punch/postCommentOnDiary.json',
      method: 'POST',
      data: {
        commentUserType,
        comment,
        gciLogId,
      },
    });
  },
  /**
   * 获取打卡日历信息
   * 使用到的页面：我的打卡 - 打卡日历
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getCalenderDetail({ alias, taskDate }) {
    return ajax({
      url: '/wscvis/supv/punch/getCalenderDetail.json',
      data: {
        alias,
        taskDate,
      },
    });
  },
  /**
   * 根据日期获取打卡任务详情
   * 使用到的页面：我的打卡 - 打卡日历
   *
   * @param {Object} data 参数
   * @return {Promise<Object>}
   */
  getTaskContentByDate({ alias, taskDate }) {
    return ajax({
      url: '/wscvis/supv/punch/getTaskContentByDate.json',
      data: {
        alias,
        taskDate,
      },
    });
  },

  getTaskContent(data) { // 打卡编辑 - 获取任务内容
    return ajax({
      url: '/wscvis/supv/punch/getTaskContent.json',
      data,
    });
  },
  getMyGciLog(data) { // 打卡编辑 - 获取任务数据
    return ajax({
      url: '/wscvis/supv/punch/getMyGciLog.json',
      data,
    });
  },
  postUpdatePunchData(data) { // 打卡介绍页 - 更新打卡
    return ajax({
      url: '/wscvis/supv/punch/postUpdatePunchData.json',
      method: 'POST',
      data,
    });
  },
  postAddPunchData(data) { // 打卡介绍页 - 添加打卡
    return ajax({
      url: '/wscvis/supv/punch/postAddPunchData.json',
      method: 'POST',
      data,
    });
  },

  getCalendarDetail({ alias, taskDate }) {
    return ajax({
      method: 'GET',
      url: '/wscvis/supv/punch/getCalenderDetail.json',
      data: { alias, taskDate },
    });
  },
  getTaskDetail({ taskDate, alias }) {
    return ajax({
      method: 'GET',
      url: '/wscvis/supv/punch/getTaskDetail.json',
      data: {
        taskDate,
        alias,
      },
    });
  },
  getDiaryList(query) {
    return ajax({
      method: 'GET',
      url: '/wscvis/supv/punch/getDiaryList.json',
      data: query,
      loading: false,
    });
  },
  getMyDiaryContent(query) {
    return ajax({
      method: 'GET',
      url: '/wscvis/supv/punch/getMyGciLog.json',
      data: query,
    });
  },

  getShareCardInfo(data) {
    return ajax({
      method: 'GET',
      url: '/wscvis/supv/punch/getShareCardInfo.json',
      data,
      loading: false,
    });
  },

  getSharePoster(data) {
    return ajax({
      method: 'POST',
      url: '/wscvis/supv/punch/getSharePoster.json',
      data,
      loading: false,
    });
  },
};

export default apis;
