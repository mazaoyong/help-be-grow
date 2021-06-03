
import { Form } from '@zent/compat';
import { Upload } from '@youzan/react-components';
import React, { Component } from 'react';

import './style.scss';

const { getControlGroup } = Form;

const defaultProps = {
  accept: 'audio/mp3, audio/amr, audio/mpeg',
  maxAmount: 1,
  maxSize: 80 * 1024 * 1024, // 80MB
  timeout: 24 * 60 * 60 * 1000,
  tokenUrl: `${_global.url.v4}/api/iron/materials/audioUploadToken.json`,
};

// 音频详情
export interface IAudioDetail {
  id: string;
  path: string;
  name: string;
  size: number;
}

interface IAudioProps<T extends AudioValueType, M> {
  value: T;
  maxAmount: M;
  triggerClassName?: string;
  onChange: (value: AudioValueType) => void;
}

type AudioValueType = IAudioDetail | IAudioDetail[];

export type AudioProps = typeof defaultProps &
  (IAudioProps<IAudioDetail, 1> | IAudioProps<IAudioDetail[], number>);

class AudioWrap extends Component<AudioProps, {}> {
  static readonly defaultProps = defaultProps;

  uploadSuccess = data => {
    const { maxAmount } = this.props;

    let audios: IAudioDetail[] = [];
    if (data && Array.isArray(data)) {
      audios = data.map(item => ({
        id: item.attachment_id,
        name: item.attachment_title,
        path: item.attachment_url.replace('http://', 'https://'),
        size: item.attachment_size,
      }));
    }

    if (maxAmount === 1) {
      this.props.onChange(audios[0]);
    } else {
      this.props.onChange(audios);
    }
  };

  render() {
    const { tokenUrl, maxAmount, maxSize, timeout, children, accept } = this.props;

    return (
      <div className="upload-audio-wrapper">
        <Upload
          materials
          type="voice"
          token={tokenUrl}
          maxSize={maxSize}
          time={timeout}
          maxAmount={maxAmount}
          triggerClassName="upload-audio-trigger"
          accept={accept}
          trigger={() => children}
          imgcdn="https://img.yzcdn.cn"
          onSuccess={this.uploadSuccess}
        />
      </div>
    );
  }
}

export default getControlGroup(AudioWrap as any);
