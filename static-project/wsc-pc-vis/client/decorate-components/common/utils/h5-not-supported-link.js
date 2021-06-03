export function getH5NotSuppertedLinkMessage(link = {}) {
  const { link_type: linkType } = link;
  if (linkType === 'weapplink') {
    return '仅小程序支持路径型链接';
  }
}
