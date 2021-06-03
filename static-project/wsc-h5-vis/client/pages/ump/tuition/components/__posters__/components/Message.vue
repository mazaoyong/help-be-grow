<template>
  <div class="message" :class="direction">
    <img :src="qrCode" class="image">
    <div class="tip">
      <p class="desc">
        长按二维码即可帮我攒学费
      </p>
      <p class="name">
        分享来自
        <span class="shopname">
          {{ shopName }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',

  props: {
    shopName: {
      type: String,
      default: '',
    },

    qrCode: {
      type: String,
      default: '',
    },

    direction: {
      type: String,
      default: 'left',
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 346px;

  .image {
    width: 56px;
    height: 56px;
    overflow: hidden;
  }

  .tip {
    margin-left: 8px;

    .desc {
      margin: 0;
      padding: 0;
      font-size: 12px;
      color: #323233;
      line-height: 18px;
    }
    .name {
      font-size: 12px;
      color: #969799;
      line-height: 19px;
      margin: 0;
      padding: 0;
      margin-top: 3px;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      text-overflow: ellipsis;
      .shopname {
        color: #323232;
        font-weight: 500;
      }
    }
  }

  &.right {
    .tip {
      margin-left: 0;
    }
    .image {
      margin-left: 8px;
      order: 1;
    }
  }
}
</style>
