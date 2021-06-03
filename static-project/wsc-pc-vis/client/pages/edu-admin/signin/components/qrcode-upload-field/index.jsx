
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Upload } from '@youzan/react-components';

import './styles.scss';

const { getControlGroup } = Form;

export class QrCodeUploadWrapper extends PureComponent {
  render() {
    const { value } = this.props;
    if (value) {
      return (
        <span className="edu-qrcode-upload_wrapper">
          <img width="80" height="80" src={value} />
          <span className="edu-qrcode-upload_a" onClick={this.handleRemove}>
            ×
          </span>
        </span>
      );
    }
    return (
      <Upload
        maxSize={1 * 1024 * 1024}
        maxAmount={1}
        materials
        kdtId={window._global.kdtId}
        tips="请上传300*300像素的清晰二维码图片，保证二维码识别效率。"
        imgcdn="https://img.yzcdn.cn"
        tokenUrl="https://materials.youzan.com/shop/pubImgUploadToken.json"
        onSuccess={this.handleAdd}
      />
    );
  }

  handleRemove = () => {
    this.props.onChange('');
  };

  handleAdd = data => {
    const url = this.replaceHttpsPrefix(data && data[0] && data[0].attachment_url);
    this.props.onChange(url);
  };

  replaceHttpsPrefix(url) {
    if (/http:/.test(url)) {
      return (url || '').replace('http', 'https');
    }
    return url;
  }
}

export default getControlGroup(QrCodeUploadWrapper);
