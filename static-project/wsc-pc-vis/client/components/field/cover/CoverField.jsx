import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload } from '@youzan/react-components';
import get from 'lodash/get';
import { SCENES } from '@youzan/ckt-design';
import { isEduSingleStore } from '@youzan/utils-shop';

import classnames from 'classnames';

class CoverWrap extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // 图片 url
    detail: PropTypes.bool, // 是否需要图片详情
    maxAmount: PropTypes.number,
    accept: PropTypes.string,
    uploadCls: PropTypes.string,
    onChange: PropTypes.func,
    ckt: PropTypes.bool,
  };

  static defaultProps = {
    detail: false,
    maxAmount: 1,
    accept: 'image/gif, image/jpeg, image/png, image/bmp',
    ckt: false,
  };

  onChange = data => {
    if (data && data[0]) {
      const obj = data[0];
      let attachUrl = obj.attachment_url;
      attachUrl = attachUrl.replace('http://', 'https://');
      if (this.props.detail) {
        this.props.onChange({
          picture: obj,
          cover: attachUrl,
        });
      } else {
        this.props.onChange(attachUrl);
      }
    }
  };

  removeImg = () => {
    this.onChange([
      {
        attachment_url: '',
      },
    ]);
  };

  render() {
    const { value, maxAmount, accept, ckt, ...rest } = this.props;
    const coverSrc = rest.detail ? get(value, 'cover', '') : value;
    const uploadCls = classnames({
      'upload-cover-ele': true,
      [this.props.uploadCls]: true,
    });

    const coverCls = classnames({
      'cover-img': true,
      'cover-img-remove': rest.showRemove,
    });

    const cktConfig = ckt ? {
      ckt: isEduSingleStore,
      cktProps: {
        auth: true,
        scene: SCENES.COURSE_COVER,
        chuangKitDesignOption: {
          show_history_design: 1,
        },
      },
    } : {};

    return (
      <div className="upload-cover-wrapper">
        {coverSrc && (
          <div className={coverCls}>
            <div className="cover-close-icon" onClick={this.removeImg} />
            <img src={coverSrc} alt="封面" />
          </div>
        )}
        <Upload
          materials
          type="image"
          maxSize={3 * 1024 * 1024}
          tokenUrl={`${_global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
          fetchUrl={`${_global.url.materials}/shop/fetchPubImg.json`}
          className={uploadCls}
          triggerClassName={coverSrc ? 'upload-text-trigger' : 'rc-upload-trigger'}
          maxAmount={maxAmount}
          kdtId={window._global.kdtId}
          accept={accept}
          onSuccess={this.onChange}
          {...cktConfig}
          {...rest}
        />
      </div>
    );
  }
}

export default CoverWrap;
