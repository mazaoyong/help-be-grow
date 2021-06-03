<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    class="van-popup-qc-pop">
    <div class="qc-pop">
      <p class="qc-pop__top">
        {{ title || '' }}
      </p><p /><div class="qc-pop__content">
        <img class="qc-pop__img" :src="imgSrc">
      </div>

      <p v-if="desc" class="qc-pop__hint">
        {{ desc || '' }}
      </p>

      <img
        class="qc-pop__close"
        src="https://b.yzcdn.cn/public_files/2018/08/08/492a8ac9ea4f8736e29c8ace3db6987a.png"
        @click="show = !show">
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
export default {
  name: 'qrcode-popup',

  components: {
    'van-popup': Popup,
  },

  props: {
    value: Boolean,
    title: String,
    imgSrc: String,
    desc: String,
  },

  data() {
    return {
      show: this.value,
    };
  },

  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newValue) {
      this.$emit('input', newValue);
    },
  },

};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.van-popup-qc-pop {
  overflow-y: inherit;
}

.qc-pop {
  box-sizing: border-box;
  position: relative;
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  &__top {
    text-align: center;
    font-size: 14px;
    color: #333;
    line-height: 20px;

    @include multi-ellipsis(2);
  }

  &__img {
    width: 150px;
    height: 150px;
    margin-top: 14px;
  }

  &__hint {
    color: #999;
    margin-top: 14px;
    font-size: 10px;
  }

  &__close {
    position: absolute;
    width: 32px;
    height: 32px;
    top: -50px;
    right: 0;
  }
}
</style>
