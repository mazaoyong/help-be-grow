/** 转介绍埋点 */
export function log(config) {
  window.Logger && window.Logger.log({
    pt: 'inviteRewardBack',
    ...config,
  });
}
