const StudentService = require('../../services/edu/StudentService');
const StudentFacade = require('../../services/owl/client/edu/student/StudentFacade');
const EduBaseController = require('./EduBaseController');
const StudentAttributeFacade = require('../../services/owl/client/attributeitem/StudentAttributeFacade');

class StudentController extends EduBaseController {
  // 学员资产-学员信息列表
  async findByCustomerIdJson(ctx) {
    const res = await new StudentFacade(ctx).findByCustomerId(ctx.kdtId, ctx.buyerId);
    ctx.json(0, 'ok', res);
  }

  // 学员资产-查询单个学员信息
  async getSimpleByIdJson(ctx) {
    const { studentId } = ctx.query;
    const res = await new StudentFacade(ctx).getSimpleById(ctx.kdtId, studentId);
    ctx.json(0, 'ok', res);
  }

  // 根据场景查询学员信息
  async getStudentInfoBySceneJson(ctx) {
    const userId = ctx.userId;
    const { studentId } = ctx.query;
    const query = {
      studentIds: [studentId],
      applicableType: 1,
      userId,
    };
    const res = await new StudentFacade(ctx).findByApplicableScene(ctx.kdtId, query);
    ctx.json(0, 'ok', res);
  }

  // 学员资产-创建
  async createOwlStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;

    const command = ctx.getPostData();
    command.userId = userId;
    const res = await new StudentFacade(ctx).create(kdtId, command);
    ctx.json(0, 'ok', res);
  }

  // 学员资产-更新
  async updateOwlStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;

    const command = ctx.getPostData();
    command.userId = userId;
    const res = await new StudentFacade(ctx).update(kdtId, command);
    ctx.json(0, 'ok', res);
  }

  // 学员资产-删除
  async deleteOwlStudentJson(ctx) {
    const userId = ctx.buyerId;
    const {
      studentId,
    } = ctx.getPostData();
    const res = await new StudentFacade(ctx).delete(ctx.kdtId, studentId, userId);
    ctx.json(0, 'ok', res);
  }

  async getStudentDetail(ctx) {
    const {
      kdtId,
      query: { alias },
    } = ctx;
    // 新接口说不用传 customerId 了，先保留着，万一以后要用到
    // const { youzan_user_id } = ctx.getLocalSession();
    // const customerId = youzan_user_id;
    const query = {
      id: alias,
      alias,
    };

    const list = await new StudentFacade(ctx).getByQuery(kdtId, query);
    ctx.json(0, 'ok', list);
  }

  /**
   * 查询学员
   *
   * @param {*} ctx
   */
  async queryStudent(ctx) {
    const {
      kdtId,
      query: { alias },
    } = ctx;
    const query = { id: alias, alias };
    const res = await new StudentFacade(ctx).getByQuery(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  /**
   * 新建学员
   *
   * @param {*} ctx
   */
  async createStudent(ctx) {
    const {
      kdtId,
      buyerId,
      request: {
        body: {
          name,
          gender,
          bornDate,
          grade,
          phoneNumber,
          wechatAccount,
          address,
        },
      },
    } = ctx;
    const params = {
      kdtId,
      userId: buyerId,
      name,
      gender,
      bornDate,
      grade,
      mobile: phoneNumber,
      wechatAccount,
      address,
    };
    const res = await new StudentService(ctx).createStudent(params);
    ctx.json(0, 'ok', res);
  }

  /**
   * 编辑学员
   *
   * @param {*} ctx
   */
  async updateStudent(ctx) {
    const {
      kdtId,
      request: {
        body: {
          alias,
          name,
          gender,
          bornDate,
          grade,
          phoneNumber,
          wechatAccount,
          address,
        },
      },
    } = ctx;
    const params = {
      id: alias,
      kdtId,
      name,
      gender,
      bornDate,
      grade,
      mobile: phoneNumber,
      wechatAccount,
      address,
    };

    const res = await new StudentService(ctx).updateStudent(params);
    ctx.json(0, 'ok', res);
  }

  /**
   * 删除学员
   *
   * @param {*} ctx
   */
  async deleteStudent(ctx) {
    const {
      kdtId,
      buyerId,
      request: {
        body: { alias },
      },
    } = ctx;
    const params = { kdtId, id: alias, customerUserId: buyerId };
    const res = await new StudentService(ctx).deleteStudent(params);
    ctx.json(0, 'ok', res);
  }

  /**
   * 查询课程 - 已购买课程
   */
  async queryStudentCourse(ctx) {
    const {
      kdtId,
      buyerId,
      query: {
        pageNumber,
        pageSize,
      },
    } = ctx;
    const params = {
      kdtId,
      customerUserId: buyerId,
      pageable: {
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'created_at',
            },
          ],
        },
      },
    };
    const res = await new StudentService(ctx).queryCourse(params);
    ctx.json(0, 'ok', res);
  }

  // 获取自定义资料项列表
  async getProfileListJSON(ctx) {
    const { kdtId } = ctx;

    // 查找报名场景的资料项
    const res = await new StudentAttributeFacade(ctx).listByApplicableScene(
      kdtId,
      { applicableScene: 1 },
    );

    ctx.json(0, 'ok', res);
  }

  // 从apollo 获取配置信息
  async getRemoteConfJSON(ctx) {
    try {
      const { query = {} } = ctx;
      const data = await ctx.apolloClient.getConfig({
        namespace: query.namespace || 'wsc-h5-vis.setting.customProfile',
        appId: 'wsc-h5-vis',
      });

      ctx.json(0, 'ok', data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(('获取apollo配置出错', err));
      ctx.json(0, 'ok', {});
    }
  }
}

module.exports = StudentController;
