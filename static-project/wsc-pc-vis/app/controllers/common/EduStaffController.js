const BaseController = require('../base/BaseController');
const EduStaffFacade = require('../../services/owl/pc/client/sam/EduStaffFacade');
const SingleStaffService = require('../../services/sam/gateway/staff/SingleStaffService');

class EduStaffController extends BaseController {
  // 全量获取某角色下的雇员列
  async findStaffByRoles(ctx) {
    const { kdtId } = ctx;
    const req = ctx.getQueryParse();

    const res = await new EduStaffFacade(ctx).findStaffByRoles(kdtId, req.roleIds);

    ctx.json(0, 'ok', res);
  }

  async findPagePowerStaffs(ctx) {
    const { kdtId } = ctx;
    const { cluePowerQuery } = ctx.getQueryParse();

    const pageSize = 100;
    let pageNumber = 1;
    let result = [];
    while (true) {
      const request = {
        pageSize,
        pageNumber,
      };
      const data = await new EduStaffFacade(ctx).findPagePowerStaffs(kdtId, request, cluePowerQuery);
      result = result.concat(data.content);
      if (pageNumber * pageSize >= data.total) {
        break;
      }
      pageNumber++;
    }

    // TODO
    return ctx.json(0, 'ok', result);
  }

  // 查询店铺所有的员工，包括自定义角色和已停用员工
  async findAllStaffs(ctx) {
    const pageSize = 100;
    const querySingleStaffRequest = {
      kdtId: ctx.kdtId,
      pageSize,
    };
    let pageNo = 1;
    let data = [];
    while (true) {
      querySingleStaffRequest.pageNo = pageNo;
      const { paginator, items } = await new SingleStaffService(ctx).find(querySingleStaffRequest);
      data = data.concat(items);
      if (paginator.totalCount < pageSize * pageNo) {
        break;
      }
      pageNo += 1;
    }
    return ctx.json(0, 'ok', data);
  }
}

module.exports = EduStaffController;
