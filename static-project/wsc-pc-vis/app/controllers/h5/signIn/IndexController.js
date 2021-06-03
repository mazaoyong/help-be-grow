const utilsShop = require('@youzan/utils-shop');
const { checkChainStore } = utilsShop;
/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const SignInService = require('../../../services/owl/pc/signin/SignInService');
const BatchActionPollingService = require('../../../services/owl/pc/batchaction/BatchActionPollingService');

class IndexController extends BaseController {
  /**
   * 签到页面
   */
  async getIndexHtml(ctx) {
    if (checkChainStore(ctx.getState('shopInfo'))) {
      await this.setCampusInfo(ctx);
    }
    await ctx.render('h5/sign-in.html');
  }

  /**
   * 获取具体某一课程的详细信息和学员列表
   */
  async getStudentList(ctx) {
    const { kdtId = 0 } = ctx;
    const { pageNumber, pageSize, lessonNo, kdtId: targetKdtId } = ctx.query;

    const queryDate = {
      lessonNo,
      kdtId: targetKdtId,
    };

    const res = await new SignInService(ctx).findStudentsV2(kdtId, { pageNumber, pageSize }, queryDate);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 获取具体某一课程的详细信息和学员列表
   */
  async getActionResult(ctx) {
    const { kdtId = 0 } = ctx;
    const { taskNo, kdtId: targetKdtId } = ctx.query;
    const tempKdtId = targetKdtId || kdtId;
    const res = await new BatchActionPollingService(ctx).getActionResult(tempKdtId, taskNo);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 点击签到/全部签到发送的ajax请求
   */
  async signIn(ctx) {
    const { kdtId = 0 } = ctx;
    const { id: operatorId } = ctx.getLocalSession('userInfo');
    const { kdtId: targetKdtId, lessonNo, signInType, signInAllStudents } = ctx.request.body;
    const dto = {
      lessonNo,
      operatorId,
      signInType,
      kdtId: targetKdtId,
    };
    if (signInAllStudents === 'true') { // 全部学员签到
      dto.signInAllStudents = signInAllStudents;
    } else {
      const { studentLessonNos } = ctx.request.body;
      dto.studentLessonNos = studentLessonNos;
    }
    const res = await new SignInService(ctx).businessBatchSignInWeapp(kdtId, dto);
    return ctx.json(0, 'ok', res);
  }

  async removeStudent(ctx) {
    const { kdtId = 0 } = ctx;
    const { id: operatorId } = ctx.getLocalSession('userInfo');
    const {
      studentId,
      studentLessonNo,
      kdtId: targetKdtId,
    } = ctx.request.body;
    const res = await new SignInService(ctx).removeStudent(kdtId, {
      studentId,
      studentLessonNo,
      operatorId,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async changeSignInState(ctx) {
    const { kdtId = 0 } = ctx;
    const { id: operatorId } = ctx.getLocalSession('userInfo');
    const {
      signInType,
      studentLessonNo,
      kdtId: targetKdtId,
    } = ctx.request.body;
    const res = await new SignInService(ctx).changeSignInState(kdtId, {
      signInType,
      studentLessonNo,
      operatorId,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
