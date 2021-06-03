const BaseController = require('../../base/BaseController');
const TeacherFacade = require('../../../services/owl/pc/teacher/TeacherManagementFacade');

class TeachersController extends BaseController {
  /**
   * 首页
   * @param {object} ctx
   * @returns
   */
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );
    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('edu-admin/teachers/index.html');
  }

  /**
   *  获取教师列表
   *
   * @param {Object} ctx
   * @returns
   */
  async queryTeacherListWithStatistic(ctx) {
    const { kdtId = '' } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new TeacherFacade(ctx).queryTeacherListWithStatistic(kdtId, query, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  导出教师列表
   *
   * @param {Object} ctx
   * @returns
   */
  async exportTeacherListWithStatistic(ctx) {
    const { kdtId = '', request } = ctx;
    const { query } = request.body;
    const operator = this.formatOperator;
    const params = {
      operateName: operator.nickName,
      operateMobile: operator.mobile,
      ...query,
    };
    params.operator = this.formatOperator;
    const data = await new TeacherFacade(ctx).exportTeacherListWithStatistic(kdtId, params);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取课程列表
   *
   * @param {Object} ctx
   * @returns
   */
  async queryCourseList(ctx) {
    const { kdtId = '' } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new TeacherFacade(ctx).queryCourseList(kdtId, query, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  导出课程列表
   *
   * @param {Object} ctx
   * @returns
   */
  async exportCourseList(ctx) {
    const { kdtId = '', request } = ctx;
    const { query } = request.body;
    const operator = this.formatOperator;
    const params = {
      operateName: operator.nickName,
      operateMobile: operator.mobile,
      ...query,
    };
    const data = await new TeacherFacade(ctx).exportCourseList(kdtId, params);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取课表/上课记录列表
   *
   * @param {Object} ctx
   * @returns
   */
  async queryLessonList(ctx) {
    const { kdtId = '' } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new TeacherFacade(ctx).queryLessonList(kdtId, query, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  导出课程列表
   *
   * @param {Object} ctx
   * @returns
   */
  async exportLessonList(ctx) {
    const { kdtId = '', request } = ctx;
    const { query } = request.body;
    const operator = this.formatOperator;
    const params = {
      operateName: operator.nickName,
      operateMobile: operator.mobile,
      ...query,
    };
    params.operator = this.formatOperator;
    const data = await new TeacherFacade(ctx).exportLessonList(kdtId, params);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取老师个人信息
   *
   * @param {Object} ctx
   * @returns
   */
  async getById(ctx) {
    const { teacherId, kdtId = '' } = ctx.getQueryParse();
    const data = await new TeacherFacade(ctx).getTeacherById(ctx.kdtId, {
      targetKdtId: kdtId,
      teacherId,
    });
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取老师个人信息
   *
   * @param {Object} ctx
   * @returns
   */
  async queryTeacherLessonStatistics(ctx) {
    const { kdtId = '' } = ctx;
    const { query } = ctx.getQueryParse();
    const data = await new TeacherFacade(ctx).queryTeacherLessonStatistics(kdtId, query);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = TeachersController;
