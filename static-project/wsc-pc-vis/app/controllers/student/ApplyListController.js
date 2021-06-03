const StudentFacade = require('../../services/api/owl/pc/StudentFacade');
const BaseController = require('../base/BaseController');

class ApplyListController extends BaseController {
  /** @desciption 提交报读列表导出任务 */
  async postSubmitSignUpReadExportTaskJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const pageRequest = requestData.pageRequest;
    const { mobile, nickName } = this.formatOperator;
    const query = {
      ...requestData.query,
      mobile,
      nickName,
    };

    const result = await new StudentFacade(ctx).submitSignUpReadExportTask(
      ctx.kdtId,
      pageRequest,
      query,
    );
    ctx.success(result);
  }
}

module.exports = ApplyListController;
