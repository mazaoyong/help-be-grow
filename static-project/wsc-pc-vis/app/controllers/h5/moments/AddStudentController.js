const BaseController = require('../base/BaseController');
const EduPostMDFacade = require('../../../services/owl/ceres/CeresPostMDFacade');

class PosterController extends BaseController {
  async findStudentsForReview(ctx) {
    const { kdtId = '', query } = ctx;
    const {
      pageNumber,
      pageSize,
      keyword,
      kdtId: targetKdtId,
    } = query;
    const rst = await new EduPostMDFacade(ctx).findStudentsForReview(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        keyword,
        kdtId: targetKdtId,
      }
    );
    ctx.json(0, 'ok', rst);
  }

  async findRecentReviewedStudents(ctx) {
    const { kdtId } = ctx;
    const userId = this.formatOperator.userId;
    const rst = await new EduPostMDFacade(ctx).findRecentReviewedStudents(
      kdtId,
      {
        userId,
      }
    );
    ctx.json(0, 'ok', rst);
  }

  async findStudentsOnLesson(ctx) {
    const { kdtId = '', query } = ctx;
    const {
      pageNumber,
      pageSize,
      lessonNo,
      keyword: name,
      kdtId: targetKdtId,
    } = query;
    const rst = await new EduPostMDFacade(ctx).findStudentsOnLesson(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        name,
        lessonNo,
        kdtId: targetKdtId,
      }
    );
    ctx.json(0, 'ok', rst);
  }
}

module.exports = PosterController;
