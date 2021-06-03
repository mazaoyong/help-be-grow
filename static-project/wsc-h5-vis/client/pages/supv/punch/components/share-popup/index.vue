<template>
  <div class="share-popup">
    <van-popup v-model="showPopup">
      <div class="share-popup__content">
        <div class="share-popup__close-btn" @click="close">
          <van-icon
            name="cross"
            color="#fff"
            size="12px"
          />
        </div>
        <div class="share-popup__card">
          <van-loading type="spinner">
            加载中...
          </van-loading>
          <img v-if="url" :src="url">
        </div>
        <div class="share-popup__tip">
          长按保存图片并分享
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon, Loading } from 'vant';

export default {
  name: 'share-popup',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    'van-loading': Loading,
  },

  props: {
    value: Boolean,
    url: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showPopup: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.showPopup = value;
      },
    },
    showPopup(showPopup) {
      this.$emit('input', showPopup);
    },
  },

  methods: {
    close() {
      this.showPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.share-popup {
  ::v-deep .van-popup {
    background: transparent;
  }

  &__content {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 35px;
    height: 35px;
    background: rgba(0, 0, 0, .5);
    border-radius: 0 8px 0 35px;

    ::v-deep .van-icon {
      position: absolute;
      bottom: 16px;
      left: 16px;
    }
  }

  &__card {
    position: relative;
    width: 325px;
    height: 490px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 8px;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }

    .van-loading {
      margin: 230px auto 0;
      text-align: center;
    }
  }

  &__tip {
    margin-top: 23px;
    font-size: 16px;
    line-height: 22px;
    color: #fff;
    text-align: center;
  }
}
</style>
