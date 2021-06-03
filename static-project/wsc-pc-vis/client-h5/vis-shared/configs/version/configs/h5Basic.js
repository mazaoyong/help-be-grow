export default {
  // 下单页-预约上课入口
  appointEnter: {
    type: 'vuex',
    configs: [
      { key: 'getter', value: { key: 'isNeedAppointment', value: false } },
    ],
  },
  // 支付成功页-我要约课按钮
  appointBtn: {
    type: 'array',
    configs: [
      { key: 'reject', value: { text: '我要约课' } },
    ],
  },
  // 支付成功页-您还未约课，随时可以约课文案
  appointText: {
    type: 'component',
    configs: [
      { key: 'show', value: false },
    ],
  },
  // 课程主页-预约上课入口
  appointCourse: {
    type: 'array',
    configs: [
      { key: 'reject', value: { name: 'appointmentforclass' } },
    ],
  },
  // 个人中心-预约上课
  userCenterAppoint: {
    configs: [
      { key: 'prop', value: { key: 'showAction', value: false } },
    ],
  },
};
