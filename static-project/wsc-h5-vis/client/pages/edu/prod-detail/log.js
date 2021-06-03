// 线下课课程详情使用的埋点配置

export const logConfig = {
  auto: false,
  type: 'cg',
  id: function() {
    return this.productId || '0';
  },
  presets: {
    return_shop_home: {
      et: 'click',
      ei: 'return_shop_home',
      en: '点击进店逛逛',
    },
    view_other: {
      et: 'click',
      ei: 'view_other',
      en: '点击查看其它课程',
    },
    apply: {
      et: 'click',
      ei: 'apply',
      en: '点击报名',
    },
    view_shop_home: {
      et: 'click',
      ei: 'view_shop_home',
      en: '点击店铺首页',
    },
    contact_service: {
      et: 'click',
      ei: 'contact_service',
      en: '点击联系客服',
    },
    view_teacher: {
      et: 'click',
      ei: 'view_teacher',
      en: '点击老师',
    },
    view_all_teachers: {
      et: 'click',
      ei: 'view_all_teachers',
      en: '点击全部老师',
    },
    view_address: {
      et: 'click',
      ei: 'view_address',
      en: '查看上课地点',
    },
    select_sku: {
      et: 'click',
      ei: 'select_sku',
      en: '点击选择课程及查看上课地点',
    },
  },
};
