import React from 'react';
import { Radio, Input, Checkbox } from 'zent';
import assign from 'lodash/assign';
import fullfillImage from '@youzan/utils/fullfillImage';
import { DesignEditor } from '../editor-base/design-editor';
import { ControlGroup, ComponentTitle, Control, Divider } from '../common/';
import Image from '../common/upload-image';
import ImageEditor from '../common/image-editor';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import { RELOAD } from './consts';

const { Group: RadioGroup } = Radio;

const prefix = 'decorate-audio-editor';

const AUDIO_STYLE_OPTIONS = [
  { value: '0', icon: 'audio-player' },
  { value: '1', icon: 'audio-weixin' },
  { value: '2', icon: 'audio-player' },
];

const STYLE_TEXT = {
  0: '微信对话框样式',
  1: '播放器',
  2: '简易播放器',
};

export const ALIGN_TEXT = {
  left: '居左',
  right: '居右',
};

// 对齐方式可选项
const ALIGN_OPTIONS = [
  { value: 'left', icon: 'align-left' },
  { value: 'right', icon: 'align-right' },
];

export default class AudioEditor extends DesignEditor {
  static defaultProps = {
    uploadConfig: {},
    audioUploadConfig: {},
  };

  constructor(props) {
    super(props);
    this.state = assign({}, this.state, {
      isCanPlay: false,
      isPlaying: false,
    });
  }

  handleImageChange = data => {
    this.onCustomInputChange('avatar')(data.attachment_url);
  };

  handleAudioChange = data => {
    const audioSrc = data[0].attachment_file || data[0].attachment_url;
    this.setState({ isCanPlay: false });
    this.onCustomInputChange('audio')(audioSrc);
  };

  handleInnerInputChange = e => {
    e.stopPropagation();
    this.onInputChange(e);
  };

  handleCheckboxChange = e => {
    e.stopPropagation();
    const loop = e.target.checked ? '1' : '0';
    this.onCustomInputChange('loop')(loop);
  };

  playAudio = () => {
    const { isCanPlay, isPlaying } = this.state;
    if (!isCanPlay) {
      return;
    }
    if (isPlaying) {
      this.audioNode.pause();
    } else {
      this.audioNode.play();
    }
    this.setState({ isPlaying: !isPlaying });
  };

  handleAudioCanPlay = () => {
    this.setState({ isCanPlay: true });
  };

  handleAudioEnd = () => {
    this.setState({ isPlaying: false });
  };

  handleAudioEdit = () => {
    const { globalConfig, audioUploadConfig } = this.props;
    const options = {
      type: 'voice',
      maxAmount: 1,
      maxSize: 40 * 1024 * 1024,
      uploadConfig: audioUploadConfig,
      accept: 'audio/amr, audio/mp3, audio/mpeg',
      callback: this.handleAudioChange,
      imgcdn: globalConfig.url && (globalConfig.url.imgqn || globalConfig.url.imgcdn),
    };
    Image.initialize(options);
  };

  useDefaultImage = () => {
    this.onCustomInputChange('avatar')(this.getDefaultAvatar());
  };

  getDefaultAvatar() {
    const { globalConfig } = this.props;
    return globalConfig.mp_data && globalConfig.mp_data.logo;
  }

