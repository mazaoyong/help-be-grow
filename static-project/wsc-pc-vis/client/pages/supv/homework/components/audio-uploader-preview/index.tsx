import * as React from 'react';
// import { Img } from '@youzan/ebiz-components';
import AudioWrap from '../audio-wrap';
import { IAudioUploaderPreviewProps } from './types';
import './style.scss';

const ImgUploaderPreview: React.FC<IAudioUploaderPreviewProps> = (props) => {
  return (
    <div className="audio-uploader-preview"
      style={{
        width: props.width,
      }}
    >
      <AudioWrap
        src={props.url}
        name={props.name}
        width={props.width}
        audioId={props.audioId}
      />

      {
        props.showDeleteIcon && (
          <div className="audio-uploader-preview__deleteIcon" onClick={props.onDelete}></div>
        )
      }
    </div>
  );
};

export default ImgUploaderPreview;
