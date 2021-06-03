
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Upload } from '@youzan/react-components';

import './styles.scss';

const { getControlGroup } = Form;

class ImageUploadField extends PureComponent {
  render() {
    const { value } = this.props;
    if (value) {
      return (
        <span className="certificate-upload_wrapper">
          <img width="80" height="80" src={value} />
          <span className="certificate-upload_a" onClick={this.handleRemove}>
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
        imgcdn="https://img.yzcdn.cn"
        tokenUrl="https://materials.youzan.com/shop/pubImgUploadToken.json"
        onSuccess={this.handleAdd}
      />
    );
  }

  handleAdd = data => {
    const value = this.replaceHttpsPrefix(data && data[0] && data[0].attachment_url);
    this.props.onChange(value);
  }

  handleRemove = data => {
    this.props.onChange('');
  }

  replaceHttpsPrefix(url) {
    return (url || '').replace('http:', 'https:');
  }
}

export default getControlGroup(ImageUploadField);
