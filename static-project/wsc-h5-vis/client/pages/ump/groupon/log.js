const { miniprogram } = _global;
const { isMiniProgram, isSwanApp } = miniprogram;

export function makePointLog(eventType, eventIdentify, eventName, pageType, params) {
  let platform = 'h5';
  if (isMiniProgram) {
    platform = 'weapp';
  } else if (isSwanApp) {
    platform = 'swanApp';
  }

  window.yzlogInstance &&
  window.yzlogInstance.log({
    et: eventType,
    ei: eventIdentify,
    en: eventName,
    pt: pageType,
    params: {
      platform,
      ...params,
    },
  });
};

/**
 * @description 添加标准分享埋点
 */
export function makeSharePointer({
  umpType,
  activityId,
}) {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'custom',
      ei: 'share',
      en: '分享',
      pt: 'coupon',
      params: {
        ump_type: umpType,
        activity_id: activityId,
      },
    });
}
