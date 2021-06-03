const BaseController = require('../base/BaseController');
const SignInFacade = require('../../../services/owl/pc/signin/SignInFacade');
const StudentLessonService = require('../../../services/owl/pc/lesson/StudentLessonService');

class IndexController extends BaseController {
  async findStudentsPageForAddToSignInV2(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      pageSize,
      pageNumber,
      kdtId: targetKdtId,
      lessonNo,
      studentNameOrPhone,
      eduCourseId,
    } = ctx.query;
    const res = await new SignInFacade(ctx).findStudentsPageForAddToSignInV2(kdtId, {
      pageNumber: pageNumber,
      pageSize,
    }, {
      lessonNo,
      studentNameOrPhone,
      eduCourseId: eduCourseId || 0,
      kdtId: targetKdtId,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  async findStudentsV3(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      pageSize,
      pageNumber,
      kdtId: targetKdtId,
      lessonNo,
    } = ctx.query;
    const res = await new SignInFacade(ctx).findStudentsV3(kdtId, {
      pageNumber: pageNumber,
      pageSize,
    }, {
      lessonNo,
      kdtId: targetKdtId,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  async addStudentsV2(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      lessonNo,
      studentAndAssets,
      kdtId: targetKdtId,
    } = ctx.request.body;
    const res = await new StudentLessonService(ctx).createStudentLesson(kdtId, {
      studentAssets: studentAndAssets,
      lessonNo,
      kdtId: targetKdtId,
      operatorId: this.formatOperator.userId,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
