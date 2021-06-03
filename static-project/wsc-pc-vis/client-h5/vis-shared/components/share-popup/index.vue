<template>
  <van-popup
    v-model="value"
    class="share-popup"
    get-container="body"
    @click-overlay="$emit('hide')"
  >
    <div class="share-popup-trangle-top" />
    <div class="share-text">
      <div class="share-text-title">
        <slot name="title"></slot>
      </div>
      <div class="share-text-content">
        <slot name="content"></slot>
      </div>
    </div>
  </van-popup>
</template>
<script>
import { Popup } from 'vant';
export default {
  name: 'share-popup',
  components: {
    'van-popup': Popup,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.show,
    }
  },
  watch: {
    show(val) {
      this.value = val;
    },
  }
}
</script>
<style lang="scss">
.share-popup {
  position: fixed;
  left: 62%;
  top: 8%;
  width: 60%;
  border-radius: 2%;
  padding: 10px;
  margin: 10px;
  overflow: visible;

  &-trangle-top {
    position: absolute;
    top: -10px;
    right: 10px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #fff;
  }

  .share-text {
    margin: 5px;
    color: #323233;

    &-title {
      display: flex;
      flex-direction: row-reverse;
      font-size: 20px;
      padding-bottom: 10px;
    }
    &-content {
      display: flex;
      font-size: 14px;
      flex-direction: row-reverse;
    }
  }
}
</style>
