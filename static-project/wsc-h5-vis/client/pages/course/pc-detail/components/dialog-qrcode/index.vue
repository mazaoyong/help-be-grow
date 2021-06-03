<template>
  <div class="dialog-qrcode">
    <van-icon
      name="cross"
      size="24"
      color="#7d7e80"
      @click="$emit('close')"
    />

    <div class="dialog-qrcode__body">
      <div v-show="title" class="dialog-qrcode__title">
        {{ title }}
      </div>
      <div v-show="subtitle" class="dialog-qrcode__subtitle">
        {{ subtitle }}
      </div>

      <img-wrap
        class="dialog-qrcode__qrcode"
        :src="qrcodeUrl"
        width="160px"
        height="160px"
      />

      <div class="dialog-qrcode__tip">
        <vis-icon size="32" name="qrcode" color="#155BD4" />
        <div>请打开 微信 客户端<br>扫一扫{{ actionText }}</div>
      </div>
    </div>

    <div class="dialog-qrcode__footer">
      <div v-if="cancelText" class="dialog-qrcode__button button--plain" @click="$emit('close')">
        {{ cancelText }}
      </div>

      <div v-if="okText" class="dialog-qrcode__button button--primary" @click="onComplete">
        {{ okText }}
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as VanIcon } from 'vant';
import { ImgWrap, Icon as VisIcon } from '@youzan/vis-ui';
import { getQrcode } from '../../apis';

export default {
  name: 'dialog-qrcode',

  components: {
    VanIcon,
    ImgWrap,
    VisIcon,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    actionText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    okText: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      qrcodeUrl: '',
    };
  },

  created() {
    getQrcode({
      url: window.location.href || '',
      errorCorrectionLevel: 1,
      deleteWhite: true,
    }).then(res => {
      if (res) {
        this.qrcodeUrl = res;
      }
    }).catch(errMsg => {
      console.log(errMsg);
    });
  },

  methods: {
    onComplete() {
      this.$emit('completed');
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.dialog-qrcode-container {
  background: transparent;
}

.dialog-qrcode {
  position: relative;
  width: 376px;
  padding-bottom: 32px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;

  .van-icon-cross {
    position: absolute;
    top: 16px;
    right: 35px;
    cursor: pointer;
  }

  &__body {
    margin: 72px auto 0;
    text-align: center;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: #323233;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 12px;
    line-height: 16px;
    color: #969799;
  }

  &__qrcode {
    margin: 30px auto 0;
  }

  &__tip {
    display: flex;
    margin: 36px 0;
    justify-content: center;

    .vis-icon {
      position: relative;
      top: 4px;
      margin-right: 16px;
    }

    div {
      font-size: 14px;
      line-height: 20px;
      color: #969799;
      text-align: left;
    }
  }

  &__footer {
    text-align: center;
  }

  &__button {
    display: inline-block;
    padding: 6px 23px;
    margin-left: 16px;
    cursor: pointer;
    border-radius: 2px;

    &:first-child {
      margin-left: 0;
    }

    &.button--plain {
      font-size: 14px;
      line-height: 20px;
      color: #323233;
      border: 1px solid #dcdee0;
    }

    &.button--primary {
      font-size: 14px;
      line-height: 20px;
      color: #fff;
      background: #155bd4;
      border: 1px solid #155bd4;
    }
  }
}
</style>
