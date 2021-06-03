<template>
  <div class="notice-bar-and-qrcode">
    <!-- 专栏更新提醒条 -->
    <div class="notice-bar">
      <img-wrap
        class="notice-bar__icon"
        :width="'20px'"
        :height="'20px'"
        src="https://b.yzcdn.cn/public_files/2018/10/07/6423129e30718768dc86d3e5395171ed.png"
        disable-lazyload
      />
      <span class="notice-bar__desc">
        关注商家公众号，开启新课更新提醒服务
      </span>
      <van-button
        class="notice-bar__btn"
        type="primary"
        size="mini"
        @click="onClickFollow">
        立即关注
      </van-button>
    </div>

    <!-- 专栏更新提醒弹框 -->
    <qrcode-popup
      v-model="showQrcode"
      title="长按识别二维码，关注公众号开启新课更新提醒"
      :img-src="updateQrcodeUrl"
      desc=""
    />
  </div>
</template>

<script>
import { Button } from 'vant';
import QrcodePopup from 'pct/components/QrcodePopup';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'update-notice',

  components: {
    'van-button': Button,
    QrcodePopup,
    ImgWrap,
  },

  props: {
    updateQrcodeUrl: String,
  },

  data() {
    return {
      showQrcode: false,
    };
  },

  methods: {
    onClickFollow() {
      this.showQrcode = true;
    },
  },
};
</script>

<style lang="scss">
.notice-bar {
  height: 55px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  align-items: center;

  &__icon {
    height: 20px;
    width: 20px;
    padding-right: 10px;
  }

  &__desc {
    font-size: 14px;
    color: #333;
    flex: 1;
  }

  &__btn {
    font-size: 10px;
  }
}
</style>
