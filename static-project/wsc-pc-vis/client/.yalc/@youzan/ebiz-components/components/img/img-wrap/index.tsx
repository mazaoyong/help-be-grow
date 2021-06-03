import React, { CSSProperties, PureComponent, MouseEvent } from 'react';
import fullfillImage from '@youzan/utils/fullfillImage';
import './style.scss';

// ImgWrapProps props
export interface ImgWrapProps {
  src: string; // img src
  alt?: string; // img alt
  width: string; // 宽
  height: string; // 高
  backgroundColor?: string; // 背景色
  cover?: boolean; // object-fit
  prefix?: string;
  fullfill: string; // 图片压缩
  watermark?: string; // 图片水印
  disableFullfill?: boolean; // 是否关闭图片压缩
  onClick?: (e: MouseEvent<HTMLImageElement>) => void;
}

const defaultProps: Partial<ImgWrapProps> = {
  width: 'auto',
  height: 'auto',
  alt: '',
  cover: false,
  prefix: 'img-wrap',
  backgroundColor: '#e2eefd',
  fullfill: '!100x100.jpg',
  watermark: '',
  disableFullfill: false,
  onClick: () => { },
};

export default class ImgWrap extends PureComponent<ImgWrapProps, {}> {
  static readonly defaultProps = defaultProps;

  // 外层 div 的样式
  get wrapStyle(): CSSProperties {
    const { width, height, backgroundColor } = this.props;
    return {
      width,
      height,
      backgroundColor,
    };
  }

  // img 标签的样式
  get imgStype(): CSSProperties {
    const { cover } = this.props;
    const objectFit = cover ? 'cover' : 'contain';

    return { objectFit };
  }

  // 图片 src
  get src(): string {
    const { disableFullfill, fullfill, src } = this.props;
    if (!disableFullfill && /yzcdn\.cn/.test(src)) {
      return fullfillImage(src, fullfill);
    }
    return src;
  }

  render() {
    const { prefix, alt, onClick, watermark } = this.props;

    return (
      <div
        className={prefix}
        style={this.wrapStyle}
      >
        <img className={`${prefix}__blur`} src={this.src} />
        <img className={`${prefix}__img`} alt={alt} src={this.src} style={this.imgStype} onClick={onClick} />
        <span className={`${prefix}__watermark`}>{watermark}</span>
      </div>
    );
  }
}
