/**
 * 获取线索页面类型
 *
 * @return {string}
 * pool - 线索池
 * all - 全部线索
 * my - 我的线索
 */
export default function getCluePageType() {
  const reg = /v4\/vis\/edu\/page\/clue\/(.+)(#.+?)/i;
  const type = reg.exec(location.href);
  return type[1] || 'all';
}
