import { IWorkbookManageStudent } from '../types/homework-student';
import { IExerciseStudentPageDTO } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/findStudentPageByCondition';

/** 作业本管理 - 学员列表 */

export const parseStudentListData = (data: IExerciseStudentPageDTO[]): IWorkbookManageStudent[] => {
  return data.map(item => {
    const {
      studentDTO,
      bookId,
      joinTime,
      dueNum,
      submitNum,
      collectInfo,
      studentStatus,
      // title,
      excellentNum,
      toReviewNum,
    } = item;

    const {
      role,
      name = '',
      mobile = '',
      avatar,
      userId,
    } = studentDTO || {};

    return {
      workbookId: bookId,
      role,
      userId,
      name,
      mobile,
      avatar,
      hasLeft: studentStatus,
      joinTime,
      assignmentNum: dueNum,
      completedAssignmentNum: submitNum,
      goodAssignmentNum: excellentNum,
      awaitMarkingNum: toReviewNum,
      enrollmentInfo: collectInfo,
    };
  });
};
