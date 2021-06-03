const SignInFacade = require('../../../services/api/owl/pc/SignInFacade');
const EduAssetOperationFacade = require('../../../services/api/owl/pc/EduAssetOperationFacade');
const SignSummaryFacade = require('../../../services/api/owl/pc/SignSummaryFacade');
const BaseController = require('../../base/BaseController');

class CourseSummaryCommonController extends BaseController {
  async init() {
    super.init();
  }

  async getIndexHtml(ctx) {
    await ctx.render('edu-admin/course-summary/index.html');
  }

  /** @desciption 查询学员资产课时汇总 */
  async getFindAssetSignSummaryInfoJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryParse();
    const pageRequest = requestData.pageRequest;
    const query = { ...requestData.query, kdtId: ctx.kdtId };

    const result = await new SignSummaryFacade(ctx).findAssetSignSummaryInfo(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.success(result);
  }

  /** @desciption 查询学员课时汇总 */
  async getFindStudentSignSummaryInfoJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryParse();
    const pageRequest = requestData.pageRequest;
    const query = { ...requestData.query, kdtId: ctx.kdtId };

    const result = await new SignSummaryFacade(ctx).findStudentSignSummaryInfo(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.success(result);
  }

  /** @desciption 分页查询资产手动扣减操作明细 */
  async getQueryAssetSubOperationPageJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryData();
    const page = requestData.page;
    const query = {
      kdtId: ctx.kdtId,
      ...requestData.query,
    };

    const result = await new EduAssetOperationFacade(ctx).queryAssetSubOperationPage(
      ctx.kdtId,
      page,
      query,
    );
    ctx.success(result);
  }

  /** @desciption 课程汇总查询明细 */
  async getGetAssetDetailJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryData();
    const query = { ...requestData.query, kdtId: ctx.kdtId };

    const result = await new SignSummaryFacade(ctx).getAssetDetail(ctx.kdtId, query);
    ctx.success(result);
  }

  /** @desciption 查询资产手动扣减操作简要信息 */
  async getQueryAssetSubOperationBriefInfoJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryData();
    const query = { ...requestData.query, kdtId: ctx.kdtId };

    const result = await new EduAssetOperationFacade(ctx).queryAssetSubOperationBriefInfo(
      ctx.kdtId,
      query,
    );
    ctx.success(result);
  }

  /** @desciption B端查询签到记录汇总信息 */
  async getFindSignInBrieInfoJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryData();
    const signInRecordsQuery = {
      ...requestData.query,
      kdtId: ctx.kdtId,
      operator: this.formatOperator,
    };

    const result = await new SignInFacade(ctx).findSignInBrieInfo(ctx.kdtId, signInRecordsQuery);
    ctx.success(result);
  }
}

module.exports = CourseSummaryCommonController;
