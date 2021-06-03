<template>
  <div
    class="share-mask__ele-wrap"
    @click="handleClose"
  >
    <div class="share-mask__wechat">
      <div class="share-mask__wechat-title">
        立即推广给好友吧
      </div>
      <div class="share-mask__wechat-desc">
        点击屏幕右上角将本页面分享给好友
      </div>
      <div :class="['share-mask__wechat-icon', { 'share-mask__miniapp__wechat-icon': isMiniApp }]">
        <img
          src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'share-mask',

  props: {
    isMiniApp: Boolean,
  },

  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.share-mask__ele-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .8);
}

.share-mask__wechat-title {
  height: 30px;
  margin: 140px auto auto;
  font-size: 20px;
  line-height: 30px;
  color: #fff;
  text-align: center;
}

.share-mask__wechat-desc {
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  text-align: center;
}

.share-mask__wechat-icon {
  position: fixed;
  top: 12px;
  right: 33px;
  width: 66px;
  height: 117px;

  &.share-mask__miniapp__wechat-icon {
    right: 80px;
  }
}

.share-mask__wechat-icon img {
  width: 100%;
  height: 100%;
}
</style>
