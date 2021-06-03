import {
  IHomeworkDTO
} from 'definitions/api/owl/api/ReviewerExerciseFacade/getHomeworkDetail';
import { IHomeworkData } from '../../entities/Homework';

export function toEntity(homework: IHomeworkDTO): IHomeworkData {
  return {
    id: homework.id,
    alias: homework.alias,
    title: homework.title,
    detail: homework.detail,
    scoreRule: homework.scoreRule,
    scoreType: homework.scoreStyle,
    enableTimer: homework.timerPublish,
    publishTime: Number(homework.publishTime),
    endTime: Number(homework.deadline),
    workbookId: homework.exerciseBookId,
    status: homework.status,
    submitCount: homework.submitNum || 0,
    submitAndExitCount: homework.submitTotalNum || 0,
    unreviewedCount: homework.toReviewNum || 0,
    selectedCount: homework.excellentNum || 0,
    selectedId: homework.excellentAssignmentId || 0,
  };
}

export function toQuery() {

}