import { communicationRegionRoute } from '@/pages/supv/homework/router';
import type Draft from '../entities/draft';
import {
  getAssignmentList,
  IAssignmentListPayload,
  getAssignment,
  submitAssignment,
  shareHomework,
  SubmitTypeEnum,
  getOtherStudentAssignmentList,
  IOtherStudentListQuery,
  IOtherStudentInfoQuery,
  getOtherStudentInfo,
  IAjaxExtraOption,
} from '../data-source/apis';

const service = {
  /**
   * 提交草稿
   * @param draft 学员草稿数据
   * @param homeworkAlias 学员提交作业的id
   * @param studentId 学员id
   */

  submitDraft(draft: Draft, assignmentId: number, studentId: number, targetKdtId: number) {
    return submitAssignment({
      answer: draft.detail,
      assignmentId,
      studentId,
      targetKdtId,
      type: SubmitTypeEnum.DRAFT,
    });
  },

  /**
   * 提交学员作业
   * @param draft 学员草稿数据
   * @param assignmentId 学员提交作业的id
   * @param studentId 学员id
   */

  submitAssignment(draft: Draft, assignmentId: number, studentId: number, targetKdtId: number) {
    return submitAssignment({
      answer: draft.detail,
      assignmentId,
      studentId,
      targetKdtId,
      type: SubmitTypeEnum.SUBMIT,
    });
  },

  /**
   * 分享学员作业
   * @param assignmentId
   * @param studentId
   */

  shareHomework(assignmentId: number, studentId: number) {
    return shareHomework({
      assignmentId,
      studentId,
    });
  },

  /**
   * assignmentId, alias选一个传进去
   *
   * @param studentId 学员id
   * @param assignmentId 学员作业id
   * @param alias 作业别称
   */

  getAssignment(studentId: number, assignmentId?: number, alias?: string, extraOptions?: IAjaxExtraOption) {
    // return getAssignment(assignmentId, studentId).then((assignment) => {
    //   return new Assignment(assignment);
    // });
    return getAssignment(studentId, assignmentId, alias, extraOptions);
  },

  /**
   * 获取其他同学的作业列表
   * @param homeworkAlias 作业别称
   * @param studentId 学员id
   */

  getOtherStudentAssignmentList(payload: IOtherStudentListQuery, extraOptions?: IAjaxExtraOption) {
    return getOtherStudentAssignmentList(payload, extraOptions);
  },

  /**
   * 跳转到其他同学的作业列表
   * @param homeworkAlias 作业别称
   * @param studentId 学员id
   */

  jumpToOtherStudentHomework(homeworkAlias: string, studentId: number) {
    communicationRegionRoute.push({
      query: {
        homeworkAlias,
        studentId,
      },
    });
  },

  /**
   * 获取作业列表
   */

  getAssignmentList(payload: IAssignmentListPayload) {
    // return getAssignmentList(payload).then((assignmentList) => {
    //   return {
    //     content: assignmentList.content.map((assignment) => new Assignment(assignment)),
    //     total: assignmentList.total,
    //     pageable: assignmentList.pageable,
    //   };
    // });
    return getAssignmentList(payload);
  },

  getOtherStudentInfo(payload: IOtherStudentInfoQuery) {
    return getOtherStudentInfo(payload);
  },
};

export default service;
