const BaseService = require('../base/BaseService');

/* com.youzan.owl.api.client.edu.coursegroup.CourseGroupFacade -  */
class CourseGroupFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.coursegroup.CourseGroupFacade';
  }

  /**
   *  C端用户 分组下商品分页查询教育产品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440342
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber - ''
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize - ''
   *  @param {Object} pageRequest.sort - ''
   *  @param {Object} itemQuery - 查询条件
   *  @param {number} itemQuery.kdtId - 目标店铺ID,用于区分连锁
   *  @param {string} itemQuery.alias - 课程分组alias alias为空则查询全部商品
   *  @return {Promise}
   */
  async findItemGroupPageForWym(kdtId, pageRequest, itemQuery) {
    return this.invoke('findItemGroupPageForWym', [kdtId, pageRequest, itemQuery]);
  }

  /**
   *  微页面C端查询课程分组的分组详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/441852
   *
   *  @param {string} alias - 分组别名
   *  @return {Promise}
   */
  async getCourseGroupDetailForWym(alias) {
    return this.invoke('getCourseGroupDetailForWym', [alias]);
  }
}

module.exports = CourseGroupFacade;
