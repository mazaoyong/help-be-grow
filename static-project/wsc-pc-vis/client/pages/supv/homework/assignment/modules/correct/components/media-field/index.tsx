import { Pop } from '@zent/compat';
import { React, FC } from '@youzan/tany-react';
import { Icon } from 'zent';
import AudioUploader from 'pages/supv/homework/components/audio-uploader';
import ImgUploader from 'pages/supv/homework/components/img-uploader';
import VideoUploader from 'pages/supv/homework/components/video-uploader';

import './styles.scss';

const MediaAction: FC<{ disabled?: boolean; disableText?: string }> = props => {
  const { children, disabled, disableText } = props;

  if (disabled) {
    return (
      <Pop trigger="hover" content={disableText}>
        <div
          className="media-action disabled"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Icon type="plus" />
          {children}
        </div>
      </Pop>
    );
  }

  return (
    <div className="media-action">
      <Icon type="plus" />
      {children}
    </div>
  );
};

export const ImageField: FC<{ value; onChange }> = props => {
  const { value = [], onChange } = props;

  return (
    <div className="action-container">
      <ImgUploader
        max={9}
        value={value}
        onChanged={onChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="media"
      >
        <MediaAction disabled={value.length >= 9} disableText="最多上传9张图片">
          图片
        </MediaAction>
      </ImgUploader>
    </div>
  );
};

export const VideoField: FC<{ value; onChange }> = props => {
  const { value = [], onChange } = props;

  return (
    <div className="action-container">
      <VideoUploader
        max={9}
        value={value}
        onChanged={onChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="media"
      >
        <MediaAction disabled={value.length >= 9} disableText="最多上传9个视频">
          视频
        </MediaAction>
      </VideoUploader>
    </div>
  );
};

export const AudioField: FC<{ value; onChange }> = props => {
  const { value = [], onChange } = props;

  return (
    <div className="action-container">
      <AudioUploader
        max={9}
        value={value}
        onChanged={onChange}
        supportRecord={true}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="audio"
        popProps={{
          position: 'bottom-right',
          className: 'audio-uploader-pop correct',
        }}
      >
        {value.length >= 9 ? (
          <Pop trigger="hover" content="最多上传9个音频">
            <div
              className="media-action disabled"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Icon type="plus" />
              音频
            </div>
          </Pop>
        ) : (
          <div className="media-action">
            <Icon type="plus" />
            音频
          </div>
        )}
      </AudioUploader>
    </div>
  );
};
