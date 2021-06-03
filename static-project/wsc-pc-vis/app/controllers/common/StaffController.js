const BaseController = require('../base/BaseController');
const StaffReadService = require('../../services/staff/core/StaffReadService');
const SingleStaffService = require('../../services/sam/gateway/staff/SingleStaffService');

class StaffController extends BaseController {
  /** 查询连锁员工 */
  async getChainStaffList(ctx) {
    const { kdtId } = ctx;
    const { targetKdtId = kdtId, pageNo, keyword, ...restQuery } = ctx.getQueryParse();
    const commonOptions = {
      mode: 'CHAIN_SHOP',
    };
    const chainOptions = {
      kdtIds: [targetKdtId],
    };
    const fieldOptions = {
      keyword,
      keywordMatchFields: ['NAME'],
    };
    const params = {
      ...restQuery,
      kdtId,
      operatorId: this.formatOperator.userId,
      pageNo,
      fieldOptions,
      commonOptions,
      chainOptions,
    };
    const data = await new StaffReadService(ctx).queryPage(params);

    ctx.json(0, 'ok', data);
  }

  /** 查询单店员工 */
  async getSingleShopStaffList(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const data = await new SingleStaffService(ctx).find({
      ...query,
      kdtId,
    });

    ctx.json(0, 'ok', data);
  }
}

module.exports = StaffController;
