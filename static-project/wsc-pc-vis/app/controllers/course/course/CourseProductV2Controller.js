/**
 * 线下课改造项目 新接口使用的控制器
 * 老接口后面会下掉
 */

const BaseController = require('../../base/BaseController');
const PcCourseFacade = require('../../../services/owl/pc/courseitem/offlinecourse/PcCourseFacade');
const PcProductSkuFacade = require('../../../services/owl/pc/courseitem/product/PcProductSkuFacade');
const PcProductLockFacade = require('../../../services/owl/pc/courseitem/product/PcProductLockFacade');

const makeDateTimeStr = require('@youzan/utils/date/makeDateTimeStr');

class CourseProductV2Controller extends BaseController {
  // 分页查询课程商品列表
  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { courseQuery, pageRequest } = ctx.getQueryParse();

    if (courseQuery.kdtId) {
      courseQuery.campusKdtId = courseQuery.kdtId;
      delete courseQuery.kdtId;
    } else if (courseQuery.kdtId === '') {
      delete courseQuery.kdtId;
    }

    const data = await new PcCourseFacade(ctx).findPageByCondition(kdtId, courseQuery, pageRequest);

    try {
      const content = data.content;
      const aliases = content.map(c => c.alias);
      const lockData = await new PcProductLockFacade(ctx).findLockTypeListByAliases(kdtId, aliases);
      const lockDataMap = {};
      lockData.forEach(item => {
        lockDataMap[item.alias] = item.pcLockTypes;
      });
      content.forEach(c => {
        c.lockType = lockDataMap[c.alias];
      });
      return ctx.success(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  // 分页查询课程列表 - 针对微页面编辑器
  // 替换以前的/v4/vis/edu/course/getAllCourseList.json
  async findPageByConditionForWym(ctx) {
    const { query = {}, kdtId } = ctx;
    const {
      pageNumber = 1,
      pageSize = 20,
      sortBy = 'created_time',
      sortType = 'desc',
      courseType = 2,
      soldStatus = 2,
      ...stringCondition
    } = query;

    const courseQuery = {
      courseType: +courseType,
      soldStatus: +soldStatus,
      useHideGroup: false,
      ...stringCondition,
    };

    if (courseQuery.kdtId) {
      courseQuery.campusKdtId = courseQuery.kdtId;
      delete courseQuery.kdtId;
    } else {
      courseQuery.campusKdtId = kdtId;
    }

    // 连锁总部，需要强制筛选全部商品
    if (ctx.shopRole === 1) {
      courseQuery.soldStatus = 2;
    }

    const pageRequest = {
      pageNumber: +pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: sortType.toUpperCase(),
            property: sortBy,
            nullHandling: null,
          },
        ],
      },
    };

