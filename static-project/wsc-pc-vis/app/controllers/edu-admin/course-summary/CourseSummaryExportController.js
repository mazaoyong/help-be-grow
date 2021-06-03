const EduAssetOperationFacade = require('../../../services/api/owl/pc/EduAssetOperationFacade');
const SignSummaryFacade = require('../../../services/api/owl/pc/SignSummaryFacade');
const BaseController = require('../../base/BaseController');

class CourseSummaryExportController extends BaseController {
  /** @desciption 导出学员课时汇总任务 */
  async postExportStudentSignSummaryInfoTaskJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const query = {
      ...requestData.query,
      kdtId: ctx.kdtId,
      operator: this.formatOperator,
    };

    const result = await new SignSummaryFacade(ctx).exportStudentSignSummaryInfoTask(
      ctx.kdtId,
      query,
    );
    ctx.success(result);
  }

  /** @desciption 导出学员资产课时汇总 任务 */
  async postExportAssetSignSummaryInfoTaskJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const query = {
      ...requestData.query,
      kdtId: ctx.kdtId,
      operator: this.formatOperator,
    };

    const result = await new SignSummaryFacade(ctx).exportAssetSignSummaryInfoTask(
      ctx.kdtId,
      query,
    );
    ctx.success(result);
  }

  /** @desciption 资产手动扣减操作导出请求 */
  async postSubmitAssetSubOperationExportTaskJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const query = requestData.query;
    const queriesWithOperator = {
      ...query,
      kdtId: ctx.kdtId,
      operator: this.formatOperator,
    };

    const result = await new EduAssetOperationFacade(ctx).submitAssetSubOperationExportTask(
      ctx.kdtId,
      queriesWithOperator,
    );
    ctx.success(result);
  }
}

module.exports = CourseSummaryExportController;
