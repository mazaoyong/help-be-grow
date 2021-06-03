import React, { Component } from 'react';
import { Icon } from 'zent';
import head from 'lodash/head';
import cx from 'classnames';
import fullfillImage from '@youzan/utils/fullfillImage';
import Image from '../upload-image';
import bem from '../../utils/bem';
import './style/index.scss';

const b = bem('rc-design-common-choice-image-component');

export default class ImageEditor extends Component {
  static defaultProps = {
    globalConfig: {},
    uploadConfig: {},
  };

  uploadImageCallback = (index, data) => {
    this.props.onChange(head(data), index);
  };

  uploadImage = ev => {
    const { index } = ev.currentTarget.dataset;
    const { globalConfig, uploadConfig, onEdit } = this.props;

    if (onEdit) {
      onEdit(index);
      return;
    }

    const options = {
      uploadConfig,
      callback: this.uploadImageCallback.bind(this, index),
      maxAmount: 1,
      imgcdn: globalConfig.url && (globalConfig.url.imgcdn || globalConfig.url.imgqn),
    };
    Image.initialize(options);
  };

  handleDelete = ev => {
    const { index } = ev.currentTarget.dataset;
    this.props.onDelete(+index);
  };

  render() {
    const {
      imageUrl,
      images,
      className,
      raised = false,
      addText = '添加图片',
      error,
      globalConfig,
      showError,
    } = this.props;
    const errorVisible = showError && error;
    let list;

    if (Array.isArray(images)) {
      list = images;
    } else {
      list = [{ url: imageUrl }];
    }

    return (
      <div className={cx(b(), className, { [b(['raised'])]: raised })}>
        {list.map((item, index) => (
          <div className={b('wrap')} key={index}>
            {item.url ? (
              <div className="has-choosed-image">
                <img
                  className="thumb-image"
                  src={fullfillImage(item.url, '!100x100+2x.jpg', globalConfig.url)}
                  alt=""
                  width="80"
                  height="80"
                />
                <span className="modify-image" data-index={index} onClick={this.uploadImage}>
                  更换图片
                </span>
                {item.canDelete && (
                  <Icon
                    className={b('delete')}
                    type="close-circle"
                    data-index={index}
                    onClick={this.handleDelete}
                  />
                )}
              </div>
            ) : (
              <div className="has-not-choose-image" data-index={index} onClick={this.uploadImage}>
                <Icon type="plus" className="plus-icon" />
                {addText && <div>{addText}</div>}
              </div>
            )}
            {item.desc && <span className={b('desc')}>{item.desc}</span>}
          </div>
        ))}

        {errorVisible && <div className="has-error">{error}</div>}
      </div>
    );
  }
}
