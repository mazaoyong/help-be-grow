import React from 'react';
import { Input, Radio, Notify, Icon } from 'zent';
import fullfillImage from '@youzan/utils/fullfillImage';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { DesignEditor } from '../editor-base/design-editor';
import ControlGroup from '../common/control-group';
import ajax from 'zan-pc-ajax';
import { VideoUpload } from '@youzan/react-components';
import { COM_STATUS } from '../common/constants';

import ImageEditor from '../common/image-editor';
import ComponentTitle from '../common/component-title';

const RadioGroup = Radio.Group;

const videoConfig = {
  maxSize: 100 * 1024 * 1024,
  videoMaxLenTxt: '在5分钟以  内',
};

export default class VideoEditor extends DesignEditor {
  static defaultProps = {
    uploadConfig: {},
    audioUploadConfig: {},
  };

  // 改变封面图
  handleChangeImage = image => {
    const { onChange } = this.props;
    onChange({
      surfacePlotImage: image.attachment_url,
    });
    this.setMetaProperty('surfacePlotImage', 'dirty');
  };

  addVideo = () => {
    const { uploadConfig, onChange } = this.props;
    VideoUpload.initialize({
      uploadConfig,
      ...videoConfig,
      materials: true,
      onSuccess: data => {
        onChange({
          video: data,
        });
        this.setMetaProperty('video', 'dirty');
      },
    });
  };

  // 删除视频
  deleteVideo = () => {
    this.props.onChange({
      video: {},
    });
    this.setMetaProperty('video', 'dirty');
  };

  // 编辑视频
  editVideo = () => {
    const { uploadConfig, value, onChange } = this.props;
    const { video } = value;

    VideoUpload.initialize({
      uploadConfig,
      ...videoConfig,
      materials: true,
      value: video,
      onSuccess: data => {
        onChange({
          video: data,
        });
        this.setMetaProperty('video', 'dirty');
      },
    });
  };

