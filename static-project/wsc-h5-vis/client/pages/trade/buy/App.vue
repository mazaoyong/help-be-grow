<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';

export default {
  name: 'app',

  created() {
    // 初始化微信 SDK
    ZNB.init({ kdtId: _global.kdt_id }).catch(() => {});
  },
};
</script>

<style lang="scss">
// 去除inline-block空隙
// cap-price的外层还有一层span，v-theme无法直接覆盖
.cap-price {
  font-size: 0px;
  color: inherit !important;
}

// 修正iphonex样式
.is-iphonex .vis-standard-popup__buttons {
  margin-bottom: 0px !important;
}

.vis-standard-popup__button:first-child {
  border-top-left-radius: 20px !important;
  border-bottom-left-radius: 20px !important;
}

.vis-standard-popup__button:last-child {
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}
</style>
