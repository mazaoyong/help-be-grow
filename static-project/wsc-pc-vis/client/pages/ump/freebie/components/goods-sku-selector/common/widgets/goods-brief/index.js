import React from 'react';
import propTypes from 'prop-types';
import accDiv from '@youzan/utils/number/accDiv';
import { ClampLines } from 'zent';
import isNumber from 'lodash/isNumber';
import './index.scss';

const getImageSize = size => {
  if (size === 'large') return '60px';
  return '40px';
};

const getClampedTitle = text => {
  return <ClampLines lines={1} popWidth={240} text={text} />;
};

export default function UmpGoodsBrief({
  title,
  price,
  sku = '',
  label = '',
  image,
  image2x,
  url,
  size,
  deleted,
}) {
  const getPrice = () => {
    return (
      <span className="brief-price">
        {label ? <span className="label">{label}</span> : ''}
        {isNumber(price) ? `¥${accDiv(price, 100)}` : ''}
      </span>
    );
  };

  const imgStyle = {
    width: getImageSize(size),
    height: getImageSize(size),
  };

  return (
    <div className="rc-ump-goods-brief-wrapper">
      <img className="rc-ump-goods-brief__img" src={image} srcSet={image2x} style={imgStyle} />
      <div className="rc-ump-goods-brief__inner">
        {url ? (
          <a className="brief-link" href={url}>
            {getClampedTitle(title)}
          </a>
        ) : (
          <div className="brief-title">{getClampedTitle(title)}</div>
        )}
        {getPrice()}
        {sku && <span className="brief-sku">{sku}</span>}
      </div>
    </div>
  );
}

UmpGoodsBrief.propTypes = {
  /** 商品名称 */
  title: propTypes.oneOfType([propTypes.node, propTypes.string, propTypes.number]).isRequired,
  /** 商品价格 */
  price: propTypes.number.isRequired,
  /** 商品规格信息 */
  sku: propTypes.string,
  /** 商品缩略图 */
  image: propTypes.string,
  /** 高倍商品缩略图 */
  image2x: propTypes.string,
  /** 网店商品需提供链接，门店商品不需提供 */
  url: propTypes.string,
  /** 商品标签 */
  label: propTypes.string,
  /** 大小 */
  size: propTypes.oneOf(['normal', 'large']),
  /** 如果商品已删除，需要隐藏信息并给出提示。 */
  deleted: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.node]),
};

UmpGoodsBrief.defaultProps = {
  image: '//img.yzcdn.cn/public_files/2017/08/30/63a8d28bce4ca2e5d081e1e69926288e.jpg',
  size: 'normal',
};
