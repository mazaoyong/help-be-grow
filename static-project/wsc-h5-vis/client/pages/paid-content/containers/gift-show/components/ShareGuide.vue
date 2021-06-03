<template>
  <div class="directseller-sharemask">
    <div class="share-mask__ele-wrap js-ele-mask" @click="closeMask">
      <div class="share-mask__wechat">
        <div class="share-mask__wechat-title">
          喊好友来收礼
        </div>
        <div class="share-mask__wechat-desc">
          <p class="share-mask__info">
            点击右上角，分享给好友来领取
          </p>
        </div>
        <div class="share-mask__wechat-icon">
          <img src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'share-guide',

  props: {
  },

  methods: {
    closeMask() {
      this.$emit('shareFriend');
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.share-mask {
  &__ele-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
  }

  &__wechat {
    &-title {
      height: 29px;
      margin: auto;
      margin-top: 140px;
      font-size: 20px;
      line-height: 29px;
      color: #fff;
      text-align: center;
    }

    &-desc {
      margin-top: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #fff;
      text-align: center;
    }

    &-money-icon {
      padding-right: 4px;
      padding-left: 4px;
      margin-right: 4px;
      background-color: red;
      border-radius: 8px;
    }

    &__info {
      margin: 5px;
    }

    &-count {
      color: red;
    }

    &-icon {
      position: absolute;
      top: 12px;
      right: 30px;
      width: 85px;
      height: 110px;

      img {
        width: 100%;
      }
    }
  }
}
</style>
