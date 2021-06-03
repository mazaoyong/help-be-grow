import React from 'react';
import { ClampLines, Tag } from 'zent';
import cx from 'classnames';

import { IGoodsBriefCardProps } from '../../../types/grid';
import '../../../styles/goods-card.scss';

const getImageSize = (size?: number) => {
  return size ? `${size}px` : '60px';
};

const getClampedTitle = (text: string) => {
  return <ClampLines lines={2} popWidth={240} text={text} />;
};

const DEFAULT_IMG = '//img.yzcdn.cn/public_files/2017/08/30/63a8d28bce4ca2e5d081e1e69926288e.jpg';
const GoodsBriefCard: React.FC<IGoodsBriefCardProps> = ({
  title,
  price,
  /* istanbul ignore next */
  image = DEFAULT_IMG,
  imageSize,
  image2x,
  url,
  label,
  labelTagTheme,
  labelOutline,
  labelProps,
  className,
}) => {
  const imgStyle = {
    width: getImageSize(imageSize),
    height: getImageSize(imageSize),
  };

  return (
    <div data-testid="easy-grid-goodsCard" className={cx('esg-goods-wrapper', className)}>
      <img className="esg-goods__img" src={image} srcSet={image2x} style={imgStyle} />
      <div className="esg-goods__inner">
        <div className="brief-title">
          {url ? (
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {getClampedTitle(title)}
            </a>
          ) : (
            getClampedTitle(title)
          )}
        </div>
        <div className="goods-info-wrap">
          {label && (
            <Tag {...labelProps} theme={labelTagTheme} outline={labelOutline}>
              {label}
            </Tag>
          )}
          <span className="brief-price">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default GoodsBriefCard;
