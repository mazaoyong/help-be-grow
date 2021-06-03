const EduBaseController = require('./EduBaseController');
const SignInService = require('../../services/owl/edu/signin/SignInFacade');
const SignInCodeSettingService = require('../../services/owl/client/edu/signin/SignInCodeSettingFacade');
const SignInFacade = require('../../services/owl/client/edu/signin/SignInFacade');

class SignInController extends EduBaseController {
  // 查询客户当月有课的天数
  async findStudentLessons(ctx) {
    const { kdtId } = ctx;
    const { buyerId } = this.buyer;

    const res = await new SignInService(ctx).findStudentLessons(kdtId, buyerId);

    ctx.json(0, 'ok', res);
  }

  // 用户发起签到操作
  async signIn(ctx) {
    const { kdtId } = ctx;
    const { buyerId } = this.buyer;
    const {
      lessonNo,
      lessonType,
      signInType,
      studentIds,
    } = ctx.getPostData();

    const signInCommand = {
      lessonNo,
      userId: buyerId,
      studentIds,
      lessonType,
      signInType,
    };

    const res = await new SignInService(ctx).signIn(kdtId, signInCommand);

    ctx.json(0, 'ok', res);
  }

  // 签到成功页数据接口
  async getStudentLessonAfterSignIn(ctx) {
    const { kdtId } = ctx;
    const { studentLessonNo } = ctx.query;

    const res = await new SignInService(ctx).getStudentLessonAfterSignIn(kdtId, studentLessonNo);

    ctx.json(0, 'ok', res);
  }

  // 签到成功页的推广加群接口
  async getPromote(ctx) {
    const { kdtId } = ctx;

    const res = await new SignInCodeSettingService(ctx).get(kdtId, 1);

    ctx.json(0, 'ok', res);
  }

  async findUserAssetsForSignIn(ctx) {
    const { kdtId } = ctx;

    const {
      studentId,
      lessonNo,
    } = ctx.query;

    const res = await new SignInFacade(ctx).findUserAssetsForSignIn(kdtId, studentId, lessonNo);

    ctx.json(0, 'ok', res);
  }

  async signInWithAssets(ctx) {
    const { kdtId } = ctx;

    const {
      studentId,
      lessonNo,
      assetNos,
      lessonType,
    } = ctx.getPostData();

    const {
      buyerId: userId,
    } = ctx.visBuyer;

    const queryData = {
      studentId,
      lessonNo,
      userId,
      signInAllStudents: false,
      assetNos,
      lessonType,
    };

    const res = await new SignInService(ctx).signInWithAssets(kdtId, queryData);

    ctx.json(0, 'ok', res);
  }
}

module.exports = SignInController;
