const { miniprogram } = _global;
const { isMiniProgram, isSwanApp } = miniprogram;

export function makePointLog(eventType, eventIdentify, eventName, pageType, params) {
  window.yzlogInstance &&
  window.yzlogInstance.log({
    et: eventType,
    ei: eventIdentify,
    en: eventName,
    pt: pageType,
    params,
  });
};

export function formatTrackParam(activityInfo = {}, type, introduceUserId = 0) {
  const { alias, name } = activityInfo;
  let platform = 'h5';
  if (isMiniProgram) {
    platform = 'weapp';
  } else if (isSwanApp) {
    platform = 'swanApp';
  }

  let param = {
    alias,
    title: name,
    platform,
    type,
  };

  if (introduceUserId) {
    param.introduceUserId = introduceUserId;
  }

  return param;
};

export const NEW_EVENT_NAME = {
  'enterpage': '浏览页面',
  'share_boost': '获取能量',
  'share_boost_poster': '获取能量海报分享',
  'share_boost_link': '获取能量链接分享',
  'go_join': '我也想参加',
  'share': '立即分享领取奖励',
  'boost_collect': '为好友补充能量',
  'submit_infocollect': '提交个人信息',
  'home': '进店逛逛',
  'recieve_award': '领取奖励',
};

export const OLD_EVENT_NAME = {
  'enterpage': '浏览页面',
  'share_link': '分享链接',
  'share_poster': '分享海报',
  'permission_check': '越权校验',
  'permission_dialog_know': '越权提示-知道了',
  'home': '进店逛逛',
  'choose_picture': '上传海报图片',
  'make_poster': '生成海报图片',
};
