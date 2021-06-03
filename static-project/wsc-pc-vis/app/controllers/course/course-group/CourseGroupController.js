const URL = require('@youzan/wsc-pc-base/app/lib/URL');
const BaseController = require('../../base/BaseController');
const CourseGroupFacade = require('../../../services/owl/pc/course-group/CourseGroupFacade');
const CourseGroupService = require('../../../services/owl/edu/courseGroup/CourseGroupService');
const CreditPolicyReadService = require('../../../services/srcm/credit/policy/CreditPolicyReadService');
const CourseGroupClientService = require('../../../services/owl/edu/courseGroup/CourseGroupClientService');

const runtime = global.getRuntime();
const apolloClient = runtime.apolloClient;

class CourseGroupController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByMultiNamespace(this.ctx, [
        {
          namespaceId: 'course',
          businessId: 'wsc-pc-vis',
        },
        {
          namespaceId: 'micropage',
          businessId: 'wsc-pc-shop',
          abilities: ['shopDecoComponent'],
        },
      ]);
    }
  }
  async redirectToNewUrl(ctx) {
    await ctx.redirect(URL.site('/vis/course/group/list', 'v4'));
  }

  async redirectToNewEditUrl(ctx) {
    await ctx.redirect(URL.site('/vis/course/group/add', 'v4'));
  }

  async getIndexHtml(ctx) {
    await this.getConfJSON(ctx);
    await ctx.render('course/course-group/index.html');
  }

  /**
   * @typedef {Object} PointsstoreStatus - 积分商城插件启用状态
   * @property {boolean} appStatus - 店铺是否订购该插件
   * @property {boolean} state - 店铺是否启用该插件
  */

  /**
   * 获得积分商城插件的订购和启用状态
   *
   * @author zhengjian <zhengjian@youzan.com>
   * 2020-08-24 课程分组编辑页面调用的是微页面的 sdk，而积分商城组件依赖 _global 里的
   * 积分商城启用状态。微页面编辑页面在 wsc-pc-shop 中的 node 端已经设置了这个状态，而
   * pc-vis 应用中没有塞这个字段，就会造成商家已购积分商城但是课程分组编辑页中的积分商城
   * 组件仍然提示「去订购」的问题，而产品并不希望在课程分组编辑中屏蔽这个组件，此处通过与
   * pc-shop 逻辑保持一致暂时性的修复这个问题。但是这不是一个最终的解决方案，因为除了积分
   * 商城组件之外，还有其他组件依赖 _global 中的字段，目前店铺装修侧的大哥们正在整理，还
   * 没有一个明确的时间。
   *
   * @todo 中台整理好之后接入相应的方案。
   * @see https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=59831
   *
   * @param {*} ctx - ctx
   * @return {PointsstoreStatus}
   */
  async getDesignPointsstoreStatus(ctx) {
    const kdtId = ctx.kdtId;
    try {
      const result = await new CreditPolicyReadService(ctx).getPointStoreRule({ kdtId });
      const {
        state = 0,
        appStatus = 0
      } = result || {};
      return {
        state: Number(state) === 1,
        appStatus: Number(appStatus) === 1,
      };
    } catch {
      return {
        state: false,
        appStatus: false
      };
    }
  }

  async getEditHtml(ctx) {
    await this.getConfJSON(ctx);

    const { id } = ctx.params;
    ctx.setGlobal('id', id);

    const designPointsstoreStatus = await this.getDesignPointsstoreStatus(ctx);
    ctx.setGlobal('design_pointsstore_status', designPointsstoreStatus);

    await ctx.render('course/course-group/edit.html');
  }

  async getManageHtml(ctx) {
    await this.getConfJSON(ctx);

    const { groupId } = ctx.params;
    ctx.setGlobal('groupId', groupId);

    await ctx.render('course/course-group/manage.html');
  }

  // 从apollo 获取配置信息
  async getConfJSON(ctx) {
    try {
      const { query = {} } = ctx;
      const data = apolloClient.getConfig({
        appId: 'wsc-pc-vis',
        namespace: query.namespace || 'wsc-pc-vis.setting.courseGroup',
      });
      ctx.setGlobal('courseGroupSetting', data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(('获取apollo配置出错', err));
    }
  }

  async getList(ctx) {
    const {
      kdtId = null,
      pageSize,
      pageNumber,
      sort = {
        orders: [
          {
            direction: 'DESC',
            property: 'createdTime',
          },
        ],
      },
      keyword,
      type = 1,
    } = ctx.getQueryParse();
    const listData = await new CourseGroupService(ctx).listCourseGroup(ctx.kdtId,
      {
        pageSize,
        pageNumber,
        sort,
      },
      {
        kdtId: kdtId || ctx.kdtId,
        keyword,
        type,
      });
    return ctx.json(0, 'ok', listData);
    // return ctx.json(0, 'ok', Mock.list);
  }

  async getQrCodeByAlias(ctx) {
    const {
      kdtId = ctx.kdtId,
      alias = '',
    } = ctx.getQueryParse();
    const data = await new CourseGroupClientService(ctx).createQrcode(kdtId, {
      kdtId,
      alias,
    });
    return ctx.json(0, 'ok', data);
  }

  async deleteGroupById(ctx) {
    const {
      kdtId = ctx.kdtId,
      groupId,
    } = ctx.request.body;
    const data = await new CourseGroupService(ctx).deleteCourseGroup(kdtId, groupId);
    return ctx.json(0, 'ok', data);
  }

  async getCourseListByGroup(ctx) {
    const {
      kdtId = null,
      pageSize,
      pageNumber,
      sort = {
        orders: [
          {
            direction: 'DESC',
            property: 'createdTime',
          },
        ],
      },
      groupId,
      keyword,
    } = ctx.getQueryParse();
    const listData = await new CourseGroupService(ctx).findItemPage(ctx.kdtId,
      {
        pageSize,
        pageNumber,
        sort,
      },
      {
        kdtId: kdtId || ctx.kdtId,
        keyword,
        groupId,
      });
    return ctx.json(0, 'ok', listData);
  }

  async getCourseList(ctx) {
    const {
      pageSize,
      pageNumber,
      sort = {
        orders: [
          {
            direction: 'DESC',
            property: 'createdTime',
          },
        ],
      },
      type,
      title = '',
    } = ctx.getQueryParse();
    const listData = await new CourseGroupService(ctx).findAllItemPage(ctx.kdtId,
      {
        pageSize,
        pageNumber,
        sort,
      },
      {
        type,
        title,
      });
    return ctx.json(0, 'ok', listData);
  }

  async addCourseToGroup(ctx) {
    const {
      kdtId = ctx.kdtId,
      groupId,
      itemIds,
    } = ctx.request.body;
    const res = await new CourseGroupService(ctx).batchCreateMultiItem(kdtId, {
      kdtId: kdtId,
      groupId,
      itemIds,
    });
    return ctx.json(0, 'ok', res);
  }

  async batchModifyCourseGroup(ctx) {
    const {
      kdtId = ctx.kdtId,
      groupIds,
      itemIds,
    } = ctx.request.body;
    let request = {};
    itemIds.forEach(itemId => {
      request[itemId] = groupIds;
    });
    const res = await new CourseGroupService(ctx).batchUpdateItemGroup(kdtId, {
      itemIdGroupIds: request,
      kdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async removeCourseFromGroup(ctx) {
    const {
      kdtId = ctx.kdtId,
      groupId,
      itemIds,
    } = ctx.request.body;
    const res = await new CourseGroupService(ctx).batchDeleteMultiItem(kdtId, {
      kdtId: kdtId,
      groupId,
      itemIds,
    });
    return ctx.json(0, 'ok', res);
  }

  // move from courseGroupDecorate controller
  async createCourseGroup(ctx) {
    const { kdtId, request } = ctx;
    const { body } = request;
    const { data } = body;
    const {
      clientIp,
      nickName,
      source,
      userId,
    } = this.formatOperator;
    let courseGroupCreateCommand = {
      data,
      operator: {
        clientIp,
        nickName,
        source,
        userId,
      },
    };
    courseGroupCreateCommand = await ctx.vixMicroPageXss(courseGroupCreateCommand, 'data');
    const res = await new CourseGroupFacade(ctx).createCourseGroup(kdtId, courseGroupCreateCommand);
    ctx.json(0, 'ok', res);
  }

  async updateCourseGroup(ctx) {
    const { kdtId, request } = ctx;
    const { body } = request;
    const { data, groupId } = body;
    const {
      clientIp,
      nickName,
      source,
      userId,
    } = this.formatOperator;
    let courseGroupUpdateCommand = {
      groupId,
      data,
      operator: {
        clientIp,
        nickName,
        source,
        userId,
      },
    };
    courseGroupUpdateCommand = await ctx.vixMicroPageXss(courseGroupUpdateCommand, 'data');
    const res = await new CourseGroupFacade(ctx).updateCourseGroup(kdtId, courseGroupUpdateCommand);
    ctx.json(0, 'ok', res);
  }

  async getCourseGroupDetail(ctx) {
    const { kdtId, query } = ctx;
    const { groupId } = query;
    const courseGroupQuery = {
      groupId,
      kdtId,
    };
    const res = await new CourseGroupFacade(ctx).getCourseGroupDetail(kdtId, courseGroupQuery);
    ctx.json(0, 'ok', res);
  }

  // move from coursegroup controller
  async listCourseGroup(ctx) {
    const { kdtId, query } = ctx;
    const { pageNumber, pageSize, keyword, type } = query;

    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const groupPagedQuery = {
      keyword,
      type,
    };
    const res = await new CourseGroupFacade(ctx).listCourseGroup(kdtId, pageRequest, groupPagedQuery);
    ctx.json(0, 'ok', res);
  }
}
module.exports = CourseGroupController;
