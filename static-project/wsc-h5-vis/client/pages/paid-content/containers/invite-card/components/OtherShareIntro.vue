<template>
  <div class="content">
    <div
      v-show="showCopyBtn"
      class="content__item content__top">
      <p class="content__main-text">
        通过链接推广
      </p>
      <div class="content__link-area">
        <span class="content__sub-text">
          {{ link }}
        </span>
        <div class="content__btn-ctner">
          <button
            class="content__btn"
            size="small"
            :data-clipboard-text="link"
            @click="onClickCopy">
            复制地址
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="content__item">
      <p class="content__main-text">
        微信内直接分享
      </p>
      <p class="content__sub-text">
        点击右上角[···]通过“发送给朋友”，“分享到朋友圈”推广
      </p>
    </div> -->
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import Clipboard from 'clipboard';
export default {
  name: 'other-share-intro',

  components: {
    [Button.name]: Button,
  },

  props: {
    link: String,
  },

  data() {
    return {
      showCopyBtn: false,
    };
  },

  created() {
    if (Clipboard.isSupported()) {
      this.showCopyBtn = true;
    }
  },

  methods: {
    onClickCopy() {
      this.$emit('close');
      var clipboard = new Clipboard('.content__btn');
      clipboard.on('success', e => {
        Toast('复制成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        // 不支持复制
        Toast('复制失败，请直接点击右上角分享给朋友');
        // 释放内存
        clipboard.destroy();
      });
    },
  },

};
</script>

<style lang="scss">
  @import 'mixins/index.scss';

  .content {

    &__item {
      padding: 10px 20px;
    }

    &__top {
      position: relative;

      &::after {
        @include border-retina(bottom);
      }
    }

    &__link-area {
      display: flex;
      align-items: center;
      max-width: 100%;

      .content__sub-text {
        @include ellipsis;
      }
    }

    &__btn-ctner {
      display: inline-block;
      padding-left: 15px;
    }

    &__btn {
      width: 60px;
      height: 24px;
      border-radius: 2px;
      border: solid 1px #4b0;
      font-size: 12px;
      color: #4b0;
      box-sizing: border-box;
      padding: 3px;
      background: #fff;
    }

    &__main-text {
      font-size: 15px;
      color: #999;
      line-height: 22px;

      &::after {
        @include border-retina(bottom);
      }
    }

    &__sub-text {
      font-size: 14px;
      color: #333;
      line-height: 20px;
    }
  }
</style>
