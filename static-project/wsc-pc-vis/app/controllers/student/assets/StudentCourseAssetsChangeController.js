const EduAssetFacade = require('../../../services/api/owl/pc/EduAssetFacade');
const AssetFacade = require('../../../services/api/owl/pc/AssetFacade');
const EduAssetOperationFacade = require('../../../services/api/owl/pc/EduAssetOperationFacade');
const BaseController = require('../../base/BaseController');

class StudentCourseAssetsChangeController extends BaseController {
  /** @desciption 查询资产操作明细简要信息 */
  async getQueryAssetOperationBriefInfoJson(ctx) {
    const requestData = ctx.getQueryParse();
    const query = { ...requestData };
    const result = await new EduAssetOperationFacade(ctx).queryAssetOperationBriefInfo(
      ctx.kdtId,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 分页查询资产操作明细 */
  async getQueryAssetOperationPageJson(ctx) {
    const requestData = ctx.getQueryParse();
    const page = requestData.pageRequest;
    const query = { ...requestData.query };

    console.log('query', requestData);

    const result = await new EduAssetOperationFacade(ctx).queryAssetOperationPage(
      ctx.kdtId,
      page,
      query,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 修改课时时查询课程资产信息 */
  async getGetAssetCourseTimeUpdateInfoJson(ctx) {
    const requestData = ctx.getQueryParse();
    const query = { ...requestData };

    const result = await new AssetFacade(ctx).getAssetCourseTimeUpdateInfo(ctx.kdtId, query);
    ctx.json(0, 'ok', result);
  }

  /** @desciption 调班时查询课程资产信息 */
  async getGetAssetClassUpdateInfoJson(ctx) {
    const requestData = ctx.getQueryParse();
    const query = { ...requestData };

    const result = await new EduAssetFacade(ctx).getAssetClassUpdateInfo(ctx.kdtId, query);
    ctx.json(0, 'ok', result);
  }

  // 修改有效期时查询课程资产信息
  async getStuAssetInfo(ctx) {
    const query = ctx.request.body || {};

    const result = await new AssetFacade(ctx).getStuAssetInfo(ctx.kdtId, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = StudentCourseAssetsChangeController;
