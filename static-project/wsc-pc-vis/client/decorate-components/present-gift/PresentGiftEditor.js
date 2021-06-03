/*
 * 我要送礼社群版 编辑区
 * @author: yugang@youzan.com
 */

import React from 'react';
import { Icon } from 'zent';

import { DesignEditor } from '../editor-base/design-editor';
import Image from '../common/upload-image';
import ComponentTitle from '../common/component-title';
import { COM_STATUS } from '../common/constants';

// captainUI中ImageAd所需参数，5：轮播，6：横向滑动，7：从上而下显示
const SHOW_METHOD = '7';

export default class PresentGiftEditor extends DesignEditor {
  static getInitialValue() {
    return {
      type: 'present_gift',
      data: {
        show_method: SHOW_METHOD, // 显示方式
        images: [], // 图片集合
      },
    };
  }

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/1ba9c178a6c6166091187b56e8682591.png',
    type: 'present_gift',
    name: '我要送礼',
    description: '我要送礼',
    maxNum: 1,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  /**
   * 数据校验
   * @param {Object} data: 当前组件的相关参数
   *        data.type: 组件类型
   *        data.data: 组件数据
   */
  static validate(data) {
    return new Promise(resolve => {
      const errors = {};
      const { images } = data.data;
      if (!images || images.length === 0) errors.content = '请上传图片';
      resolve(errors);
    });
  }

  // 修改props上的数据
  propsChange = this.onCustomInputChange('data');

  // 获取图片区代码块
  getImgWrapper() {
    // 图片集合
    const _imagesArr = this.props.value.data.images;

    // 无图片样式
    if (_imagesArr.length === 0) {
      return (
        <article
          className="default-white-space"
          onClick={() => {
            this.uploadImg();
          }}
        >
          <header>
            <Icon className="rc-design-editor-card-add-icon" type="plus" />
            添加一个背景图
          </header>
          <p>建议尺寸750X350像素</p>
        </article>
      );
    }

    // 当前需求只需要 上传一张图片，后续可扩展
    // 使用背景图展示，为了保证图片的舒适性
    const _style = {
      backgroundImage: `url(${_imagesArr[0].image_url})`,
    };
    return (
      <article className="img-preview-wrapper" style={_style}>
        <p
          onClick={() => {
            this.uploadImg();
          }}
        >
          更改图片
        </p>
      </article>
    );
  }

  // 唤起图片上传组件
  uploadImg() {
    const options = {
      callback: this.uploadImageCallback.bind(this),
      maxAmount: 1,
      imgcdn: '',
    };
    Image.initialize(options);
  }

  /**
   * 上传图片成功回调
   * @param {Array} imgArr: 上传成功的图片集合
   */
  uploadImageCallback(imgArr) {
    const data = {
      show_method: SHOW_METHOD,
      images: [
        {
          image_url: imgArr[0].attachment_full_url,
        },
      ],
    };
    this.propsChange(data);
  }

  render() {
    const { validation } = this.props;

    return (
      <div className="rc-design-component-notice-editor">
        <ComponentTitle
          name="我要送礼"
          url="https://www.youzan.com/v2/trade/giftplug/list"
          noticeMsg="仅支持在小程序中显示"
        />

        <section className="present-gift-img-wrapper">{this.getImgWrapper()}</section>
        <p className="present-gift-error">{validation.content}</p>
      </div>
    );
  }
}
