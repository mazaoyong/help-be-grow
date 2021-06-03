# 课程下单页store开发帮助

## store 模块说明
```
.
├── class                             课程信息下单相关（时间，地址，预约，信息采集）
├── goods                             商品相关
├── order                             订单相关
├── pay                               支付相关（支付信息，收银台信息）
├── prepay-card                       预付卡相关
├── price                             价格相关（优惠价格，商品价格，订单价格等）
├── shop                              店铺相关（店铺级别的通用信息）
└── ump                               活动相关（营销活动，会员优惠，优惠卷）
```

## 使用 vuex
当前page内文件都支持使用vuex（除了部分popup使用了 quick-open 的弹窗，因为不是当前实例，所以不支持）

### 使用方法
对vuex做了一层封装，使用方法如下
```js
export default {
  name: 'demo',
  // 对应 mapState
  state: ['xxx'],
  // 对应 mapGetters
  getters: ['xxx'],
  // 当前放置的位置无限制，约定放在data的上面
  data() {
    return {};
  },
  methods: {
    onClick() {
      // 等价于 this.store.$commit('xxx')
      this.$commit('XXX');
      // 等价于 this.store.$dispatch('xxx')
      this.$dispatch('XXX');
    }
  }
}
```

## 常用字段
### 错误提示
- state.errorMessage: 全局的错误提示

### 环境相关
- state.env.isWeixin: ctx.isWeixin
- state.env.isWeapp: ctx.isWeapp
- state.env.isGuang: ctx.isGuang

### 商品相关
- state.extra: 商品的额外拓展信息
- getters.singleGoods: 单商品信息
- getters.goodsList: 商品列表
- getters.isCourse: 是否是线下课
- getters.isFormalCourse 是否是正式课
- getters.isCasualCourse 是否是体验课
- getters.isPaidContent 是否是知识付费
- getters.isColumn 是否是专栏
- getters.isContent 是否是内容
- getters.isLive 是否是直播

### 订单相关
- state.order.orderNo: 订单号
- state.order.channelType: channelType: 教育渠道类型
- getters.isOrderCreated: 订单是否已创建

### 金钱相关
- state.pay.realPay: 订单的实付金额
- getters.couponDecrease: 优惠卷抵扣金额
- getters.prepayCardDecrease: 预付卡抵扣金额
- getter.activityDecrease: 活动优惠金额
- getters.orderOriginPrice: 订单原价
- getters.orderFinalPrice: 订单用户最终金额

### 店铺相关
- state.shop.activityType: 店铺级别活动Type
- state.shop.activityId
- state.shop.activityAlias
- state.shop.pointsName: 店铺积分自定义名称
- state.shop.userPoints: 当前店铺用户总积分

### 活动相关
- getters.isPackageBuy: 是否是优惠套餐
- getters.isGroupBuy: 是否是拼团
- getters.isPointsExchange: 是否是积分商城
- getters.isSecKill: 是否是秒杀
- getters.isCustomerDiscount: 是否是会员折扣
- getters.isTimeLimitDiscount: 是否是限时折扣
- getters.isGift // 是否是送礼（请好友看）
