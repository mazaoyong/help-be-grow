const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.coursegroup.CourseGroupFacade -  */
class CourseGroupFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.coursegroup.CourseGroupFacade';
  }

  /**
    *  创建课程分组
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440070
    *
    *  @param {number} kdtId - 店铺ID
    *  @param {Object} courseGroupCreateCommand - 创建分组信息的参数
    *  @param {string} courseGroupCreateCommand.data - 自定义组件
    *  @param {number} courseGroupCreateCommand.kdtId - 店铺ID
    *  @param {Object} courseGroupCreateCommand.operator - 操作者信息
    *  @param {string} courseGroupCreateCommand.operator.nickName -
    *  @param {string} courseGroupCreateCommand.operator.clientIp -
    *  @param {string} courseGroupCreateCommand.operator.source -
    *  @param {integer} courseGroupCreateCommand.operator.userId -
    *  @return {Promise}
    */
  async createCourseGroup(kdtId, courseGroupCreateCommand) {
    return this.invoke('createCourseGroup', [kdtId, courseGroupCreateCommand]);
  }

  /**
  *  更新课程分组信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440071
  *
  *  @param {number} kdtId - 店铺ID
  *  @param {Object} courseGroupUpdateCommand - 更新分组信息的参数
  *  @param {string} courseGroupUpdateCommand.data - 自定义组件
    格式参考'商品分组'的请求参数
    eg: [{"type":"config","title":"yyyyyyyyy-01010","show_tag_title":"1","first_priority":"3","second_priority":"0","size":"2","size_type":"0","buy_btn":"1","buy_btn_type":"1","show_title":"0","price":"1","cart":"1","content":"","is_default":0,"hot_tag_order":"","is_global_setting":"1"},{"color":"#fff","content":"","fullscreen":0,"emptyRichtext":"","type":"rich_text"}]
  *  @param {number} courseGroupUpdateCommand.kdtId - 店铺ID
  *  @param {number} courseGroupUpdateCommand.groupId - 商品组id
  *  @param {string} courseGroupUpdateCommand.alias - 短地址
  *  @param {Object} courseGroupUpdateCommand.operator - 操作者信息
  *  @return {Promise}
  */
  async updateCourseGroup(kdtId, courseGroupUpdateCommand) {
    return this.invoke('updateCourseGroup', [kdtId, courseGroupUpdateCommand]);
  }

  /**
   *  查询课程分组的分组详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440078
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} courseGroupQuery - 分组查询条件
   *  @param {number} courseGroupQuery.kdtId - 目标店铺ID,用于区分连锁
   *  @param {number} courseGroupQuery.groupId - 课程商品分组ID
   *  @return {Promise}
   */
  async getCourseGroupDetail(kdtId, courseGroupQuery) {
    return this.invoke('getCourseGroupDetail', [kdtId, courseGroupQuery]);
  }

  /**
   *  分页查询课程分组的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440073
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页查询参数 排序规则: created_time: 创建时间; update_time:更新时间; goods_count:商品数量;
   *  @param {number} pageRequest.pageNumber - -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize - -
   *  @param {Object} pageRequest.sort - -
   *  @param {Object} groupPagedQuery - 查询条件
   *  @param {number} groupPagedQuery.kdtId - 目标店铺ID,用于区分连锁
   *  @param {string} groupPagedQuery.keyword - 分组信息模糊查询
   *  @param {number} groupPagedQuery.type - 是否查询所有分组的标识 如果type=1 查询所有分组；其他情况，不传或者为空或其他的值 需要过滤'最新' '最热' '其他分组'
   *  @return {Promise}
   */
  async listCourseGroup(kdtId, pageRequest, groupPagedQuery) {
    return this.invoke('listCourseGroup', [
      kdtId,
      pageRequest,
      groupPagedQuery,
    ]);
  }
}

module.exports = CourseGroupFacade;
