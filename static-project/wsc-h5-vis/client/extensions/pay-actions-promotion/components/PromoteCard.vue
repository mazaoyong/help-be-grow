<template>
  <div v-if="groupOpenData === 1" class="vis-promote-card">
    <div class="vis-promote-card__info-box">
      <div class="vis-promote-card__info">
        <p class="vis-promote-card__title">
          {{ titleData }}
        </p>
        <p class="vis-promote-card__desc">
          {{ descData }}
        </p>
      </div>
    </div>
    <van-button
      round
      type="primary"
      :size="type === 'new' ? 'mini' : 'small'"
      class="vis-promote-card__btn"
      @click="onOpenMask"
    >
      {{ btnTextData }}
    </van-button>
    <!-- 产品需求变了，暂时不用 -->
    <div v-if="displayMask" class="vis-promote-card-qrcode-popup">
      <van-icon class="qrcode-popup_close" name="cross" @click="onCloseMask" />
      <div class="popup-info">
        <div class="qrcode-title">
          {{ qrCodeGuideCopyData || descData }}
        </div>
        <div class="qrcode-img">
          <vis-canvas class="vis-promote-card-canvas" :config="canvasConfig" />
        </div>
        <div class="qrcode-tip">
          {{ customTip || '长按识别二维码加入交流群' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Icon } from 'vant';
import { Canvas as VisCanvas } from '@youzan/vis-ui';

export default {
  name: 'vis-promote-card',

  components: {
    'van-icon': Icon,
    'van-button': Button,
    VisCanvas,
  },

  props: {
    type: {
      type: String,
      default: 'old',
    },

    btnText: {
      type: String,
      default: '立即添加',
    },
    title: {
      type: String,
      default: '添加老师微信',
    },
    qrCodeGuideCopy: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '可及时了解课程动向',
    },
    qrcode: {
      type: String,
      default: '',
    },
    groupOpen: {
      type: Number,
      default: 0,
    },

    isLink: {
      type: Boolean,
      default: false,
    },

    linkUrl: {
      type: String,
      default: '',
    },

    customTip: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      displayMask: false,
      btnTextData: this.btnText,
      titleData: this.title,
      descData: this.desc,
      qrCodeGuideCopyData: this.qrCodeGuideCopy,
      qrcodeData: this.qrcode,
      groupOpenData: this.groupOpen,
    };
  },

  computed: {
    canvasConfig() {
      if (this.type !== 'new') return {};

      return {
        type: 'div',
        css: {
          width: '180px',
          height: '180px',
          background: 'transparent',
        },
        children: [
          {
            type: 'image',
            css: {
              width: '180px',
              height: '180px',
            },
            url: this.qrcodeData.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn'),
          },
        ],
      };
    },
  },

  watch: {
    btnText(newValue) {
      this.btnTextData = newValue;
    },
    title(newValue) {
      this.titleData = newValue;
    },
    desc(newValue) {
      this.descData = newValue;
    },
    qrCodeGuideCopy(newValue) {
      this.qrCodeGuideCopyData = newValue;
    },
    qrcode(newValue) {
      this.qrcodeData = newValue;
    },
    groupOpen(newValue) {
      this.groupOpenData = newValue;
    },
  },

  methods: {
    onOpenMask(e) {
      if (this.isLink) {
        this.$emit('jump');
      } else {
        this.displayMask = true;
        this.$emit('open');
      }
    },
    onCloseMask() {
      this.displayMask = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.vis-promote-card {
  height: 67px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: #F7F8FA;

  &__info-box {
    margin-left: 12px;
    display: flex;
  }

  &__avatar {
    border-radius: 18px;
    margin-right: 10px;
  }

  &__title {
    font-size: 14px;
    line-height: 20px;
    color: #323233;
    font-weight: bold;
  }

  &__desc {
    margin-top: 3px;
    font-size: 12px;
    line-height: 17px;
    color: #999;
    width: 192px;
  }

  &__btn {
    margin-right: 11px;
    width: 86px;

    &.van-button--mini {
      width: 60px;
    }
  }
}

.vis-promote-card-qrcode-popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f8f8f8;

  display: flex;
  align-items: center;
  justify-content: center;

  .qrcode-popup_close {
    position: absolute;
    font-size: 28px;
    color: #d8d8d8;
    top: 16px;
    right: 16px;
  }
  .popup-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qrcode-title {
      font-size: 16px;
      color: #111;
      font-weight: bold;
    }

    .qrcode-img {
      width: 180px;
      height: 180px;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .qrcode-tip {
      font-size: 13px;
      color: #333333;
      text-align: center;
      line-height: 20px;
    }
  }
}

.vis-promote-card-canvas {
  width: 100%;
  height: 280px;

  & > .vis-canvas-img {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 375px;
  }
}
</style>
