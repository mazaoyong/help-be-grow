import React, { PureComponent } from 'react';
import { Upload } from '@youzan/react-components';
import fullfillImage from '@youzan/utils/fullfillImage';
import { Form } from '@zent/compat';

export interface IProps {
  value: string;
  onChange: (v: string) => void;
}
/**
 * 自提点照片字段组件
 */
class SelfFetchImage extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  handleUpload = data => {
    const images = data.map(item => {
      return item.attachment_full_url;
    });
    const oldImages = this.props.value ? this.props.value + ',' : '';
    const newValue = oldImages + images.join(',');
    this.props.onChange(newValue);
  };
  removeImage = (index: number) => {
    const images = this.getImages();
    images.splice(index, 1);
    const newValue = images.join(',');
    this.props.onChange(newValue);
  };
  getImages = () => {
    const { value } = this.props;
    let images: string[] = [];
    if (value) {
      images = value.split(',');
    }
    return images;
  };
  render() {
    const kdtId = _global.kdtId;
    const images = this.getImages();
    const imgNodes = images.map((img, index) => {
      return (
        <div key={img + index} className="img-wrapper">
          <img src={fullfillImage(img, '!160x160.jpg')} alt="自提点照片" />
          <a className="delete-picture-btn" onClick={this.removeImage.bind(this, index)}>
            ×
          </a>
        </div>
      );
    });
    return (
      <div className="custom-self-fetch-img">
        {images.length > 0 ? imgNodes : null}
        {images.length >= 4 ? null : (
          <Upload
            kdtId={kdtId}
            materials
            type="image"
            maxSize={1024 * 1024}
            maxAmount={4 - images.length}
            accept="image/gif, image/jpeg, image/png"
            onSuccess={this.handleUpload}
            tokenUrl="https://materials.youzan.com/shop/pubImgUploadToken.json"
            fetchUrl="/v4/api/iron/materials/shopPubImg.json"
          />
        )}
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(SelfFetchImage);
