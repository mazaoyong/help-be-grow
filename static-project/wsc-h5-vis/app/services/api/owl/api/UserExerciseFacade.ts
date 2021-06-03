import BaseService from '../../../base/BaseService';
import { IAssignmentSubmitCommand } from 'definitions/api/owl/api/UserExerciseFacade/submitAssignment';
import {
  IUserHomeworkDTO,
  IStudentBriefDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/getHomeworkDetail';
import { IExerciseJoinCommand } from 'definitions/api/owl/api/UserExerciseFacade/joinExerciseBook';
import {
  IUserExerciseQuery,
  IUserExerciseDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';
import {
  IUserAssignmentQuery,
  IUserAssignmentDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/getStudentAssignment';
import {
  IPageRequest,
  IUserExercisePageQuery,
  IPage,
  IUserExercisePageDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/findUserExercisePage';
import {
  IUserAssignmentPageQuery,
  IAssignmentPageDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/findUserAssignmentPage';
import {
  IAssignmentExchangePageQuery,
  IAssignmentExchangePageDTO,
} from 'definitions/api/owl/api/UserExerciseFacade/findAssignmentExchangePage';
import {
  IExerciseShare,
} from 'definitions/api/owl/api/UserExerciseFacade/shareHomework';

class UserExerciseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.exercise.UserExerciseFacade';
  }

  /**
    *  提交作业, 返回奖励的描述语
    *  老师未批阅之前，都可以任意修改
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1078303
    *
    *  @param {number} kdtId -
    *  @param {Object} command -
    *  @param {number} command.studentId - 学员id
    *  @param {Array.<Object>} command.answer[] - 答案
    *  @param {number} command.targetKdtId - 目标店铺id
    *  @param {number} command.type - 提交的类型
        1：提交
        2：草稿
    *  @param {number} command.assignmentId - 学员作业
    *  @param {number} command.userId - 用户id
    *  @return {Promise}
    */
  async submitAssignmentV2(kdtId: number, command: IAssignmentSubmitCommand) {
    return this.invoke('submitAssignmentV2', [kdtId, command]);
  }

  /**
   *  学员分享作业
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1077522
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.studentId - 学员id
   *  @param {number} command.assignmentId - 学员作业id
   *  @param {number} command.userId - 用户id
   *  @return {Promise}
   */
  async shareHomework(kdtId: number, command: IExerciseShare) {
    return this.invoke('shareHomework', [kdtId, command]);
  }

  /**
   * @description 加入作业本
   *  关联班级的，c端学员不能手动加入
   * @link http://zanapi.qima-inc.com/site/service/view/1004121
   */
  async joinExerciseBook(
    kdtId: number,
    command: IExerciseJoinCommand
  ): Promise<boolean> {
    return this.invoke('joinExerciseBook', [kdtId, command]);
  }

  /**
   * @description 用户查询作业本详情
   *  两种场景：
   *    1：分享出去之后的作业本，用户查看详情，需要返回多个学员
   *    2：针对多学员的场景，如果用户选择了学员，后续需要传入学员id
   * @link http://zanapi.qima-inc.com/site/service/view/1004119
   */
  async getUserExercise(
    kdtId: number,
    query: IUserExerciseQuery
  ): Promise<IUserExerciseDTO> {
    return this.invoke('getUserExercise', [kdtId, query]);
  }

  /**
   * @description 查询学员的作业本信息
   * @link http://zanapi.qima-inc.com/site/service/view/1004117
   */
  async findUserExercisePage(
    kdtId: number,
    pageRequest: IPageRequest,
    query: IUserExercisePageQuery
  ): Promise<IPage<IUserExercisePageDTO>> {
    return this.invoke('findUserExercisePage', [kdtId, pageRequest, query]);
  }

  /**
   * @description 学生查询作业列表信息
   * @link http://zanapi.qima-inc.com/site/service/view/1004120
   */
  async findUserAssignmentPage(
    kdtId: number,
    pageRequest: IPageRequest,
    query: IUserAssignmentPageQuery
  ): Promise<IPage<IAssignmentPageDTO>> {
    return this.invoke('findUserAssignmentPage', [kdtId, pageRequest, query]);
  }

  /**
   * @description 查询学员作业详情 - 学生
   * @link http://zanapi.qima-inc.com/site/service/view/1008493
   */
  async getStudentAssignment(
    kdtId: number,
    query: IUserAssignmentQuery
  ): Promise<IUserAssignmentDTO> {
    return this.invoke('getStudentAssignment', [kdtId, query]);
  }

  /**
   * @description 查询作业详情
   * @link http://zanapi.qima-inc.com/site/service/view/1008488
   */
  async getHomeworkDetail(
    kdtId: number,
    userId: number,
    alias: string
  ): Promise<IUserHomeworkDTO> {
    return this.invoke('getHomeworkDetail', [kdtId, userId, alias]);
  }

  /**
   * @description 作业交流区
   * @link http://zanapi.qima-inc.com/site/service/view/1026309
   */
  async findAssignmentExchangePage(
    kdtId: number,
    pageRequest: IPageRequest,
    query: IAssignmentExchangePageQuery
  ): Promise<IPage<IAssignmentExchangePageDTO>> {
    return this.invoke('findAssignmentExchangePage', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   * @description 查询其他学员头像
   * @link http://zanapi.qima-inc.com/site/service/view/1028221
   */
  async findOtherStudentInfo(
    kdtId: number,
    assignmentId: number
  ): Promise<Array<IStudentBriefDTO>> {
    return this.invoke('findOtherStudentInfo', [kdtId, assignmentId]);
  }
}

export = UserExerciseFacade;
