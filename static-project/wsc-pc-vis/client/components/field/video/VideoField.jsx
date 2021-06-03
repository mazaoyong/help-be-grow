
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Alert, Icon, Notify } from 'zent';
import ajax from 'zan-pc-ajax/lib';
import { VideoUpload } from '@youzan/react-components';

// 视频分片白名单判断
const enableVideoHls = window._global.enable_video_hls;
const maxSize = 3;

class CoverField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasVideo: false,
      videoObj: props.value || {},
    };
  }

  successUpload = data => {
    const props = this.props;
    props.onChange(data);

    this.setState({
      hasVideo: true,
      videoObj: data || {},
    });
  };

  renderhelpVideoText = () => {
    const { tips } = this.props;
    return tips ? (
      <span>{tips}</span>
    ) : (
      <span>
          点击 + 选择视频，视频大小不超过{maxSize}G，建议时长10~30分钟，宽高比16:9，
        <br />
          支持mp4，mov，m4v，flv,x-flv，mkv，wmv，avi，rmvb，3gp格式
      </span>
    );
  };

  // 视频上传提示文案(外部)
  videoHelpDesc = () => {
    const helpDesc = this.props.helpDescs;
    return <p className="c-gray">{helpDesc || this.renderhelpVideoText()}</p>;
  };

  // 视频上传提示文案(内部)
  videoUploadHelpDesc = () => {
    return (
      <span>
        {this.renderhelpVideoText()}
        {enableVideoHls && (
          <p>
            为了提升视频播放流畅度，我们对此处上传的视频做了技术处理，建议不要在知识付费以外的地方使用该视频
          </p>
        )}
      </span>
    );
  };

  openVideoUpload = e => {
    const helpDesc = this.props.helpDescs;
    e.preventDefault();
    const baseUrl = window._global.url.v4;

    const tokenUrl = enableVideoHls
      ? '/vis/commom/material/videoUploadToken.json'
      : '/api/iron/materials/videoUploadToken.json';
    const confirmUrl = enableVideoHls
      ? '/vis/commom/material/confirmVideoUpload.json'
      : '/api/iron/materials/confirmVideoUpload.json';

    const uploadOptions = {
      materials: true,
      tokenUrl: baseUrl + tokenUrl,
      categoryListUrl: `${baseUrl}/api/iron/materials/videoCategoryList.json`,
      materialsListUrl: `${baseUrl}/api/iron/materials/videoList.json`,
      confirmUrl: baseUrl + confirmUrl,
      publishUrl: `${baseUrl}/api/iron/materials/publishVideo.json`,
      maxSize: maxSize * 1024 * 1024 * 1024,
      onSuccess: this.successUpload,
      videoHelpDesc: helpDesc || this.videoUploadHelpDesc(),
      uploadConfig: {
        kdtId: window._global.kdtId,
        fetchUrl: `${baseUrl}/api/iron/materials/shopPubImg.json`,
        tokenUrl: `${baseUrl}/api/iron/materials/shopPubImgUploadToken.json`,
      },
    };

    if (enableVideoHls) {
      uploadOptions.transformData = {
        tokenUrl: data => {
          return {
            api_url: data.uploadApiUrl,
            token: data.uploadToken,
            video_path: data.videoPath, // eslint-disable-line
          };
        },
      };
    }

    VideoUpload.initialize(uploadOptions);
  };

  editVideo = e => {
    e.preventDefault();
    const baseUrl = window._global.url.v4;
    VideoUpload.initialize({
      materials: true,
      value: this.props.value,
      updateUrl: `${baseUrl}/api/iron/materials/updateVideo.json`,
      uploadConfig: {
        kdtId: window._global.kdtId,
        fetchUrl: `${baseUrl}/api/iron/materials/shopPubImg.json`,
        tokenUrl: `${baseUrl}/api/iron/materials/shopPubImgUploadToken.json`,
      },
      maxSize: maxSize * 1024 * 1024 * 1024,
      onSuccess: this.successUpload,
    });
  };

  removeVideo = () => {
    const props = this.props;
    props.onChange({});
    this.setState({
      videoObj: {},
      hasVideo: false,
    });
  };

  refreshVideoStatus = (e, videoObj) => {
    e.preventDefault();
    const baseUrl = window._global.url.v4;
    ajax({
      url: `${baseUrl}/api/iron/materials/videoInfo.json`,
      method: 'GET',
      xhrFields: { withCredentials: true },
      data: { video_id: videoObj.video_id },
    })
      .then(data => {
        this.props.onChange({
          video_id: data.video_id,
          cover_url: data.cover_url,
          status: data.status,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  render() {
    const { hasVideo } = this.state;
    const videoObj = this.props.value || {};
    const status = videoObj.status;
    const defaultCover = 'https://b.yzcdn.cn/wsc/ump/paidcontent/default.png';

    return (
      <div className="update-video-wrapper">
        {hasVideo || videoObj.video_id ? (
          <span className="uploaded-video-block">
            <span className="video-cover-img">
              <img src={videoObj.cover_url || defaultCover} alt="" />
              <Icon type="close-circle" className="close-video" onClick={this.removeVideo} />
            </span>
            {status === 1 ? (
              <a
                href=""
                onClick={e => {
                  this.refreshVideoStatus(e, videoObj);
                }}
                className="edit-video"
              >
                刷新
              </a>
            ) : (
              <a
                href=""
                onClick={e => {
                  this.editVideo(e);
                }}
                className="edit-video"
              >
                  编辑视频
              </a>
            )}
          </span>
        ) : (
          <a className="select-video-entry" href="" onClick={this.openVideoUpload}>
              +
          </a>
        )}
        {this.videoHelpDesc()}
        {// 视频上传完成，开始转码
          status === 1 ? (
            <Alert className="video-error">
              <span>该视频转码、审核中，转码审核通过后生效，可以直接保存</span>
              <a href="" onClick={this.openVideoUpload}>
                {' '}
                重新选择一个视频
              </a>
            </Alert>
          ) : null}
        {// 视频审核失败
          status === 6 ? (
            <Alert className="video-error">
              <Icon type="error-circle" className="error-circle" />
              <span>该视频转码、审核失败，无法正常播放，你可以</span>
              <a href="" onClick={this.openVideoUpload}>
                {' '}
                重新选择一个视频
              </a>
            </Alert>
          ) : null}
        {// 视频等待审核
          status === 5 ? (
            <Alert className="video-error">
              <Icon type="error-circle" className="error-circle" />
              <span>该视频转码、审核中，转码审核通过后生效</span>
            </Alert>
          ) : null}
        {// 视频转码失败
          status === 3 ? (
            <Alert className="video-error">
              <Icon type="error-circle" className="error-circle" />
              <span>该视频转码失败，请重新上传</span>
            </Alert>
          ) : null}
      </div>
    );
  }
}

export default Form.getControlGroup(CoverField);
