import {
  IHomeworkCreateCommand,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/updateHomework';
import { MEDIA_ITEM_TYPE } from '../../constants';
import Homework from '../../entities/Homework';
import format from '@youzan/utils/date/formatDate';

export function toQuery(homework: Homework): IHomeworkCreateCommand {
  const query = {
    id: homework.id,
    exerciseBookId: Number(homework.workbook?.id),

    scoreStyle: homework.reviewSettings.scoreType,
    scoreRule: homework.reviewSettings.scoreRule,

    timerPublish: Number(homework.publishSettings.enableTimer),
    publishTime: homework.publishSettings.publishTime
      ? format(homework.publishSettings.publishTime, 'YYYY-MM-DD HH:mm:ss')
      : format(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
    deadline: homework.publishSettings.endTime
      ? format(homework.publishSettings.endTime, 'YYYY-MM-DD HH:mm:ss')
      : '',

    detail: homework.detail.map((item, index) => {
      switch(item.mediaType) {
        case MEDIA_ITEM_TYPE.RICHTEXT:
          return {
            mediaType: item.mediaType,
            detail: item.richTextItem,
            serialNo: index,
          };
        case MEDIA_ITEM_TYPE.AUDIO:
          return {
            mediaType: item.mediaType,
            detail: item.audioItem,
            serialNo: index,
          };
        case MEDIA_ITEM_TYPE.VIDEO:
          return {
            mediaType: item.mediaType,
            detail: item.videoItem,
            serialNo: index,
          };
        default:
          return {};
      }
    }),
    title: homework.title,
  };

  if (!query.id) {
    delete (query as any).id;
  }

  if (query.scoreStyle === 2) {
    delete (query as any).scoreRule;
  }

  if (!query.deadline) {
    delete (query as any).deadline;
  }

  return query;
}
