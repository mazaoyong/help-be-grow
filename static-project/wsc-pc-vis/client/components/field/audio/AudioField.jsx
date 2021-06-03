
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Icon } from 'zent';
import { Upload } from '@youzan/react-components';
import { isEduShop } from '@youzan/utils-shop';
import { checkPublicBroadLimitAudioUpload } from './api';

const { getControlGroup } = Form;

const byteCount = window.navigator.userAgent.includes('Mac OS X') ? 1000 : 1024;

export class AudioWrap extends Component {
  state = {
    hasAudio: false,
    audioObj: this.props.value,
    // 教育店铺和白名单店铺使用宽泛限制的七牛公开音频上传，允许 audio/* video/*,限制放宽为500M
    broadAudioLimit: isEduShop,
  };

  componentDidMount() {
    // 非教育店铺额外的白名单检查
    if (!isEduShop) {
      checkPublicBroadLimitAudioUpload()
        .then(({ broadAudioLimit }) => {
          this.setState({ broadAudioLimit });
        });
    }
  }

  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(byteCount)), 10);
    return `${Math.round(bytes / Math.pow(byteCount, i), 2)} ${sizes[i]}`;
  }

  uploadSuccess = data => {
    const props = this.props;
    if (data && data[0]) {
      if (props.maxAmount > 1) {
        props.onChange(data);
      } else {
        const obj = data[0];
        let attachUrl = obj.attachment_url;
        attachUrl = attachUrl.replace('http://', 'https://');
        const audioObj = {
          path: attachUrl,
          name: obj.attachment_title,
          size: String(obj.attachment_size),
        };
        props.onChange(audioObj);

        this.setState({
          hasAudio: true,
          audioObj: obj,
        });
      }
    }
  };

  clearAudio = () => {
    const props = this.props;
    const audioObj = {
      path: '',
      name: '',
      size: '',
    };
    this.setState({
      hasAudio: false,
      audioObj,
    });
    props.onChange(audioObj);
  };

  /**
   * 紧急修复：accept使用*通配符,放宽更多音频格式支持，但是提示文案保持原文案不变
   * Fixme：临时丑陋处理方法-使用事件检查来强制修改修提示文案dom，最佳方案是zent + rc组件提供支持
   *
   * @param {Object} e 点击事件对象
   */
  onAudioContainerClick = (e) => {
    try {
      if (!this.state.broadAudioLimit) return;
      if (e.target.classList.value === 'zent-btn-primary zent-btn pull-left' ||
        e.target.classList.value === 'link upload-audio-link'
      ) {
        setTimeout(() => {
          try {
            document.querySelector('.zent-upload-local-tips').textContent =
                          '仅支持amr、 mp3、 mpeg、 wav、 m4a 5种格式，大小不超过500M';
          } catch (e) {}
        }, 100);
      }
    } catch (e) {}
  }

  render() {
    const { hasAudio, broadAudioLimit } = this.state;
    const { value: audioObj = {}, maxAmount = 1 } = this.props;
    const size = this.bytesToSize(audioObj.size || Number(audioObj.attachment_size));

    const trigger = this.props.trigger
      ? this.props.trigger.bind(null, this.onAudioContainerClick) : () => (
        <span>
          <span className="link upload-audio-link" onClick={this.onAudioContainerClick}>
          选择音频
          </span>
          <br />
          <span className="gray upload-audio-tips">
          仅支持amr、 mp3、 mpeg、 wav、 m4a 5种格式，大小不超过{broadAudioLimit ? 500 : 80}M
          </span>
        </span>
      );

    return (
      <div className="upload-audio-wrapper" onClick={this.onAudioContainerClick}>
        <Upload
          materials
          type="voice"
          tokenUrl={
            broadAudioLimit
              ? `${_global.url.v4}/vis/commom/material/getPublicBroadLimitAudioUploadToken.json`
              : `${_global.url.v4}/api/iron/materials/audioUploadToken.json`
          }
          maxSize={broadAudioLimit ? 500 * 1024 * 1024 : 80 * 1024 * 1024}
          timeout={24 * 60 * 60 * 1000}
          maxAmount={maxAmount}
          triggerClassName="upload-audio-trigger"
          accept={
            broadAudioLimit ? 'audio/*, video/*' : 'audio/mp3, audio/amr, audio/mpeg, .wav, .m4a'
          }
          trigger={trigger}
          errorMessages={{ overMaxSize: `文件不能超过${broadAudioLimit ? 500 : 80}M，请调整后重新上传` }}
          imgcdn="https://img.yzcdn.cn"
          onSuccess={this.uploadSuccess}
        />
        {hasAudio || audioObj.name ? (
          <div className="multimedia-display">
            {`${audioObj.name || audioObj.attachment_title}  (${size})`}
            <Icon type="close-circle-o close-audio" onClick={this.clearAudio} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default getControlGroup(AudioWrap);
