const BaseService = require('../../../base/BaseService');

/**
 * 出勤数据
 */
class TeachDataFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.data.api.datacenter.TeachDataFacade';
  }

  /**
   *  获取出勤预览
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772196
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @return {Promise}
   */
  async getAttendanceOverview(kdtId, query) {
    return this.invoke('getAttendanceOverview', [kdtId, query]);
  }

  /**
   *  查询上课明细数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772197
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest - pageRequest
      [order]
      direction: DESC(降序)
      ASC(升序)
      property:
      scheduleCnt(上课次数)
      scheduledStuCnt(应到人次)
      signedStuCnt( 已到人次)
      dayOffStuCnt(请假人次)
      absentStuCnt( 未到人次)
      trialStuCnt( 试听人次)
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @param {number} query.dataType - 查询类型 1：店铺 2:课程 3:老师;4:班级
   *  @param {Array.<Array>} query.dataIdList[] - 根据查询类型类定义
      dataType=1 店铺ID
      dataType=2 课程ID
      dataType=3 老师ID
      dataType=4 班级ID
   *  @return {Promise}
   */
  async findAttendClassDetailPage(kdtId, pageRequest, query) {
    return this.invoke('findAttendClassDetailPage', [kdtId, pageRequest, query]);
  }

  /**
   *  导出课程明细
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772198
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @param {number} query.dataType - 查询类型 1：店铺 2:课程 3:老师;4:班级
   *  @param {Array.<Array>} query.dataIdList[] - 根据查询类型类定义
      dataType=1 店铺ID
      dataType=2 课程ID
      dataType=3 老师ID
      dataType=4 班级ID
   *  @return {Promise}
   */
  async exportAttendClassDetail(kdtId, query) {
    return this.invoke('exportAttendClassDetail', [kdtId, query]);
  }

  /**
   *  消课概览
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772199
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @return {Promise}
   */
  async getConsumeClassOverview(kdtId, query) {
    return this.invoke('getConsumeClassOverview', [kdtId, query]);
  }

  /**
   *  查询消课明细数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772197
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest - pageRequest
      [order]
      direction: DESC(降序)
      ASC(升序)
      property:
      scheduleCnt(上课次数)
      scheduledStuCnt(应到人次)
      signedStuCnt( 已到人次)
      dayOffStuCnt(请假人次)
      absentStuCnt( 未到人次)
      trialStuCnt( 试听人次)
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @param {number} query.dataType - 查询类型 1：店铺 2:课程 3:老师;4:班级
   *  @param {Array.<Array>} query.dataIdList[] - 根据查询类型类定义
      dataType=1 店铺ID
      dataType=2 课程ID
      dataType=3 老师ID
      dataType=4 班级ID
   *  @return {Promise}
   */
  async findConsumeClassDetailPage(kdtId, pageRequest, query) {
    return this.invoke('findConsumeClassDetailPage', [kdtId, pageRequest, query]);
  }

  /**
   *  导出消耗课时明细
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772201
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} query - query
   *  @param {Object} query.dateParam - 时间参数
   *  @param {Object} query.kdtParam - 店铺参数
   *  @param {number} query.dataType - 查询类型 1：店铺 2:课程 3:老师;4:班级
   *  @param {Array.<Array>} query.dataIdList[] - 根据查询类型类定义
      dataType=1 店铺ID
      dataType=2 课程ID
      dataType=3 老师ID
      dataType=4 班级ID
   *  @return {Promise}
   */
  async exportConsumeClassDetail(kdtId, query) {
    return this.invoke('exportConsumeClassDetail', [kdtId, query]);
  }
}

module.exports = TeachDataFacade;
