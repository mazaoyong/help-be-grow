import React, { FC, RefObject, useCallback } from 'react';
import { Icon as EbizIcon, EduDocumentUpload } from '@youzan/ebiz-components';
import RichtextField from '../richtext-field';
import AddButton from '../element-append-buttons';
import VideoUploader from 'pages/supv/homework/components/video-uploader';
import VideoUploaderPreview from 'pages/supv/homework/components/video-uploader-preview';
import AudioUploader from 'pages/supv/homework/components/audio-uploader';
import AudioUploaderPreview from 'pages/supv/homework/components/audio-uploader-preview';
import DocumentUploader from 'pages/supv/homework/components/document-uploader';
import makeRandomString from '@youzan/utils/string/makeRandomString';

import { DetailSwapOperation } from './types';
import {
  ElementType,
  IFrontVideoDetailItem,
  IFormElement,
} from '../../../../../types';
import { emptyRichTextField } from '../../constants';
import './styles.scss';

const { DocPreviewItem } = EduDocumentUpload;

interface IDetailProps {
  value: IFormElement[];
  onChange: any;
  disabled?: boolean;
  showErrorRef?: RefObject<boolean>;
}

const DetailWithOperation: FC<any> = (props) => {
  const { children, index, swap, del, length } = props;

  return (
    <div className="detail-operation__wrapper">
      <div className="field">
        {children}
      </div>
      <div className="operation">
        {index > 0 && (
          <span onClick={() => swap(index, DetailSwapOperation.MoveUp)}>
            <EbizIcon type="move-up" />
          </span>
        )}
        {index < length - 1 && (
          <span onClick={() => swap(index, DetailSwapOperation.MoveDown)}>
            <EbizIcon type="move-down" />
          </span>
        )}
        {length > 1 && (
          <span onClick={() => del(index)}>
            <EbizIcon type="remove" />
          </span>
        )}
      </div>
    </div>
  );
};

