import { Upload } from '@youzan/react-components';
import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';

export interface IProps {
  value: string;
  onChange: (v: string) => void;
}

class DeliveryImg extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  handleUpload = imgs => {
    this.props.onChange(imgs[0].attachment_full_url);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="custom-delivery-img">
        {value && (
          <div className="img-wrapper">
            <img src={value} alt="配送范围图片" />
          </div>
        )}
        <Upload
          materials
          type="image"
          maxSize={1024 * 1024}
          maxAmount={1}
          accept="image/gif, image/jpeg, image/png"
          onSuccess={this.handleUpload}
          triggerClassName={!value ? 'rc-upload-trigger' : 'custom-rc-upload-trigger'}
          kdtId={_global.kdtId}
          tokenUrl="https://materials.youzan.com/shop/pubImgUploadToken.json"
          fetchUrl="/v4/api/iron/materials/shopPubImg.json"
        />
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(DeliveryImg);
