const EduBaseController = require('./EduBaseController');
const StudentLessonService = require('../../services/owl/client/edu/student/StudentLessonFacade');

class StudyRecordsController extends EduBaseController {
  async getStudentList(ctx) {
    const { kdtId } = ctx;
    const { buyerId: userId } = this.buyer;

    // mock 51055158 690414618
    const result = await new StudentLessonService(ctx).findStudentRecordById(kdtId, userId);
    ctx.json(0, 'ok', result);
  }

  async getStudyRecords(ctx) {
    const { kdtId } = ctx;
    const {
      pageNumber,
      pageSize,
      sortBy = 'startTime',
      sortType = 'desc',
      studentId,
    } = ctx.query;

    const result = await new StudentLessonService(ctx).findPageLessonRecord(
      kdtId,
      {
        pageNumber,
        pageSize,
        sort: {
          orders: [
            {
              direction: sortType.toUpperCase(),
              property: sortBy,
              nullHandling: null,
            },
          ],
        },
      },
      {
        studentId,
      }
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = StudyRecordsController;
