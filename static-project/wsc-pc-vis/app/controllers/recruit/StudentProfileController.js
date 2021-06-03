const BaseController = require('../base/BaseController');
const StudentAttributeFacade = require('../../services/owl/pc/attributeItem/StudentAttributeFacade');

const runtime = global.getRuntime();
const apolloClient = runtime.apolloClient;

class StudentProfileController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('recruit/student-profile/profile.html');
  }

  // 获取店铺选中的学员资料项列表
  async getProfileItemList(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new StudentAttributeFacade(ctx).findAttributes(kdtId, pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  // 添加店铺的学员资料项
  async addProfileItems(ctx) {
    const { kdtId, request } = ctx;
    const { attributeAddDTOS } = request.body;

    const data = await new StudentAttributeFacade(ctx).batchAddStandardAttribute(kdtId, attributeAddDTOS);

    ctx.json(0, 'ok', data);
  }

  // 获取所有学员资料项列表
  async getAllProfileItemsJSON(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new StudentAttributeFacade(ctx).queryAttributes(kdtId, pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  // 创建学员资料项
  async createStudentProfileJSON(ctx) {
    const { kdtId, request } = ctx;
    const command = request.body;

    const data = await new StudentAttributeFacade(ctx).create(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 更新学员资料项
  async updateStudentProfileJSON(ctx) {
    const { kdtId, request } = ctx;
    const command = request.body;

    const data = await new StudentAttributeFacade(ctx).update(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 删除学员资料项
  async deleteStudentProfileJSON(ctx) {
    const { kdtId, request } = ctx;
    const { attrItemId } = request.body;

    const data = await new StudentAttributeFacade(ctx).delete(kdtId, attrItemId);

    ctx.json(0, 'ok', data);
  }

  // 根据场景获取资料项列表
  async getListByApplicableScene(ctx) {
    const { kdtId, query } = ctx;

    const data = await new StudentAttributeFacade(ctx).listByApplicableScene(kdtId, query);

    ctx.json(0, 'ok', data);
  }

  // 从apollo 获取配置信息
  async getRemoteConfJSON(ctx) {
    try {
      const { query = {} } = ctx;
      const data = apolloClient.getConfig({
        appId: 'wsc-pc-vis',
        namespace: query.namespace || 'wsc-pc-vis.setting.customProfile',
      });

      ctx.json(0, 'ok', data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(('获取apollo配置出错', err));
      ctx.json(0, 'ok', {});
    }
  }
}

module.exports = StudentProfileController;
