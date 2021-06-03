const BaseController = require('../../base/BaseController');
const StudentAggregateService = require('../../../services/owl/pc/student/StudentAggregateService');

class StudentController extends BaseController {
  async getStudentsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new StudentAggregateService(ctx).findPageByQueryWithClass(
      kdtId,
      pageRequest,
      query,
    );
    (result.content || []).map(item => {
      item.assetNo = (item.userAsset && item.userAsset.assetNo) || '';
    });
    return ctx.json(0, 'ok', result);
  }

  async getStudentsInClassJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new StudentAggregateService(ctx).findPageByQueryInClass(kdtId, pageRequest, filter);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = StudentController;
