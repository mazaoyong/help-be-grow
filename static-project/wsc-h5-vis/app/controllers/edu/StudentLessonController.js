const StudentLessonFacade = require('../../services/owl/client/edu/student/StudentLessonFacade');
const EduBaseController = require('./EduBaseController');

class StudentLessonController extends EduBaseController {
  async findPageLessonRecordJson(ctx) {
    const kdtId = ctx.kdtId;
    // const userId = ctx.buyerId;

    const {
      pageNumber,
      pageSize,
      studentId,
      assetNo,
    } = ctx.query;
    const query = {
      studentId,
      assetNo,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const res = await new StudentLessonFacade(ctx).findPageLessonRecord(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  // 查询上课记录v2
  async findPageLessonRecordV2(ctx) {
    const kdtId = ctx.kdtId;

    const {
      pageNumber,
      pageSize,
      studentId,
      assetNo,
    } = ctx.query;

    const query = {
      studentId,
      assetNo,
    };

    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const res = await new StudentLessonFacade(ctx).findPageLessonRecordV2(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }
}

module.exports = StudentLessonController;
