/**
 * 二维码绘制位置的动态计算
 */

export interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPreviewOffset {
  bottom: number;
  right: number;
}

export interface IDrawStyle {
  qrcodePreviewOffset: IPreviewOffset;
  textPreviewOffset: IPreviewOffset;
  qrcodePosition: IPosition;
  textPosition: IPosition;
}

// 容器基本宽度
export const baseWidth = 270;
// 容器基本高度
export const baseHeight = 425;
// 距离底部的位置
export const baseBottom = 16;
// 距离右边的位置
export const baseRight = 8;
// 二维码宽高
export const baseQrCodeWidth = 60;
// 文字宽度
export const baseTextWidth = 100;
// 文字高度
export const baseTextHeight = 24;
// 文字上边距
export const baseTextMarginTop = 6;

// 文字图片地址
export const textImageUrl =
  'https://img.yzcdn.cn/public_files/1d9ae36521fd31aff8655b2553c0847b.png';

export const wholeSize = {
  width: Math.max(baseTextWidth, baseQrCodeWidth),
  height: baseTextHeight + baseQrCodeWidth + baseTextMarginTop,
};

export function checkImage(bgImageHeight: number, bgImageWidth: number): boolean {
  if (
    bgImageWidth < wholeSize.width ||
    bgImageHeight < wholeSize.height ||
    (bgImageWidth < baseWidth && bgImageHeight < baseHeight)
  ) {
    return false;
  }
  const rowCenter = bgImageHeight / baseHeight > bgImageWidth / baseWidth;
  const scale = rowCenter ? bgImageHeight / baseHeight : bgImageWidth / baseWidth;
  if (rowCenter) {
    const relativeWidth = bgImageWidth / scale;
    if (relativeWidth < baseTextWidth) {
      return false;
    }
  } else {
    const relativeHeight = bgImageHeight / scale;
    if (relativeHeight < baseTextHeight + baseTextMarginTop + baseQrCodeWidth) {
      return false;
    }
  }
  return true;
}

export default function getQrcodePosition(bgImageHeight: number, bgImageWidth: number): IDrawStyle {
  const qrcodePosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const textPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const previewPosition = {
    bottom: baseBottom,
    right: baseRight,
  };
  const qrcodeXoffset = (baseTextWidth - baseQrCodeWidth) / 2;
  const textYoffset = baseQrCodeWidth + baseTextMarginTop;
  const rowCenter = bgImageHeight / baseHeight > bgImageWidth / baseWidth;
  let scale = rowCenter ? bgImageHeight / baseHeight : bgImageWidth / baseWidth;
  qrcodePosition.width = qrcodePosition.height = baseQrCodeWidth * scale;
  textPosition.width = baseTextWidth * scale;
  textPosition.height = baseTextHeight * scale;

  let x = 0;
  let y = 0;
  if (scale !== 0) {
    if (rowCenter) {
      const relativeWidth = bgImageWidth / scale;
      const spaceWidth = (baseWidth - relativeWidth) / 2;
      let right = spaceWidth + baseRight;
      if (right > spaceWidth + relativeWidth - wholeSize.width) {
        right = spaceWidth;
      }
      if (bgImageHeight < wholeSize.height + baseBottom) {
        previewPosition.bottom = 0;
      }
      previewPosition.right = right;
      y = baseHeight - previewPosition.bottom - wholeSize.height;
      x = baseWidth - spaceWidth - right - wholeSize.width;
    } else {
      const relativeHeight = bgImageHeight / scale;
      const spaceHeight = (baseHeight - relativeHeight) / 2;
      let bottom = spaceHeight + baseBottom;
      if (bottom > spaceHeight + relativeHeight - wholeSize.height) {
        bottom = spaceHeight;
      }
      if (bgImageWidth < wholeSize.width + baseRight) {
        previewPosition.right = 0;
      }
      previewPosition.bottom = bottom;
      y = baseHeight - spaceHeight - bottom - wholeSize.height;
      x = baseWidth - previewPosition.right - wholeSize.width;
    }
  }
  qrcodePosition.x = (x + qrcodeXoffset) * scale;
  qrcodePosition.y = y * scale;
  textPosition.x = x * scale;
  textPosition.y = (y + textYoffset) * scale;

  [qrcodePosition, textPosition].forEach(position =>
    Object.keys(position).map(item => {
      position[item] = Math.floor(position[item]);
    }),
  );
  const qrcodePreviewOffset: IPreviewOffset = {
    bottom: previewPosition.bottom + baseTextHeight + baseTextMarginTop,
    right: previewPosition.right + (baseTextWidth - baseQrCodeWidth) / 2,
  };
  const textPreviewOffset: IPreviewOffset = {
    bottom: previewPosition.bottom,
    right: previewPosition.right,
  };

  // 默认情况下与视觉底图有不对称，需要修补这点偏移
  if (scale === 0) {
    qrcodePreviewOffset.right += 4;
  }
  return {
    qrcodePosition,
    textPosition,
    qrcodePreviewOffset,
    textPreviewOffset,
  };
}
