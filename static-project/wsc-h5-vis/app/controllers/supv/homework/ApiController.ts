import { Context } from 'astroboy';
import BaseController from '../../base/BaseNewController';
import UserExerciseService from '../../../services/api/owl/api/UserExerciseFacade';

class AnswerController extends BaseController {
  /** 查询其他同学的作业 */
  async findAssignmentExchangePage(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const {
      pageNumber,
      pageSize,
      homeworkAlias,
      studentId,
    } = requestData;

    const result = await new UserExerciseService(ctx).findAssignmentExchangePage(kdtId, {
      pageSize,
      pageNumber,
      sort: {
        orders: [
          {
            property: 'excellent',
            direction: 'DESC',
          },
          {
            'property': 'submit_time',
            'direction': 'DESC',
          },
        ],
      },
    }, {
      homeworkAlias,
      studentId,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  /** 提交作业(包含草稿) */
  async submitAssignment(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const {
      studentId,
      answer,
      assignmentId,
      type,
      targetKdtId,
    } = requestData;

    const result = await new UserExerciseService(ctx).submitAssignmentV2(kdtId, {
      studentId,
      answer,
      assignmentId,
      type,
      userId,
      targetKdtId,
    });
    ctx.json(0, 'ok', result);
  }

  /** 分享作业 */
  async shareHomework(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const {
      studentId,
      assignmentId,
    } = requestData;

    const result = await new UserExerciseService(ctx).shareHomework(kdtId, {
      studentId,
      assignmentId,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  /** 查询作业详情 */
  async getHomeworkDetail(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const { alias } = requestData;

    const result = await new UserExerciseService(ctx).getHomeworkDetail(kdtId, userId, alias);
    ctx.json(0, 'ok', result);
  }

  /** 加入作业本 */
  async joinExerciseBook(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const { alias, infoCollectItems, targetKdtId } = requestData;

    const result = await new UserExerciseService(ctx).joinExerciseBook(kdtId, {
      userId,
      alias,
      infoCollectItems,
      targetKdtId,
    });
    ctx.json(0, 'ok', result);
  }

  /** 查询作业本详情 */
  async getUserExercise(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const { alias } = requestData;

    const result = await new UserExerciseService(ctx).getUserExercise(kdtId, {
      userId,
      alias,
    });
    ctx.json(0, 'ok', result);
  }

  /** 查询学员作业详情 */
  async getStudentAssignment(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const { assignmentId, studentId, alias } = requestData;

    const result = await new UserExerciseService(ctx).getStudentAssignment(kdtId, {
      assignmentId: assignmentId === 'NaN' ? 0 : assignmentId,
      studentId,
      userId,
      alias,
    });
    ctx.json(0, 'ok', result);
  }

  /** 查询用户或学员名下的作业本列表 */
  async findUserExercisePage(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const {
      pageNumber,
      pageSize,
      studentId,
    } = requestData;

    const result = await new UserExerciseService(ctx).findUserExercisePage(kdtId,
      {
        pageNumber,
        pageSize,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'latest_sub_time',
            },
            {
              direction: 'DESC',
              property: 'created_at',
            },
          ],
        },
      },
      {
        userId,
        studentId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  /** 学生查询作业列表信息 */
  async findUserAssignmentPage(ctx: Context) {
    const { kdtId, userId } = ctx;
    const requestData = ctx.getRequestData();
    const {
      alias,
      studentId,
      status,
      pageNumber,
      pageSize,
    } = requestData;

    const result = await new UserExerciseService(ctx).findUserAssignmentPage(kdtId, {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'submit_time',
          },
          {
            direction: 'DESC',
            property: 'publish_time',
          },
        ],
      },
    }, {
      alias,
      studentId,
      status,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  /**
   * 查询其他学员的信息，主要是为了查头像
   */
  async findOtherStudentInfo(ctx: Context) {
    const { kdtId } = ctx;
    const requestData = ctx.getRequestData();
    const { assignmentId } = requestData;

    const result = await new UserExerciseService(ctx).findOtherStudentInfo(kdtId, assignmentId);
    ctx.json(0, 'ok', result);
  }
}

module.exports = AnswerController;
