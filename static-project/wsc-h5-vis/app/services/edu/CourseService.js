const EduBaseService = require('./EduBaseService');

class CourseService extends EduBaseService {
  get COURSE_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.CourseFacade';
  }

  get COURSE_FACADE_SERVICE_V2() {
    return 'com.youzan.owl.edu.api.course.CourseFacadeV2';
  }

  get STORE_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.StoreFacade';
  }

  get TRADE_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.TradeFacade';
  }

  get COURSE_PRODUCTFACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.CourseProductFacade';
  }

  get COURSE_TRADEFACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.TradeFacade';
  }

  get COURSE_UMPFACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.course.CourseUmpFacade';
  }

  get CLIENT_COURSE_FACADE() {
    return 'com.youzan.owl.api.courseitem.offlinecourse.ClientCourseFacade';
  }

  // 教育培训-课程管理 商品详情页获取详细信息
  // 旧接口 TOCLEAR
  async getCourseDetail(kdtId, dto) {
    const result = await this.owlInvoke(this.COURSE_FACADE_SERVICE_V2, 'getCourseDetail', [kdtId, dto]);
    return result;
  }

  /**
   *  c端获取课程详情页 新接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532006
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.alias - 课程alias
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getCourseDetailV2(kdtId, query) {
    const result = await this.owlInvoke(this.CLIENT_COURSE_FACADE, 'getCourseDetail', [kdtId, query]);
    return result;
  }

  // 推荐商品专用 分页查询商品列表
  async findPageByCondition(kdtId, courseQuery, pageRequest) {
    const result = await this.owlInvoke(this.CLIENT_COURSE_FACADE, 'findPageByCondition', [kdtId, courseQuery, pageRequest]);
    return result;
  }

  // 教育培训-课程管理 商品详情页获取活动信息
  async getActivityByUser(params) {
    const result = await this.owlInvoke(this.COURSE_UMPFACADE_SERVICE, 'listActivityByUser', [params]);

    return result;
  }

  // 教育培训-课程管理 获取地址列表
  async getAddressList(params) {
    const result = await this.owlInvoke(this.STORE_FACADE_SERVICE, 'listStoreForC', [params]);

    return result;
  }

  // 教育培训-课程管理 下单页预下单
  async getPreOrderInfo(params) {
    const result = await this.owlInvoke(this.TRADE_FACADE_SERVICE, 'confirm', [params]);

    return result;
  }

  // 教育培训-课程管理 下单页真正创建订单
  async postOrderConfirm(params) {
    const result = await this.owlInvoke(this.TRADE_FACADE_SERVICE, 'create', [params]);

    return result;
  }

  // TOCLEAR 旧接口 确认没有流量之后可以删除
  async getAllCourseList(query) {
    const result = await this.owlInvoke(this.COURSE_FACADE_SERVICE, 'listCourseForWym', query);
    return result;
  }

  /**
   *  pc端微页面查询课程商品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532038
   *
   *  @param {number} kdtId -
   *  @param {Object} clientCourseWymQuery -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findPageForWym(kdtId, clientCourseWymQuery, pageRequest) {
    return this.owlInvoke(this.CLIENT_COURSE_FACADE, 'findPageForWym', [kdtId, clientCourseWymQuery, pageRequest]);
  }

  /**
   * 获取课程商品列表
   *
   * @param {Object} query search conditons
   * @returns
   * @memberof CourseProductFacadeService
   */
  async getCourseList(query) {
    const result = await this.owlInvoke(this.COURSE_PRODUCTFACADE_SERVICE, 'listCourse', query);
    return result;
  }

  /**
   * 获取支付状态
   *
   * @param {Object} query
   * @returns
   * @memberof CourseService
   */
  async getPayStatement(query) {
    const result = await this.owlInvoke(this.COURSE_TRADEFACADE_SERVICE, 'hasPay', [query]);
    return result;
  }
}

module.exports = CourseService;
