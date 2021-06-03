import { MEDIA_ITEM_TYPE } from 'domain/supv/homework/constants';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';

export const createMediaItem = (
  type: MEDIA_ITEM_TYPE,
  payload: any,
) => {
  let content = {} as any;

  switch(type) {
    case MEDIA_ITEM_TYPE.RICHTEXT:
      content = { richTextItem: payload };
      break;
    case MEDIA_ITEM_TYPE.AUDIO:
      content = {
        audioItem: {
          url: payload.url || '',
        },
      };
      break;
    case MEDIA_ITEM_TYPE.VIDEO:
      content = {
        videoItem: {
          id: payload.videoId || 0,
          url: payload.url || '',
        },
      };
      break;
    default:
  };

  return {
    mediaType: type,
    ...content,
  } as IExerciseDetailItemDTO;
};
