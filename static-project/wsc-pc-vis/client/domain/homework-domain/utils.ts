import makeRandomString from '@youzan/utils/string/makeRandomString';
import { IExerciseDetailItemDTO, IRichTextDetailItemDTO, IAudioDetailItemDTO, IVideoDetailItemDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';
import { frontMediaType } from './types/homework';

interface IDetailElementBase {
  key?: string;
  mediaType: frontMediaType;
  serialNo: number;
}

type IRichTextDetail = {
  detail: IRichTextDetailItemDTO;
}

type IVideoDetail = {
  detail: IVideoDetailItemDTO;
}

type IAudioDetail = {
  detail: IAudioDetailItemDTO;
}

type IRichTextElement = IDetailElementBase & IRichTextDetail;
type IVideoElement = IDetailElementBase & IVideoDetail;
type IAudioElement = IDetailElementBase & IAudioDetail;
type IDetailElementDTO = IRichTextElement | IVideoElement | IAudioElement;

const detailReadMap = {
  [frontMediaType.Richtext]: 'richTextItem',
  [frontMediaType.Picture]: 'pictureItem',
  [frontMediaType.Audio]: 'audioItem',
  [frontMediaType.Video]: 'videoItem',
};

/**
 * 把后端解析好的详情结构转化为表单的通用结构
 */
export const parseDetail = (raw?: IExerciseDetailItemDTO[]): IDetailElementDTO[] | undefined => {
  if (raw) {
    return raw?.map(data => ({
      key: makeRandomString(10),
      mediaType: data?.mediaType,
      serialNo: data?.serialNo,
      detail: data?.[detailReadMap[data?.mediaType]]
    }));
  }
};