  render() {
    const {
      value: { reload, style, audio, title, loop, avatar, bubble },
      showError,
      validation: { titleError, audioError },
      globalConfig,
      uploadConfig,
    } = this.props;
    const { isPlaying } = this.state;

    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.audio} 版本及以上）`
        : '';

    return (
      <div className={`${prefix}`}>
        <ComponentTitle name="语音" noticeMsg={noticeMsg} />
        <ControlGroup
          label="音频:"
          required
          showError={showError && !!audioError}
          error={audioError}
          focusOnLabelClick={false}
        >
          {audio ? (
            <div className={`${prefix}__audio`}>
              {audio && (
                <span className={`${prefix}__audio-action`} onClick={this.playAudio}>
                  <i
                    className={
                      isPlaying ? `${prefix}__audio-action-stop` : `${prefix}__audio-action-play`
                    }
                  />
                  {isPlaying ? '暂停' : '点击播放'}
                </span>
              )}
              <audio
                ref={audioNode => (this.audioNode = audioNode)}
                src={fullfillImage(audio, '!64k.mp3', globalConfig.url)}
                onCanPlay={this.handleAudioCanPlay}
                onEnded={this.handleAudioEnd}
              >
                (对不起，你的浏览器不支持音频播放)
              </audio>
              {audio && (
                <a className={`${prefix}__audio-rechoose`} onClick={this.handleAudioEdit}>
                  重新选择
                </a>
              )}
            </div>
          ) : (
            <a className={`${prefix}__audio-choose`} onClick={this.handleAudioEdit}>
              选择音频
            </a>
          )}
        </ControlGroup>
        <Control
          label="选择样式"
          valueMap={STYLE_TEXT}
          name="style"
          options={AUDIO_STYLE_OPTIONS}
          value={style}
          onChange={this.onInputChange}
        />
        <div className="controls-card">
          {style === '0' && (
            <div>
              <ControlGroup
                label="头像:"
                labelAlign="top"
                block
                bgColored="#f7f8fa"
                focusOnLabelClick={false}
              >
                <ImageEditor
                  globalConfig={globalConfig}
                  uploadConfig={uploadConfig}
                  imageUrl={avatar || this.getDefaultAvatar()}
                  onChange={this.handleImageChange}
                />
                <div className={`${prefix}__avatar-desc`}>
                  <div className={`${prefix}__avatar-desc-tip`}>
                    建议尺寸80x80像素, 若不设置, 默认使用店铺logo
                  </div>
                  <a onClick={this.useDefaultImage} className={`${prefix}__avatar-desc-shop`}>
                    使用店铺logo
                  </a>
                </div>
              </ControlGroup>
              <Control
                label="气泡位置"
                valueMap={ALIGN_TEXT}
                name="bubble"
                options={ALIGN_OPTIONS}
                value={bubble}
                onChange={this.onInputChange}
              />
            </div>
          )}
          {(style === '1' || style === '2') && (
            <div>
              <ControlGroup
                label="标题"
                showError={showError && !!titleError}
                block
                error={titleError}
              >
                <Input
                  name="title"
                  placeholder="标题名称"
                  value={title}
                  onChange={this.handleInnerInputChange}
                />
              </ControlGroup>
              <ControlGroup
                label="开启循环播放"
                value={Number(loop) ? '开启' : '不开启'}
                focusOnLabelClick={false}
                className="no-mb"
              >
                <Checkbox
                  checked={!!Number(loop)}
                  onChange={this.handleCheckboxChange}
                  name="loop"
                />
              </ControlGroup>
            </div>
          )}
        </div>
        <Divider />
        <ControlGroup
          label="播放:"
          labelAlign="top"
          focusOnLabelClick={false}
          className={`${prefix}__reload-control`}
        >
          <RadioGroup value={reload} onChange={this.onInputChange}>
            {RELOAD.map(({ value, text }, index) => {
              return (
                <Radio key={index} name="reload" value={value}>
                  {text}
                </Radio>
              );
            })}
          </RadioGroup>
        </ControlGroup>
      </div>
    );
  }

  static info = {
    type: 'audio',
    name: '语音',
    description: '语音',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/2ba124e52d20df08c9b9d3d41f30ff5b.png',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      // 播放；1 暂停后再恢复播放时，从头开始， 0 暂停后再恢复播放时，从暂停位置开始
      reload: '1',
      // 样式；0 模仿微信对话样式， 1 播放器 2 简易播放器
      style: '0',
      // 音频
      audio: '',
      // 标题
      title: '',
      // 循环
      loop: '0',
      // 头像, 空表示使用店铺logo
      avatar: '',
      // 气泡
      bubble: 'left',
      // 类型
      type: 'audio',
    };
  }

  static validate(value) {
    const { audio, title, style } = value;
    return new Promise(resolve => {
      const errors = {};
      if (!audio) {
        errors.audioError = '必须选择一个音频文件';
      }
      if (style === '1') {
        if (!title) {
          errors.titleError = '标题不能为空';
        }
      }
      resolve(errors);
    });
  }
}