  // 刷新视频
  refreshVideo = () => {
    const {
      value: { video },
    } = this.props;

    ajax({
      url: `${window._global.url.materials}/video/videoInfo.json`,
      method: 'GET',
      xhrFields: {
        withCredentials: true,
      },
      data: {
        video_id: video.video_id,
      },
    })
      .then(data => {
        this.props.onChange({
          video_model: data,
          video_id: video.video_id,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  /**
   * 获取视频区域的视频状态提示
   */
  getVideoNoticeText(video) {
    let noteText = null;

    // 隐藏编辑视频按钮
    let videoLink = null;
    /* let videoLink = (
      <a href="javascript:;" onClick={this.editVideo}>
        编辑视频
      </a>
    ); */

    const helpDesc = <p className="editor-bottom-help-desc">建议视频宽高比16:9</p>;

    if (video.status === 1 || video.status === 2 || video.status === 5) {
      videoLink = (
        <a href="javascript:;" onClick={this.refreshVideo}>
          刷新
        </a>
      );
      noteText = (
        <div className="note">
          <i />
          <span>该视频转码、审核中，手机端会屏蔽视频，转码审核通过后可正常播放</span>
        </div>
      );
    } else if (video.status === 3) {
      videoLink = (
        <a href="javascript:;" onClick={this.addVideo}>
          更换
        </a>
      );
      noteText = (
        <div className="note">
          <i />
          <span>
            该视频转码失败，手机端会屏蔽视频，你可以
            <a onClick={this.addVideo}>重新选择一个视频</a>
          </span>
        </div>
      );
    } else if (video.status === 6) {
      const noticeUrl = `${_global.url.www}/notice/dashboard#2`;
      videoLink = (
        <a href="javascript:;" onClick={this.addVideo}>
          更换
        </a>
      );
      noteText = (
        <div className="note">
          <i />
          <span>
            该视频审核失败，手机端会屏蔽视频，你可以
            <a onClick={this.addVideo}>重新选择一个视频</a>或
            <a href={noticeUrl} rel="noopener noreferrer" target="_blank">
              登录商家后台通知中心查看
            </a>
          </span>
        </div>
      );
    }

    // 已删除
    if (video.is_published === 2) {
      videoLink = (
        <a href="javascript:;" onClick={this.addVideo}>
          更换
        </a>
      );
      noteText = (
        <div className="note">
          <i />
          <span>
            该视频已被删除，无法正常播放，你可以 <a onClick={this.addVideo}>重新选择一个视频</a>
          </span>
        </div>
      );
    }

    return {
      videoLink,
      helpDesc,
      noteText,
    };
  }

  renderVideoContent() {
    const {
      value: { video },
    } = this.props;
    const { videoLink, helpDesc, noteText } = this.getVideoNoticeText(video);

    return (
      <div>
        {helpDesc}
        <div
          className={cx({
            'video-cover': true,
            'is-success': !!video.cover_url,
          })}
        >
          <span className="video-close" onClick={this.deleteVideo}>
            x
          </span>
          {video.cover_url ? (
            <div
              className="image-cover"
              style={{
                backgroundImage: `url(${fullfillImage(video.cover_url, '!120x120.jpg')}`,
              }}
            />
          ) : (
            <div className="empty-cover" />
          )}
        </div>
        {videoLink}
        {noteText}
      </div>
    );
  }

  render() {
    const {
      value,
      showError,
      validation: { surfacePlotImageError, videoError, surfacePlotError },
      globalConfig,
      uploadConfig,
    } = this.props;
    const { video, surfacePlot, surfacePlotImage, customUrl, sourceFrom = 1 } = value;
    const { helpDesc } = this.getVideoNoticeText(video);

    return (
      <div className="decorate-video-editor">
        <ComponentTitle name="视频" noticeMsg="小程序 v2.9.5 及以上版本支持" />
        <ControlGroup label="视频:" labelAlign="top" focusOnLabelClick={false}>
          <RadioGroup value={sourceFrom} onChange={this.onInputChange} inline>
            <Radio name="sourceFrom" value={1}>
              选择视频
            </Radio>
            <Radio name="sourceFrom" value={2}>
              粘贴视频地址
            </Radio>
          </RadioGroup>
        </ControlGroup>

        <ControlGroup
          showError={showError && !!videoError}
          error={videoError}
          block
          bgColored
          className="decorate-video-editor__video-info"
        >
          <div className="video-edit-wrap">
            {sourceFrom === 1 && video.video_id > 0 && this.renderVideoContent()}

            {sourceFrom === 1 &&
              !(video.video_id > 0) && (
                <div>
                  {helpDesc}
                  <a className="add-video" href="javascript:;" onClick={this.addVideo}>
                    <Icon type="plus" />
                  </a>
                </div>
              )}

            {sourceFrom === 2 && (
              <div>
                <p className="video-edit-tips">
                  <span className="suspension-window-editor-notice" />
                  小程序 v2.15 及以上版本支持仅支持.mp4格式的视频源地址
                </p>
                <Input
                  name="customUrl"
                  value={customUrl}
                  maxLength="200"
                  placeholder="此处粘贴视频播放地址"
                  onChange={this.onInputChange}
                  onBlur={this.onInputBlur}
                />
              </div>
            )}
          </div>
        </ControlGroup>

        <ControlGroup
          label="封面图:"
          labelAlign="top"
          focusOnLabelClick={false}
          className="shopcart-config"
        >
          {sourceFrom === 1 && (
            <RadioGroup value={surfacePlot} onChange={this.onInputChange}>
              <Radio name="surfacePlot" value={1}>
                原视频封面
              </Radio>
              <Radio name="surfacePlot" value={2}>
                自定义封面
              </Radio>
            </RadioGroup>
          )}
        </ControlGroup>

        {(surfacePlot === 2 || sourceFrom === 2) && (
          <ControlGroup
            className="decorate-video-editor__poster-info"
            showError={showError && !!surfacePlotError}
            error={surfacePlotError}
          >
            <div className="surface-plot-image-editor">
              <p className="image-editor-tips">建议图片宽高比16:9</p>
              <ImageEditor
                globalConfig={globalConfig}
                uploadConfig={uploadConfig}
                className="image-editor"
                imageUrl={surfacePlotImage}
                onChange={this.handleChangeImage}
                showError={showError && !!surfacePlotImageError}
                error={surfacePlotImageError}
              />
            </div>
          </ControlGroup>
        )}
      </div>
    );
  }

  static designType = 'video';
  static designDescription = <span className="weapp-design-components-new-label">视频</span>;

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/55bb6a2513b67056ac39d1334185a453.png',
    type: 'video',
    name: '视频',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static getInitialValue() {
    return {
      type: 'video',
      // 视频源(1：后台选取，2：用户自己填写链接)
      sourceFrom: 1,
      // 自定义视频链接
      customUrl: '',
      // 视频对象
      video: {},
      // 封面图 (1：原视频封面，2：自定义封面)
      surfacePlot: 1,
      // 封面图地址
      surfacePlotImage: '',
    };
  }

  static validate(value) {
    const { video, customUrl, sourceFrom, surfacePlot, surfacePlotImage } = value;
    return new Promise(resolve => {
      const errors = {};
      if (sourceFrom === 1 && isEmpty(video)) {
        errors.videoError = '请添加视频';
      }

      if (sourceFrom === 2) {
        if (isEmpty(customUrl)) {
          errors.videoError = '请填写视频地址';
        }

        if (customUrl && !/\.mp4$|\.mp4\?/.test(customUrl)) {
          errors.videoError = '不支持此格式的视频地址';
        }
      }

      if ((surfacePlot === 2 || sourceFrom === 2) && isEmpty(surfacePlotImage)) {
        errors.surfacePlotError = '请添加封面';
      }

      resolve(errors);
    });
  }
}