const Detail: FC<IDetailProps> = React.forwardRef<any, IDetailProps>(function DetailWithRef(
  { value, onChange },
  showErrorRef,
) {
  const addElementBlock = useCallback(
    (element: IFormElement | IFormElement[]) => {
      const content = [...value];
      onChange(content.concat(element));
    },
    [onChange, value],
  );

  const swapElementBlock = useCallback(
    (index: number, operation: DetailSwapOperation) => {
      if (value.length <= 1 || index + operation < 0 || index + operation > value.length) {
        return;
      }
      const content = [...value];
      content.splice(
        index,
        1,
        ...content.splice(index + operation, 1, content[index]),
      );
      onChange(content);
    },
    [value, onChange],
  );

  const deleteElementBlock = useCallback(
    (index: number) => {
      if (value.length <= 1) {
        return;
      }
      const content = [...value];
      content.splice(index, 1);
      onChange(content);
    },
    [value, onChange],
  );

  // const Foo = () => {
  //   React.useEffect(() => {

  //   }, [])
  //   return (
  //     <RichText
  //       value={element?.detail?.content}
  //       onChange={(val: string) => {
  //         const contentCopy = [...value];
  //         contentCopy.splice(index, 1, {
  //           key: element?.key || index,
  //           mediaType: element.mediaType,
  //           detail: { content: val },
  //           serialNo: 0,
  //         });
  //         onChange(contentCopy);
  //       }}
  //       editorConfig={{
  //         initialFrameWidth: 466,
  //         filterTxtRules: richTextFilter,
  //         // minFrameWidth: 300,
  //         toolbars: homeworkEditToolbar,
  //       }}
  //     />
  //   )
  // }

  const renderElement = useCallback(
    (element, index) => {
      switch (element?.mediaType) {
        case ElementType.RichText:
          return (
            <RichtextField
              value={element?.detail?.content}
              onChange={(val: string) => {
                const contentCopy = [...value];
                contentCopy.splice(index, 1, {
                  key: element?.key,
                  mediaType: element.mediaType,
                  detail: { content: val },
                  serialNo: 0,
                });
                onChange(contentCopy);
              }}
              showErrorRef={showErrorRef}
            />
          );
        case ElementType.Audio:
          const audioItem = element?.detail;
          const { url, name } = audioItem;

          return <AudioUploaderPreview width="468px" url={url} name={name} />;
        case ElementType.Video:
          const videoItem: IFrontVideoDetailItem = element?.detail;
          const { url: videoUrl, id, coverUrl, deleted, status } = videoItem;

          return (
            <div className="video-uploader-wrapper">
              <VideoUploaderPreview
                url={videoUrl || ''}
                width={'436px'}
                height={'220px'}
                videoId={id || 0}
                coverUrl={coverUrl || ''}
                deleted={deleted}
                showDeleteIcon={false}
                videoStatus={status}
              />
            </div>
          );
        case ElementType.Document:
          const detail = element?.detail || {};
          const item: any = {
            attachment_url: detail.url,
            attachment_title: detail.name,
            attachment_size: detail.size,
            file_ext: detail.fileExt,
          };
          return <DocPreviewItem key={index} item={item} />;
        default:
          return null;
      }
    },
    [showErrorRef, value, onChange],
  );

  return (
    <div className="detail-container">
      {value.map((element, index) => {
        return (
          <DetailWithOperation
            key={`${index}-${element?.key}`}
            index={index}
            swap={swapElementBlock}
            del={deleteElementBlock}
            length={value.length}
          >
            {renderElement(element, index)}
          </DetailWithOperation>
        );
      })}
      <div className="add-block">
        <AddButton
          type={ElementType.RichText}
          onClick={() =>
            addElementBlock({
              ...emptyRichTextField,
              key: makeRandomString(10),
            })
          }
        />
        <div className="audio">
          <AudioUploader
            value={[]}
            onChanged={(audioList) => {
              addElementBlock(
                audioList.map(audio => {
                  const { url, name } = audio;

                  return {
                    key: makeRandomString(10),
                    mediaType: ElementType.Audio,
                    detail: {
                      name,
                      url,
                    },
                    serialNo: 0,
                  };
                }),
              );
            }}
            anchor="audio"
          >
            <AddButton type={ElementType.Audio} />
          </AudioUploader>
        </div>
        <div className="video">
          <VideoUploader
            max={999}
            value={[]}
            onChanged={(videoList) => {
              addElementBlock(
                videoList.map(video => {
                  const {
                    coverUrl,
                    deleted,
                    name,
                    status, // 上传状态
                    videoId,
                    videoStatus,
                    url,
                  } = video;

                  return {
                    key: makeRandomString(10),
                    mediaType: ElementType.Video,
                    detail: {
                      name,
                      id: videoId,
                      coverUrl,
                      status: videoStatus,
                      deleted,
                      uploadStatus: status,
                      url,
                    } as IFrontVideoDetailItem, // todo: remove and update type
                    serialNo: 0,
                  };
                }),
              );
            }}
            // token-url="/wscvis/getQiniuAggregateUploadToken.json"
            anchor="video"
          >
            <AddButton type={ElementType.Video} />
          </VideoUploader>
        </div>
        <div className="document">
          <DocumentUploader
            value={[]}
            maxAmount={100}
            onChanged={documentList => {
              addElementBlock(
                documentList.map(document => {
                  const { documentId, url, name, size, fileExt } = document;
                  return {
                    key: makeRandomString(10),
                    mediaType: ElementType.Document,
                    detail: {
                      id: documentId,
                      name,
                      url,
                      size,
                      fileExt,
                    },
                    serialNo: 0,
                  };
                }),
              );
            }}
            anchor="document"
          >
            <AddButton type={ElementType.Document} />
          </DocumentUploader>
        </div>
      </div>
    </div>
  );
});

export default Detail;
