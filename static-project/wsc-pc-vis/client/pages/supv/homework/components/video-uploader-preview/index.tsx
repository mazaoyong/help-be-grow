import * as React from 'react';
import { Video as VideoPreview } from '@youzan/ebiz-components';
import { IVideoUploaderPreviewProps, VideoStatus } from './types';
import './style.scss';

const ImgUploaderPreview: React.FC<IVideoUploaderPreviewProps> = (props) => {
  const VideoAudit = React.useCallback(() => {
    let el: React.ReactElement;

    if (props.videoStatus === VideoStatus.TRANSCODE_FAIL) {
      el = (
        <p>
          转码失败
        </p>
      );
    } else if (props.videoStatus === VideoStatus.AUDIT_WAIT) {
      el = (
        <p>
          视频等待审核(鉴黄不通过,待人工审核)
        </p>
      );
    } else if (props.videoStatus === VideoStatus.AUDIT_FAIL) {
      el = (
        <p>
          视频审核不通过(人工审核失败)
        </p>
      );
    } else {
      el = (
        <p style={{
          color: '#646566'
        }}>
          审核中
        </p>
      );
    }
    return el;
  }, [props.videoStatus]);

  const VideoDeath = React.useCallback(() => {
    let el: React.ReactElement;
    if (props.deleted) {
      el = (
        <div
          className={`video-uploader-preview__upload-error`}
        >
          <p>视频已被删除</p>
        </div>
      );
    } else if (typeof props.videoStatus === 'number' && props.videoStatus !== VideoStatus.NORMAL) {
      el = (
        <div className={`video-uploader-preview__upload-error`}>
          <VideoAudit />
        </div>
      );
    } else {
      return null;
    }

    return el;
  }, [props.deleted, props.videoStatus]);
  return (
    <div
      className="video-uploader-preview"
      style={
        {
          width: props.width,
          height: props.height,
        }
      }
    >

      {
        props.url ? (
          <VideoPreview
            coverUrl={props.coverUrl || ''}
            id={props.videoId}
            url={props.url}
            width={props.width}
            height={props.height}
            deleted={props.deleted}
          />
        ) : (
          <VideoDeath />
        )
      }
      {props.showDeleteIcon && <div className="video-uploader-preview__deleteIcon" onClick={() => {
        props.onDelete && props.onDelete();
      }}></div>}
    </div>
  );
};

export default ImgUploaderPreview;
