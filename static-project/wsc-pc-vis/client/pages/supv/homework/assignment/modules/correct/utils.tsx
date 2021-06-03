import React, { FC } from 'react';
import { EduDocumentUpload } from '@youzan/ebiz-components';
import VideoPreview from 'pages/supv/homework/components/video-uploader-preview';
import AudioPreview from 'pages/supv/homework/components/audio-uploader-preview';
import ImagePreview from 'pages/supv/homework/components/img-uploader-preview';
import RichTextDisplay from './components/rich-text-display';

import { BooleanLike, ElementType, IFormElement } from '../../../types';
import { RenderType } from './types';
import {
  IAudioDetailItemDTO,
  IExerciseDetailItemDTO,
  IPictureDetailItemDTO,
  IVideoDetailItemDTO,
} from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import { ICorrectFormData } from 'domain/correct-domain/types';
import { RateType } from 'domain/homework-domain/types/homework';

const { DocPreviewItem } = EduDocumentUpload;

export const renderElement = (element, index: number, type: RenderType = RenderType.DETAIL) => {
  switch (element?.mediaType) {
    case ElementType.RichText:
      return (
        <RichTextDisplay
          key={index}
          content={
            type === RenderType.FORM ? element?.detail?.content : element?.richTextItem?.content
          }
        />
      );
    case ElementType.Audio:
      const audioItem = type === RenderType.FORM ? element?.detail : element?.audioItem;
      const { url, name } = audioItem;

      return (
        <AudioPreview
          key={index}
          width="356px"
          url={url}
          name={name}
          // audioId={audioId}
        />
      );
    case ElementType.Video:
      const videoItem = type === RenderType.FORM ? element?.detail : element?.videoItem;
      const { url: videoUrl, id, coverUrl, deleted } = videoItem;

      return (
        <VideoPreview
          key={index}
          url={videoUrl}
          width={'436px'}
          height={'220px'}
          videoId={id || 0}
          coverUrl={coverUrl || ''}
          deleted={deleted}
          showDeleteIcon={false}
        />
      );
    case ElementType.Document:
      const detail = type === RenderType.FORM ? element?.detail : element?.documentItem;
      const item: any = {
        attachment_url: detail.url,
        attachment_title: detail.name,
        attachment_size: detail.size,
        file_ext: detail.fileExt,
      };
      return (
        <div className="document-uploader-preview">
          <DocPreviewItem key={index} item={item} />
        </div>
      );
    default:
      return null;
  }
};

export const parseCorrectDatatoFormData = (
  correctData: Partial<ICorrectFormData>,
  rateType: RateType,
) => {
  const { score, comment: commentField, isGoodAssignment } = correctData || {};
  const comment = commentField?.[0]?.richTextItem?.content || '';

  const formData = {
    grade: rateType === RateType.GRADE ? score : null,
    score: rateType === RateType.POINT ? score : null,
    isGoodAssignment: (isGoodAssignment === BooleanLike.True || isGoodAssignment === BooleanLike.False)
      ? String(isGoodAssignment)
      : '',
    comment,
    media: commentField ? categoriseMediaByType(commentField) : {},
  };

  return formData;
};

/** 将后端返回的media分类 */
export const categoriseMediaByType = (elementList: IExerciseDetailItemDTO[]) => {
  return {
    image:
      elementList
        ?.filter((item) => item.mediaType === ElementType.Picture)
        .map((item) => item.pictureItem) || [],
    video:
      elementList
        ?.filter((item) => item.mediaType === ElementType.Video)
        .map((item) => item.videoItem) || [],
    audio:
      elementList
        ?.filter((item) => item.mediaType === ElementType.Audio)
        .map((item) => item.audioItem) || [],
  };
};

export const renderMediaByType: FC<{
  scene?: string;
  image: IPictureDetailItemDTO[];
  video: IVideoDetailItemDTO[];
  audio: IAudioDetailItemDTO[];
}> = ({ scene, image, video, audio }) => {
  const imgArr = image?.map(item => item.url) || [];
  return (
    <>
      <div className="imgvideo-display">
        {image.map((item, index) => {
          return (
            <ImagePreview
              imgArr={imgArr}
              key={index}
              url={item.url}
              height="80px"
              width="80px"
              previewAnchor={`${scene}-image`}
            />
          );
        })}
        {video.map((item, index) => {
          return (
            <VideoPreview
              key={index}
              videoId={item.id}
              url={item.url}
              coverUrl={item.coverUrl}
              height="80px"
              width="80px"
            />
          );
        })}
      </div>
      <div className="audio-display">
        {audio.map((item, index) => {
          return <AudioPreview key={index} width="264px" url={item.url} />;
        })}
      </div>
    </>
  );
};

export const isCorrectFormEmpty = (formData) => {
  if (!formData) {
    return true;
  }
  const { grade, score, isGoodAssignment, comment, media } = formData || {};
  const { image = [], audio = [], video = [] } = media;
  if (
    !grade &&
    !score &&
    !isGoodAssignment &&
    !comment &&
    image.length === 0 &&
    audio.length === 0 &&
    video.length === 0
  ) {
    return true;
  }
  return false;
};

export const parseFormData = (rateType: RateType, formData) => {
  const { grade, score, isGoodAssignment, comment, media } = formData;
  const { image = [], audio = [], video = [] } = media;
  const richTextField: IFormElement = {
    mediaType: ElementType.RichText,
    detail: { content: comment },
    serialNo: 0,
  };

  const initCommentField = comment
    ? [richTextField]
    : [];
  const parsedData = {
    score: rateType === RateType.POINT ? score : grade,
    isGoodAssignment,
    comment:
      initCommentField
        .concat(
          image.map((item) => ({
            mediaType: ElementType.Picture,
            detail: { url: item.url },
            serialNo: 0,
          })),
        )
        .concat(
          video.map((item) => ({
            mediaType: ElementType.Video,
            detail: { id: item.videoId || item.id },
            serialNo: 0,
          })),
        )
        .concat(
          audio.map((item) => ({
            mediaType: ElementType.Audio,
            detail: { name: item.name, url: item.url },
            serialNo: 0,
          })),
        ),
  };

  return parsedData;
};
