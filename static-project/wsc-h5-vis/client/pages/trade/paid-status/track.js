// track 平台项目地址：http://track.qima-inc.com/projects/293

export function logAppointmentCancel() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'appointment_cancel',
    en: '预约异常弹窗-稍后预约',
    pt: 'paidStatus',
  });
}

export function logAppointmentConfirm() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'appointment_confirm',
    en: '预约异常弹窗-重新约课',
    pt: 'paidStatus',
  });
}

export function logRecommendGoods(index) {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'recommend_goods',
    en: '点击推荐商品',
    pt: 'paidStatus',
    params: {
      index,
    },
  });
}

export function logAdJoinRecognize() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ad_join_recognize',
    en: '粉丝推广-识别',
    pt: 'paidStatus',
  });
}

export function logAdJoinClose() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ad_join_close',
    en: '粉丝推广-我知道了',
    pt: 'paidStatus',
  });
}

export function logAdJoinOpen() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ad_join_open',
    en: '粉丝推广-打开弹层',
    pt: 'paidStatus',
    params: {},
  });
}

export function logUmpCertRecognize() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_cert_recognize',
    en: '证书-长按识别',
    pt: 'paidStatus',
  });
}

export function logUmpCertClose() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_cert_close',
    en: '证书-关闭',
    pt: 'paidStatus',
  });
}

export function logUmpPresent() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_present',
    en: '领取赠课',
    pt: 'paidStatus',
  });
}

export function logUmpRewardPoints() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_reward_points',
    en: '入学奖励-领取积分',
    pt: 'paidStatus',
  });
}

export function logUmpRewardCoupon() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_reward_coupon',
    en: '入学奖励-领取优惠券',
    pt: 'paidStatus',
  });
}

export function logUmpRewardCourse() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'ump_reward_course',
    en: '入学奖励-领取课程',
    pt: 'paidStatus',
  });
}

export function logActionShare() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'action_share',
    en: '推荐给好友',
    pt: 'paidStatus',
  });
}

export function logActionCourse() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'action_course',
    en: '查看课程',
    pt: 'paidStatus',
  });
}

export function logActionAppointment() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'action_appointment',
    en: '我要约课',
    pt: 'paidStatus',
  });
}

export function logRewardMembercard() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'reward_membercard',
    en: '查看权益卡',
    pt: 'paidStatus',
  });
}

export function logRewardPoints() {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'reward_points',
    en: '查看积分',
    pt: 'paidStatus',
  });
}
