import { IAssignmentDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import { IAssignmentData } from '../../entities/Assignment';

export function toEntity(res: IAssignmentDTO): IAssignmentData {
  return {
    id: res.assignmentId,
    detail: res.answerDetail,
    submitTime: res.submitTime,

    // status: todo
    hasReviewed: res.hasReviewed,
    score: res.reviewDTO?.comment?.score,
    selected: Boolean(res.reviewDTO?.comment?.excellentScore),
    comment: res.reviewDTO?.comment?.comment,
    draft: res.reviewDTO?.draft?.comment,
    draftScore: res.reviewDTO?.draft?.score,
    draftSelected: Boolean(res.reviewDTO?.draft?.excellentScore),
    reviewer: res.reviewDTO?.reviewer,
    reviewTime: Number(res.reviewDTO?.reviewTime) || 0,

    student: res.studentDTO,
    homework: {
      ...res.homework,
      scoreType: res.homework.scoreStyle,
      enableTimer: res.homework.timerPublish,
      endTime: res.homework.deadline,
      publishTime: Number(res.homework.publishTime),
      workbookId: res.exercise.id,
      selectedCount: 0,
      submitCount: 0,
      unreviewedCount: 0,
      selectedId: 0,
      submitAndExitCount: 0,
    }, // todo
    workbook: res.exercise,
  };
}