    const data = await new PcCourseFacade(ctx).findPageByCondition(kdtId, courseQuery, pageRequest);
    data.content.forEach(item => {
      if (typeof item.createdAt === 'number') {
        item.createdAt = makeDateTimeStr(item.createdAt);
      }
    });
    ctx.set('x-course-new-api', 'yes');
    return ctx.success(data);
  }

  // 列表页 — 获取sku信息
  async findProductSkus(ctx) {
    const { query: { productAlias, kdtId: campusKdtId } = {} } = ctx;
    const productSkuQuery = { productAlias };
    if (campusKdtId && campusKdtId !== ctx.kdtId) {
      productSkuQuery.campusKdtId = campusKdtId;
    }
    const result = await new PcCourseFacade(ctx).findProductSkus(ctx.kdtId, productSkuQuery);

    return ctx.success(result);
  }

  // 根据销售状态查找店铺列表信息
  async findPageBySoldStatus(ctx) {
    const { courseProductQuery, pageRequest } = ctx.getQueryParse();
    const result = await new PcCourseFacade(ctx).findPageBySoldStatus(
      ctx.kdtId,
      courseProductQuery,
      pageRequest,
    );
    return ctx.success(result);
  }

  // 配置可售校区列表查询
  async findPageCampusProduct(ctx) {
    const { courseProductQuery, pageRequest } = ctx.getQueryParse();
    if (courseProductQuery.status === '') {
      delete courseProductQuery.status;
    }

    const result = await new PcCourseFacade(ctx).findPageCampusProduct(
      ctx.kdtId,
      courseProductQuery,
      pageRequest,
    );
    return ctx.success(result);
  }

  // 快捷修改无sku商品信息
  async quickUpdateProductByAlias(ctx) {
    const { kdtId, request } = ctx;
    const { ...editFields } = request.body || {};
    const operator = this.formatOperator;

    const productQuickUpdateCommand = {
      operator,
      ...editFields,
    };

    const result = await new PcCourseFacade(ctx).quickUpdateProductByAlias(
      kdtId,
      productQuickUpdateCommand,
    );
    return ctx.success(result);
  }

  // 快捷修改商品规格相关信息
  async quickUpdateProductSkuByAlias(ctx) {
    const { kdtId, request } = ctx;
    const { ...editFields } = request.body || {};
    const operator = this.formatOperator;

    const productQuickUpdateSkuCommand = {
      operator,
      ...editFields,
    };

    const result = await new PcCourseFacade(ctx).quickUpdateProductSkuByAlias(
      kdtId,
      productQuickUpdateSkuCommand,
    );
    return ctx.success(result);
  }

  // 获取商品规格值列表
  async findSkuPropNames(ctx) {
    const { kdtId } = ctx;
    const result = await new PcProductSkuFacade(ctx).findSkuPropNames(kdtId);
    return ctx.success(result);
  }

  // 查询指定店铺下的课程标签
  async findSkuPropValues(ctx) {
    const { dictId = null } = ctx.getQueryParse();
    const pcSkuListQueryDTO = {
      dictId,
    };

    const result = await new PcProductSkuFacade(ctx).findSkuPropValues(
      ctx.kdtId,
      pcSkuListQueryDTO,
    );
    return ctx.success(result);
  }

  // 查询指定店铺下的课程标签
  async findCourseTag(ctx) {
    const { kdtId } = ctx;
    const { tag = null } = ctx.getQueryParse();
    const courseTagQueryDTO = { tag };

    const result = await new PcCourseFacade(ctx).findCourseTag(kdtId, courseTagQueryDTO);
    return ctx.success(result);
  }

  // 添加商品规格值value
  async createSkuPropVal(ctx) {
    const { kdtId } = ctx;
    const { dictId = 0, text = null } = ctx.request.body;

    const pcSkuCreateCommand = { dictId, text };
    const result = await new PcProductSkuFacade(ctx).createSkuPropVal(kdtId, pcSkuCreateCommand);

    return ctx.success(result);
  }

  // 新增店铺商品规格key
  async createSkuPropName(ctx) {
    const { kdtId } = ctx;
    const { dictId = 0, text = null } = ctx.request.body;

    const pcSkuCreateCommand = { dictId, text };
    const result = await new PcProductSkuFacade(ctx).createSkuPropName(kdtId, pcSkuCreateCommand);

    return ctx.success(result);
  }

  // pc端编辑课程查询课程详情
  async getCoursePCDetail(ctx) {
    const { alias } = ctx.query;
    const result = await new PcCourseFacade(ctx).getCoursePCDetail(ctx.kdtId, { alias });
    return ctx.success(result);
  }

  // PC端批量删除
  async batchDelete(ctx) {
    const { request } = ctx;
    const {
      body: { kdtId = null, aliasList = [] },
    } = request;
    const operator = this.formatOperator;
    const payload = {
      kdtId: kdtId || ctx.kdtId,
      operator,
      aliasList,
    };
    const result = await new PcCourseFacade(ctx).batchDelete(ctx.kdtId, payload);
    return ctx.success(result);
  }

  // 设置销售状态（上下架）
  async batchSetSellStatus(ctx) {
    const { request } = ctx;
    const {
      body: { aliasList = [], sell, kdtId = null, sellStatusProductModelList = [] },
    } = request;
    const operator = this.formatOperator;
    const payload = {
      kdtId: kdtId || ctx.kdtId,
      aliasList,
      sellStatusProductModelList,
      operator,
      sell,
    };

    const result = await new PcCourseFacade(ctx).batchSetSellStatus(ctx.kdtId, payload);
    return ctx.success(result);
  }

  // 批量设置vip折扣信息
  async batchSetVipDiscount(ctx) {
    const { request } = ctx;
    const {
      body: { aliasList = [], joinDiscount, kdtId = null },
    } = request;
    const operator = this.formatOperator;
    const payload = {
      kdtId: kdtId || ctx.kdtId,
      operator,
      aliasList,
      join: joinDiscount,
    };

    const result = await new PcCourseFacade(ctx).batchSetVipDiscount(ctx.kdtId, payload);
    return ctx.success(result);
  }

  // 查询课程商品标签信息，目前在多人拼团生成海报时使用
  async findCourseTagsByAlias(ctx) {
    const {
      kdtId,
      query: { alias },
    } = ctx;
    const result = await new PcCourseFacade(ctx).findCourseTagsByAlias(kdtId, alias);

    ctx.set('x-course-new-api', 'yes');
    return ctx.success(result);
  }

  // 创建课程
  async createCourse(ctx) {
    let params = {
      course: ctx.request.body.course,
      product: ctx.request.body.product,
    };
    const operator = this.formatOperator;

    if (!params.course.kdtId) {
      params.course.kdtId = ctx.kdtId;
      params.product.kdtId = ctx.kdtId;
    }
    params.product.operator = operator;
    params = await ctx.visXss(params, 'course.intro');
    const result = await new PcCourseFacade(ctx).createCourse(ctx.kdtId, params);
    return ctx.success(result);
  }

  // 更新课程
  async updateCourse(ctx) {
    let params = {
      course: ctx.request.body.course,
      product: ctx.request.body.product,
    };
    const operator = this.formatOperator;

    if (!params.course.kdtId) {
      params.course.kdtId = ctx.kdtId;
      params.product.kdtId = ctx.kdtId;
    }
    params.product.operator = operator;
    params = await ctx.visXss(params, 'course.intro');
    const result = await new PcCourseFacade(ctx).updateCourse(ctx.kdtId, params);
    return ctx.success(result);
  }
}

module.exports = CourseProductV2Controller;
