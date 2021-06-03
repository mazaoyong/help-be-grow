
import { Form } from '@zent/compat';
import React, { FC, useState, useCallback, MouseEvent, ReactElement } from 'react';
import { Icon, Alert } from 'zent';
import { IMediaComponentParams, IMediaPropsParam } from './interface';
import { VideoUpload, Upload } from '@youzan/react-components';
import { Video as VideoPreview } from '@youzan/ebiz-components';
import { generateVideoPlayInfo } from '../../api';
import getTimestamp from './util';

const { getControlGroup } = Form;
const defaultCover = 'https://b.yzcdn.cn/wsc/ump/paidcontent/default.png';
const accept = 'image/gif, image/jpeg, image/png, image/bmp';

const getInitMediaType: (props: IMediaPropsParam[])=>number = (extraContents) => {
  if (extraContents.length) {
    return extraContents[0].contentType;
  }
  return -1;
};

const MediaFieldComponent: FC<IMediaComponentParams> = (props) => {
  const { value = [], onChange = () => {} } = props;
  const [mediaType, setMediaType] = useState(getInitMediaType(value));

  // 视频上传成功回调
  const uploadVideoSuccess = useCallback(data => {
    if (data) {
      const videos = [{
        contentType: 2,
        id: data.video_id,
        url: '',
        videoDTO: {
          coverUrl: data.cover_url,
          videoStatus: data.status,
          duration: null,
        },
      }];
      setMediaType(2);

      generateVideoPlayInfo({
        request: {
          mediaId: data.video_id,
          partnerBizType: 1,
        },
      }).then(resp => {
        videos[0].url = resp.playUrl;
        videos[0].videoDTO.duration = resp.tencentVideoDTO ? resp.tencentVideoDTO.duration : 0;
        onChange(videos);
      }).catch(err => {
        console.error(err);
        onChange(videos);
      });
    }
  }, []);

  // 照片上传成功回调
  const uploadPictureSuccess = useCallback(data => {
    let currentValue: IMediaPropsParam[] = [...value];
    data = data.map(item => {
      return {
        id: item.attachmentId || item.attachment_id,
        url: item.attachmentUrl || item.attachment_url,
        contentType: 0,
      };
    });
    currentValue = currentValue.concat(data);
    if (mediaType !== 0) {
      setMediaType(0);
    }
    onChange(currentValue.slice(0, 9));
  }, [value]);

  // 视频选择组件tips
  const renderhelpVideoText: ()=>ReactElement = useCallback(() => {
    return <span>
          点击 + 选择视频，视频大小不超过3G，建议时长10~30分钟，宽高比16:9，
      <br />
          支持mp4，mov，m4v，flv,x-flv，mkv，wmv，avi，rmvb，3gp格式
    </span>;
  }, []);

  // 视频选择器点击上传
  const openVideoUpload: (e: MouseEvent) => void = useCallback(e => {
    // const helpDesc = this.props.helpDescs;
    e.preventDefault();
    const baseUrl = window._global.url.v4;

    const tokenUrl = '/vis/commom/material/videoUploadToken.json';
    const confirmUrl = '/vis/commom/material/confirmVideoUpload.json';

    const uploadOptions = {
      materials: true,
      tokenUrl: baseUrl + tokenUrl,
      categoryListUrl: `${baseUrl}/api/iron/materials/videoCategoryList.json`,
      materialsListUrl: `${baseUrl}/api/iron/materials/videoList.json`,
      confirmUrl: baseUrl + confirmUrl,
      publishUrl: `${baseUrl}/api/iron/materials/publishVideo.json`,
      maxSize: 3 * 1024 * 1024 * 1024,
      className: 'comment-video-upload',
      onSuccess: uploadVideoSuccess,
      videoHelpDesc: renderhelpVideoText(),
      uploadConfig: {
        kdtId: window._global.kdtId,
        fetchUrl: `${baseUrl}/api/iron/materials/shopPubImg.json`,
        tokenUrl: `${baseUrl}/api/iron/materials/shopPubImgUploadToken.json`,
      },
      transformData: {
        tokenUrl: data => {
          return {
            api_url: data.uploadApiUrl,
            token: data.uploadToken,
            video_path: data.videoPath, // eslint-disable-line
          };
        },
      },
    };

    VideoUpload.initialize(uploadOptions);
  }, []);

  // 删除视频
  const removeVideo: ()=>void = useCallback(() => {
    onChange([]);
    setMediaType(-1);
  }, []);

  // 图片删除事件
  const handlePictureDelete: (index: number)=>void = index => {
    let currentValue: IMediaPropsParam[] = [...value];
    currentValue.splice(index, 1);
    if (!currentValue.length) {
      setMediaType(-1);
    }
    onChange(currentValue);
  };

  const getVideoLayout: () => ReactElement | null = () => {
    if (value && value.length) {
      const videoObj = value[0].videoDTO || {};
      return <span className="uploaded-video-block">
        <span className="video-cover-img">
          <Icon type="video-guide-o" className="video__headImg__icon" />
          { !!value[0].url &&
            <VideoPreview
              coverUrl={videoObj.coverUrl || ''}
              id={value[0].id}
              url={value[0].url}
              width="195px"
              height="100px"
              deleted={videoObj.deleted}
            />
          }
          {!!videoObj.duration && <span className="video-duration">{getTimestamp(videoObj.duration)}</span>}
          {!value[0].url && <>
            <img src={videoObj.coverUrl || defaultCover} alt="" />
          </>}
          <Icon type="close-circle" className="close-video" onClick={removeVideo} ></Icon>
        </span>
        {videoObj.videoStatus !== 1 && (
          <span
            onClick={e => {
              openVideoUpload(e);
            }}
            className="edit-video"
          >
              编辑视频
          </span>
        )}
        {// 视频上传完成，开始转码
          videoObj.videoStatus === 1 ? (
            <Alert className="video-error">
              <span>点评将在视频转码、审核通过后自动发送</span>
            </Alert>
          ) : null}
        {// 视频审核失败
          videoObj.videoStatus === 6 ? (
            <Alert className="video-error">
              <span>该视频转码、审核失败，无法正常播放，你可以</span>
              <a href="" onClick={openVideoUpload}>
                {' '}
                重新选择一个视频
              </a>
            </Alert>
          ) : null}
        {// 视频等待审核
          videoObj.videoStatus === 5 ? (
            <Alert className="video-error">
              <span>该视频转码、审核中，转码审核通过后生效</span>
            </Alert>
          ) : null}
        {// 视频转码失败
          videoObj.videoStatus === 3 ? (
            <Alert className="video-error">
              <span>该视频转码失败，请重新上传</span>
            </Alert>
          ) : null}
      </span>;
    }

    return null;
  };

  const getPictureLayout: () => ReactElement | null = () => {
    if (value && value.length) {
      return <div className="comment-dialog-picture-wrap">{value.map((item, index) => {
        return (
          <div className="image-sortable__item" key={item.id}>
            <img src={item.url} />
            <a className="close-modal small" onClick={() => handlePictureDelete(index)}>
              ×
            </a>
          </div>
        );
      })}
      {value.length < 9 && (
        <Upload
          materials
          maxSize={10 * 1024 * 1024}
          className='comment-picture-upload'
          type="image"
          tokenUrl={`${_global.url.v4}/vis/commom/material/getQiniuAggregateUploadToken.json`}
          trigger={() => <div className="media-edit-trigger">
            <Icon className="media-edit-trigger__icon" type='plus'></Icon>
            <span className="media-edit-trigger__word">
              图片
            </span>
          </div>}
          maxAmount={9 - value.length}
          kdtId={window._global.kdtId}
          accept={accept}
          onSuccess={uploadPictureSuccess}
        />
      )}
      </div>;
    }
    return null;
  };
  return <div>
    {mediaType === -1 && (<>
      <div className="media-edit-wrap">
        <Upload
          materials
          className='comment-picture-upload'
          maxSize={10 * 1024 * 1024}
          type="image"
          tokenUrl={`${_global.url.v4}/vis/commom/material/getQiniuAggregateUploadToken.json`}
          fetchUrl={`${_global.url.materials}/shop/fetchPubImg.json`}
          trigger={() => <div className="media-edit-trigger">
            <Icon className="media-edit-trigger__icon" type='plus'></Icon>
            <span className="media-edit-trigger__word">
              图片
            </span>
          </div>}
          // triggerClassName="media-dialog-picture-wrap"
          maxAmount={9}
          onSuccess={uploadPictureSuccess}
        />
        <span className="rc-upload-trigger" onClick={openVideoUpload}>
          <div className="media-edit-trigger">
            <Icon className="media-edit-trigger__icon" type='plus'></Icon>
            <span className="media-edit-trigger__word">
              视频
            </span>
          </div>
        </span>
      </div>
    </>)}
    {mediaType === 2 && getVideoLayout()}
    {mediaType === 0 && getPictureLayout()}
    <div className="media_text_hint">图片最多9张，视频最多1个</div>
  </div>;
};

export default getControlGroup(MediaFieldComponent);
