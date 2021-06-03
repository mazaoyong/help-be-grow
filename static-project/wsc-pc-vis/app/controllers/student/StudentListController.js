const StudentAggregateFacade = require('../../services/api/owl/pc/StudentAggregateFacade');
const BaseController = require('../base/BaseController');

class StudentListController extends BaseController {
  /** @desciption 提交导出学员信息任务 */
  async postSubmitStudentExportTaskJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const pageRequest = requestData.pageRequest;
    const query = { ...requestData.query, kdtId: ctx.kdtId, operator: this.formatOperator };

    const result = await new StudentAggregateFacade(ctx).submitStudentExportTask(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.success(result);
  }
}

module.exports = StudentListController;
