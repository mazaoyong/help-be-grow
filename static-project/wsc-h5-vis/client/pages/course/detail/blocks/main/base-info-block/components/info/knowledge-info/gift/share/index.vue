<template>
  <div class="share" @click="handleClick">
    <p class="title">
      免费请好友看
    </p>
    <p class="info">
      前{{ everyContentFriendCount }}名好友可以免费领取该内容
    </p>
    <p class="info">
      已有<span class="num">{{ receivedCount }}</span>个好友领取
    </p>
    <img class="icon" src="https://b.yzcdn.cn/wsc-h5-vis/course/detail/share.png">
  </div>
</template>

<script>
export default {
  props: {
    everyContentFriendCount: {
      type: Number,
      default: 0,
    },
    receivedCount: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    handleClick() {
      this.$emit('resolve');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.share {
  @include clearfix;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: $white;
  text-align: center;

  .title {
    margin: 200px 0 8px;
    font-size: 20px;
  }

  .info {
    font-size: 14px;
    line-height: 20px;

    .num {
      margin: 0 4px;
      color: $red;
    }
  }

  .icon {
    position: absolute;
    top: 8px;
    right: 40px;
    height: 160px;
  }
}
</style>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.share-popup {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
</style>
