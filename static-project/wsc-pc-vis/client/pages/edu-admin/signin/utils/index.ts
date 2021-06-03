export { signinListQueryFormatter } from './signin-list-query-formatter';
export { loadImage, downloadImage, deleteEmptyProperty } from './image-utils';
export function formatConsumeNumber(consumeNum: any) {
  if (isNaN(consumeNum) || Number(consumeNum) === -1) return '-';
  return (parseFloat(consumeNum) / 100).toFixed(2);
}
