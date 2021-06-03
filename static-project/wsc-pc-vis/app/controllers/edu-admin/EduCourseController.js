const BaseController = require('../base/BaseController');
const EduCourseService = require('../../services/owl/edu/educourse/EduCourseService');
const EduCourseServiceV2 = require('../../services/owl/pc/educourse/EduCourseFacadeService');
const URL = require('@youzan/wsc-pc-base/app/lib/URL');

class EduCourseController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByKeys(this.ctx, {
        namespaceId: 'shop',
        businessId: 'wsc-pc-shop',
      });
    }
  }
  /**
   * 首页
   *
   * @param {Object} ctx
   * @return
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
    const version = ctx.getState('versionStatus') || {};
    if (version.versionCode === 'edu_base_version') {
      await ctx.redirect(URL.site('/vis/edu/course#/course-manage/list', 'v4'));
    } else {
      await ctx.render('edu-admin/educourse/index.html');
    }
  }

  /**
   *  获取课程列表，query中存放查询信息
   *
   * @param {Object} ctx
   * @return
   */
  async getEduCourseListJson(ctx) {
    const {
      kdtId = null,
      pageSize,
      pageNumber,
      sort = {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
      name,
      isTrial = -1,
      applicableCampusType,
    } = ctx.getQueryParse();
    const data = await new EduCourseServiceV2(ctx).findPageByCondition(
      ctx.kdtId,
      {
        pageSize,
        pageNumber,
        sort,
      },
      {
        applicableCampusType: applicableCampusType || null,
        name,
        isTrial,
        kdtId: kdtId || ctx.kdtId,
      },
    );
    return ctx.json(0, 'ok', data);
  }

  /**
   *  新建课程
   *
   * @param {Object} ctx
   * @return
   */
  async createEduCourse(ctx) {
    const { kdtId = '', request } = ctx;
    const { command } = request.body;
    if (!command.kdtId) {
      command.kdtId = kdtId;
    }
    command.operator = this.formatOperator;
    const data = await new EduCourseServiceV2(ctx).createEduCourse(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  编辑课程
   *
   * @param {Object} ctx
   * @return
   */
  async updateEduCourse(ctx) {
    const { kdtId = '', request } = ctx;
    const { command } = request.body;
    if (!command.kdtId) {
      command.kdtId = kdtId;
    }
    const data = await new EduCourseServiceV2(ctx).updateEduCourse(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取指定课程信息
   *
   * @param {Object} ctx
   * @return
   */
  async getById(ctx) {
    const { kdtId = '' } = ctx;
    const { id } = ctx.getQueryParse();
    const data = await new EduCourseService(ctx).getById(kdtId, id);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  删除课程信息
   *
   * @param {Object} ctx
   * @return
   */
  async deleteEduCourse(ctx) {
    const { kdtId = '', request } = ctx;
    const { id } = request.body;
    const data = await new EduCourseService(ctx).deleteEduCourse(kdtId, id);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  查看课程重名信息
   *
   * @param {Object} ctx
   * @return
   */
  async checkCourseName(ctx) {
    const { kdtId = '' } = ctx;
    const { eduCourseId, eduCourseName } = ctx.getQueryParse();
    const data = await new EduCourseService(ctx).checkEduCourseNameRepeat(kdtId, eduCourseId || null, eduCourseName);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  获取指定课程信息——支持连锁
   *
   * @param {Object} ctx
   * @return
   */
  async getByIdV2(ctx) {
    const { kdtId = '' } = ctx;
    const { eduCourseDetailQuery } = ctx.getQueryParse();
    if (!eduCourseDetailQuery.kdtId) {
      eduCourseDetailQuery.kdtId = kdtId;
    }
    const data = await new EduCourseServiceV2(ctx).getByIdV2(kdtId, eduCourseDetailQuery);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  根据课程id获取校区列表
   *
   * @param {Object} ctx
   * @return
   */
  async findPageByEduCourse(ctx) {
    const { kdtId = '' } = ctx;
    const { eduCourseShopQuery, pageRequest } = ctx.getQueryParse();
    if (!eduCourseShopQuery.kdtId) {
      eduCourseShopQuery.kdtId = kdtId;
    }
    const data = await new EduCourseServiceV2(ctx).findPageByEduCourse(kdtId, pageRequest, eduCourseShopQuery);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  查询校区是否可以删除
   *
   * @param {Object} ctx
   * @return
   */
  async checkEduCourse(ctx) {
    const { kdtId = '' } = ctx;
    const { eduCourseCheckQuery } = ctx.getQueryParse();
    if (!eduCourseCheckQuery.kdtId) {
      eduCourseCheckQuery.kdtId = kdtId;
    }
    const data = await new EduCourseServiceV2(ctx).checkEduCourse(kdtId, eduCourseCheckQuery);
    return ctx.json(0, 'ok', data);
  }

  /**
   *  删除课程信息——支持连锁
   *
   * @param {Object} ctx
   * @return
   */
  async deleteEduCourseV2(ctx) {
    const { kdtId = '', request } = ctx;
    const { eduCourseDeleteCommand } = request.body;
    if (!eduCourseDeleteCommand.kdtId) {
      eduCourseDeleteCommand.kdtId = kdtId;
    }
    const data = await new EduCourseServiceV2(ctx).deleteEduCourseV2(kdtId, eduCourseDeleteCommand);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = EduCourseController;
