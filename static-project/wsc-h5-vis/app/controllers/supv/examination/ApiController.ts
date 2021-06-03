import { Context } from 'astroboy';
import BaseController from '../../base/BaseNewController';
import UserExamService from '../../../services/owl/client/edu/exam/UserExamFacade';
import StudentFacade from '../../../services/owl/client/edu/student/StudentFacade';
import CourseExamFacade from '../../../services/owl/client/edu/exam/CourseExamFacade.js';

class AnswerController extends BaseController {
  async isInGray(ctx: Context) {
    const isWhiteList = await this.callService(
      'iron-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      'edu_exam_question',
      ctx.kdtId
    );
    ctx.json(0, 'ok', isWhiteList);
  }

  async startExam(ctx: Context) {
    const { kdtId, userId } = ctx;
    const query = ctx.getRequestData();
    query.userId = userId;
    const result = await new UserExamService(ctx).start(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getLatestQuestion(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getLatestQuestion(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getPrevQuestion(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getPrevQuestion(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getNextQuestion(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getNextQuestion(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getQuestion(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getQuestion(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getResult(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getResult(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getAnswerCard(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getAnswerCard(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async answerQuestion(ctx: Context) {
    const { kdtId, userId } = ctx;
    const query = ctx.getRequestData();
    query.userId = userId;
    const result = await new UserExamService(ctx).answerQuestion(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async submit(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).submit(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getDetail(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    query.userId = userId;
    const result = await new UserExamService(ctx).getDetail(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async getUserExamList(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    const pageRequest = ctx.getQueryParse('pageRequest');
    query.userId = userId;
    const result = await new UserExamService(ctx).findByUser(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  async getUserExam(ctx: Context) {
    const { kdtId, userId } = ctx;
    const result = await new UserExamService(ctx).getPage(kdtId, userId);
    ctx.json(0, 'ok', result);
  }

  async getRecommendList(ctx: Context) {
    const { kdtId, query } = ctx;
    const pageRequest = ctx.getQueryParse('pageRequest');
    const { examTemplateId } = query;
    const result = await new CourseExamFacade(ctx).findProductByExam(
      kdtId, pageRequest, examTemplateId);
    ctx.json(0, 'ok', result);
  }

  async getStudentList(ctx: Context) {
    const { kdtId, userId, query } = ctx;
    const { examId } = query;
    const result = await new StudentFacade(ctx).findJoinExamStudentsByUserId(kdtId, userId, examId);
    ctx.json(0, 'ok', result);
  }

  async getCourseExam(ctx: Context) {
    const { kdtId, query } = ctx;
    const { alias } = query;
    const res = await new CourseExamFacade(ctx).getLatestExamByProduceAlias(kdtId, alias);
    ctx.json(0, 'ok', res);
  }

  async getCourseExamList(ctx: Context) {
    const { kdtId, query, userId } = ctx;
    const pageRequest = ctx.getQueryParse('pageRequest');
    const { alias } = query;
    const res = await new CourseExamFacade(ctx).findPageByQuery(
      kdtId,
      pageRequest,
      { alias, userId }
    );
    ctx.json(0, 'ok', res);
  }
}

module.exports = AnswerController;
