
import { Form } from '@zent/compat';
import React, { Component } from 'react';

import { EduVideoUpload } from '@youzan/ebiz-components';

const { Field } = Form;
const { VideoUploadFieldWithControlGroup } = EduVideoUpload;

export default class VideoWrap extends Component {
  render() {
    let { label, videoModel } = this.props;
    return (
      <Field
        name="videoModel"
        label={label}
        value={videoModel}
        component={VideoUploadFieldWithControlGroup}
        tip="目前仅支持在手机端播放，建议时长2-10分钟，建议视频宽高比16:9"
      />
    );
  }
}
