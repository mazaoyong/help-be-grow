export default function convertWidthToString(width: number | string): string {
  let stringTypeWidth = '185px';

  if (typeof width === 'string') {
    const isValid = /\d+(px|rem|%|em|vw)/.test(width);
    /* istanbul ignore next */
    if (!isValid) {
      throw new Error('value of property-width is illegal');
    }

    stringTypeWidth = width;
  } else {
    stringTypeWidth = width + 'px';
  }

  return stringTypeWidth;
}
