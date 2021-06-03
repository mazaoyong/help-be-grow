<template>
  <div class="empty-content">
    <div class="icon" />
    <p class="title">
      优惠套餐活动结束了
    </p>
    <van-button
      class="btn"
      plain
      hairline
      :style="{color: themeColor, borderColor: themeColor}"
      :url="`${h5Url}/v2/home?kdt_id=${kdtId}`"
    >
      进店逛逛
    </van-button>
  </div>
</template>

<script>
import { Button } from 'vant';
import { themeColor } from 'common/constants';

const { kdt_id: kdtId, url } = window._global;

export default {
  components: {
    'van-button': Button,
  },

  data() {
    return {
      kdtId,
      h5Url: url.h5,
      themeColor: themeColor[_global.globalTheme],
    };
  },
};
</script>

<style lang="scss" scoped>
.empty-content {
  padding-top: 130px;
  background: #f2f2f2;
  height: 100vh;
  box-sizing: border-box;

  .icon {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    background: url(https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png) 0 0 no-repeat;
    background-size: 100px 100px;
  }

  .title {
    margin: 5px 0 20px;
    text-align: center;
    color: #969799;
    font-size: 14px;
  }

  .btn {
    display: block;
    margin: 0 auto;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border-radius: 22px;
    font-size: 14px;
    background-color: transparent;
  }
}
</style>
