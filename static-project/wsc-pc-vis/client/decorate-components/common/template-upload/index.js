import React, { Component } from 'react';
import Upload from 'shared/components/upload';
import fullfillImage from '@youzan/utils/fullfillImage';
import { ControlGroup } from '@zent/design/es/editor/DesignEditor';

const uploadOptions = {
  kdtId: window._global.kdt_id,
  maxAmount: 1,
  materials: true,
  accept: 'image/jpeg, image/png',
  triggerClassName: 'custom-upload-trigger',
  uploadTokenType: 'shopImg',
};

export default class TemplateUpload extends Component {
  onUploadSuccess = data => {
    const { attachment_url: attachmentUrl } = data[0];
    const { onSuccess } = this.props;
    onSuccess && onSuccess(attachmentUrl);
  };

  render() {
    const { defaultImageUrl } = this.props;
    if (+window._global.is_design_template !== 1) return null;

    return (
      <ControlGroup label="默认图片:" focusOnLabelClick={false}>
        <Upload
          {...uploadOptions}
          onSuccess={this.onUploadSuccess}
          className="rc-design-component-upload-custom"
        >
          {defaultImageUrl ? (
            <div className="upload-already">
              <img src={fullfillImage(defaultImageUrl, '!50x50+2x.jpg')} alt="广告图片" />
              <p>更换图片</p>
            </div>
          ) : (
            <div className="image-add">
              <i className="icon-add" />
              添加图片
            </div>
          )}
        </Upload>
      </ControlGroup>
    );
  }
}
