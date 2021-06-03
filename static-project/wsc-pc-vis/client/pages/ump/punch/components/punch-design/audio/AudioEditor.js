import React from 'react';
import { Radio, Input, Checkbox } from 'zent';
import assign from 'lodash/assign';
import fullfillImage from 'zan-utils/lib/fullfillImage';

import { DesignEditor, ControlGroup } from '@zent/design/es/editor/DesignEditor';
import Image from 'components/design/common/upload-image';
import ComponentTitle from 'components/design/common/component-title';
import {
  WEAPP_VERSION_MAP,
  IS_WEAPP_SETTING,
} from 'components/design/common/config';
import { RELOAD } from './consts';

const { Group: RadioGroup } = Radio;

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
    const audioSrc = data[0].attachment_url || data[0].attachment_file;
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
    this.setState({
      isPlaying: false,
    });
    this.audioNode.pause();
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
      value: { reload, audio, title, loop },
      showError,
      validation: { titleError, audioError },
      globalConfig,
    } = this.props;
    const { isPlaying } = this.state;

    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.audio} 版本及以上）`
        : '';

    return (
      <div className="rc-design-component-audio-editor">
        <ComponentTitle name="语音" noticeMsg={noticeMsg} />
        <ControlGroup
          label="音频:"
          showError={showError && !!audioError}
          error={audioError}
          focusOnLabelClick={false}
        >
          <div>
            {audio && (
              <span className="rc-design-component-audio-editor__audio" onClick={this.playAudio}>
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
            {audio ? (
              <a onClick={this.handleAudioEdit}>重新选择</a>
            ) : (
              <a onClick={this.handleAudioEdit}>选择音频</a>
            )}
          </div>
        </ControlGroup>
        <div className="controls-card">
          <ControlGroup label="标题:" showError={showError && !!titleError} error={titleError}>
            <Input name="title" value={title} onChange={this.handleInnerInputChange} />
          </ControlGroup>
          <ControlGroup label="循环:" focusOnLabelClick={false} className="no-mb">
            <Checkbox checked={!!Number(loop)} onChange={this.handleCheckboxChange}>
              开启循环播放
            </Checkbox>
          </ControlGroup>
        </div>
        <ControlGroup
          label="播放:"
          labelAlign="top"
          focusOnLabelClick={false}
          className="rc-design-component-audio-editor__reload-control"
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

  static designType = 'audio';
  static designDescription = <span className="weapp-design-components-new-label">语音</span>;

  static getInitialValue() {
    return {
      // 播放；1 暂停后再恢复播放时，从头开始， 0 暂停后再恢复播放时，从暂停位置开始
      reload: '1',
      // 样式；0 模仿微信对话样式， 1 播放器 2 简易播放器
      style: '1',
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
