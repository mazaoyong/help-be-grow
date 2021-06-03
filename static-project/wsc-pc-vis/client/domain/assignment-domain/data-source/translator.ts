import type {
  IAssignmentDTO,
  IParsedWorkbookAssignmentQuery,
  IParsedHomeworkAssignmentQuery,
} from '../types/assignment';
import type {
  IAssignmentPageDTO,
  IUserAssignmentQuery,
} from 'definitions/api/owl/pc/AssignmentFacade/findExerciseAssignmentPage';
import type { IHomeworkAssignmentQuery } from 'definitions/api/owl/pc/AssignmentFacade/findHomeworkAssignmentPage';

export const parseListData = (data: IAssignmentPageDTO[]): IAssignmentDTO[] => {
  return data?.map((item) => {
    const {
      publishTime,
      score,
      exerciseBookId,
      homeworkId,
      studentDTO,
      submitTime,
      excellentScore,
      studentStatus,
      reviewer,
      title,
      assignmentId,
      status,
    } = item;

    const { role, name, mobile, avatar, userId } = studentDTO || {};

    const { name: reviewerUsername, mobile: reviewerMobile, userId: reviewerUserId } = reviewer || {};

    return {
      title,
      assignmentId,
      homeworkId,
      workbookId: exerciseBookId,
      studentRole: role,
      studentName: name,
      studentMobile: mobile,
      studentAvatar: avatar,
      studentId: userId,
      publishTime,
      score,
      submitTime,
      isGoodAssignment: excellentScore,
      hasQuit: studentStatus,
      status,
      reviewerUserId,
      reviewerUsername,
      reviewerMobile,
    };
  });
};

export const parseWorkbookAssignmentListQuery = (
  data: IParsedWorkbookAssignmentQuery,
): IUserAssignmentQuery => {
  const {
    studentId,
    reviewerId,
    workbookId,
    isGoodAssignment,
    status,
    publishTimeRange,
    submitTimeRange,
    title,
  } = data;

  return {
    userId: studentId,
    reviewerId,
    exerciseBookId: workbookId,
    excellentScore: isGoodAssignment,
    status,
    publishTimeRange,
    submitTimeRange,
    title,
  };
};

export const parseHomeworkAssignmentListQuery = (
  data: IParsedHomeworkAssignmentQuery,
): IHomeworkAssignmentQuery => {
  const { workbookId, homeworkId, reviewerId, studentName, status } = data;

  return {
    reviewerId,
    homeworkId,
    exerciseBookId: workbookId,
    studentName,
    status,
  };
};
