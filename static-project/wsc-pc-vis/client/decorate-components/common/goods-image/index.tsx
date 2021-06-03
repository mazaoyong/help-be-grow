import React, { Component } from 'react';
import fullfillImage from '@youzan/utils/fullfillImage';
import includes from 'lodash/includes';
import HelpIcon from '../../../shared/components/help-icon';

import { NOT_SUPPORTTED_GOODS_TYPE, GOODS_TYPE } from '../utils/weapp-not-supported-link';

import './style/index.scss';

interface IGoodsImage {
  data: {
    url: string;
    image_url: string;
    goods_type: string;
    is_check_right: number;
    use_follow: boolean;
  };
  globalConfig: {
    showDesignWeappNotice: boolean;
    url: string;
  };
}

export default class GoodsImage extends Component<IGoodsImage> {
  render() {
    const { data, globalConfig } = this.props;
    const {
      url,
      image_url: imageUrl,
      goods_type: goodsType,
      is_check_right: isCheckRight,
      use_follow: useFollow,
    } = data;

    let help;
    if (globalConfig.showDesignWeappNotice) {
      const goodsTypeNotSupportedInWeapp = includes(NOT_SUPPORTTED_GOODS_TYPE, +goodsType);

      help = goodsTypeNotSupportedInWeapp
        ? `小程序暂不支持${GOODS_TYPE[goodsType]}商品，该商品在小程序不显示`
        : null;

      // 秒杀：关注店铺预约秒杀特殊提示
      if (+isCheckRight && +useFollow) {
        help = '小程序暂不支持关注店铺预约秒杀，该商品在小程序不显示';
      }
    }

    return (
      <div className="rc-design-component-goods-item">
        <a href={url} className="image-url" target="_blank" rel="noopener noreferrer">
          <img
            src={fullfillImage(imageUrl, '!50x50+2x.jpg', globalConfig.url)}
            className="rc-design-component-goods-item__img"
            alt="商品图"
          />
          <HelpIcon help={help} type="error-circle" />
        </a>
      </div>
    );
  }
}
