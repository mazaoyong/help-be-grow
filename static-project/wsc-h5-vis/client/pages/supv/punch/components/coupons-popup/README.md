# 打卡任务详情页 - 优惠券弹窗

## 使用方式

```
<template>
  <coupons-popup
    show="showCouponsPopup"
    coupons="coupons"
    @go-coupon="onGoCouponPage"
    @close="onCouponsPopupClose"
  />
  </coupons-popup>
</template>

<script>
import CouponsPopup from 'supv/punch/components/coupons-popup';

...

components: {
  CouponsPopup,
},

...

data() {
  return {
    ...
    showCouponsPopup: false,
    coupons: [
      {
        type: 1, // 1 优惠券 2 积分券
        title: '打卡奖励券', // 优惠券名称
        description: '满100可用', // 优惠券描述
        count: '20', // 优惠券数额
        noExpiration: false, // 没有有效期
        couponType: 0, // 优惠券类型: 1 满减券 2 折扣券
        startDate: '', // 有效期开始时间
        endDate: '', // 有效期结束时间
      }
    ],
    ...
  };
},

methods: {
  onGoCouponPage() {
    // 跳转至我的优惠券页面
  },

  onCouponsPopupClose() {
    this.showCouponsPopup = true;
  },
}
</script>
```

## 参数


