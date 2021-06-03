import React from 'react';
import ImgWrap, { ImgWrapProps } from '../img-wrap';

interface IImageLockWrapProps extends ImgWrapProps {
  isLock: boolean;
}

export default function LockImage(props: IImageLockWrapProps) {
  const { isLock, src, ...restProps } = props;
  return <ImgWrap src={isLock ? 'https://img.yzcdn.cn/publicPath/edu/20190416/lock.png' : src} {...restProps} />;
}
