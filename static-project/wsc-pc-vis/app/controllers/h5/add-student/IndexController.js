const BaseController = require('../base/BaseController');
const SignInService = require('../../../services/owl/pc/signin/SignInService');
const StudentLessonDetectService = require('../../../services/owl/pc/lesson/StudentLessonDetectService');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/add-student.html');
  }

  async getStudentList(ctx) {
    const { kdtId = '', query } = ctx;
    const {
      pageNumber,
      pageSize,
      lessonNo,
      studentNameOrPhone,
      kdtId: targetKdtId,
    } = query;
    const rst = await new SignInService(ctx).findStudentsPageForAddToSignIn(
      kdtId,
      {
        pageNumber,
        pageSize,
      },
      {
        lessonNo,
        studentNameOrPhone,
        kdtId: targetKdtId,
      }
    );
    ctx.json(0, 'ok', rst);
  }

  async addStudents(ctx) {
    const { kdtId = '', request } = ctx;
    const {
      lessonNo,
      studentAndAssets,
      kdtId: targetKdtId,
    } = request.body;
    const rst = await new SignInService(ctx).addStudents(kdtId, {
      lessonNo,
      studentAndAssets,
      kdtId: targetKdtId,
    });
    ctx.json(0, 'ok', rst);
  }

  async detectDateRange(ctx) {
    const { kdtId = '' } = ctx;
    const query = ctx.getQueryParse();

    const rst = await new StudentLessonDetectService(ctx).detectDateRange(kdtId, query);
    ctx.json(0, 'ok', rst);
  }
}

module.exports = IndexController;
