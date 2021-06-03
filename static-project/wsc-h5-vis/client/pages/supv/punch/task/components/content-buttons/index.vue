<template>
  <div :class="buttonsClasses">
    <div class="punch-list__content-buttons-button" :style="buttonStyle" @click="handlePunchButton">
      <span>{{ buttonPrimaryText }}</span>
      <span v-if="buttonSecondaryText">{{ buttonSecondaryText }}</span>
    </div>
    <div v-if="showPunchDays" class="punch-list__content-buttons clock-in-days">
      已经坚持打卡
      <span class="punch-list__content-buttons-text">{{ clockInTimes }}</span>
      天
    </div>
  </div>
</template>
<script>
let ticking = false;
let contentElement = null;
const preserveHeight = 691; // 别问我怎么算出来的= =，有问题请直接@逐浪

export default {
  name: 'content-buttons',

  props: {
    buttonSetting: {
      type: Object,
      default: () => ({}),
    },
    clockInTimes: {
      type: Number,
      default: 0,
    },
    overView: {
      // 是否超出固定展示内容的范围
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      scrollToPos: false,
    };
  },

  computed: {
    buttonsClasses() {
      let addonCls = {};
      if (this.overView) {
        if (!this.expand) {
          addonCls = { 'show-masking': true };
        } else {
          const { canPunch = false } = this.buttonSetting;

          addonCls = {
            'fixed-button': true,
            'scroll-to-pos': !canPunch || this.scrollToPos, // 不能打卡就永远固定在底部
          };
        }
      }
      return Object.assign({ 'punch-list__content-buttons-container': true }, addonCls);
    },
    buttonPrimaryText() {
      return this.buttonSetting.primaryText || '';
    },
    buttonSecondaryText() {
      return this.buttonSetting.secondaryText || '';
    },
    buttonStyle() {
      return this.buttonSetting.buttonScheme || {};
    },
    showPunchDays() {
      const hasPunchDays = this.clockInTimes > 0;
      const isCollapse = !this.expand;
      return hasPunchDays && isCollapse;
    },
  },

  mounted() {
    const { canPunch = false } = this.buttonSetting;
    if (canPunch) {
      // 需要在加载完成之后给documentElement添加事件监听，要做两件事情，第一件事就是拿到内容的高度；
      // 第二件事情就是计算滚动高度与内容高度的差值是否隐藏全文的第一屏内容高度（599)
      document.addEventListener('scroll', this.handleCheckPunchPosition);
    }
  },

  destroyed() {
    document.removeEventListener('scroll', this.handleCheckPunchPosition);
  },

  methods: {
    handleCheckPunchPosition(evt) {
      if (this.overView && this.expand) {
        if (!ticking) {
          requestAnimationFrame(() => {
            ticking = false;
            if (!contentElement) {
              contentElement = document.querySelector(
                '.punch-list__content-container'
              );
            }
            const { target = {} } = evt;
            if (target && target.scrollingElement) {
              const contentHeight = contentElement.clientHeight;
              const scrollTop = target.scrollingElement.scrollTop;
              if (contentHeight - scrollTop <= preserveHeight) {
                if (!this.scrollToPos) {
                  this.scrollToPos = true;
                }
              } else {
                this.scrollToPos = false;
              }
            }
          });
        }
        ticking = true;
      }
    },
    handlePunchButton() {
      if (this.buttonSetting.canPunch) {
        this.$emit('click-button');
      }
    },
  },
};
</script>
<style lang="scss">
.punch-list__content-buttons {
  &-container {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1002;
    width: 100%;
    padding-bottom: 20px;
    text-align: center;

    &.show-masking {
      padding-top: 100px;
      background-image: linear-gradient(to top, #fff 60%, rgba(255, 255, 255, 0) 100%);
    }

    &.fixed-button {
      position: fixed;
      bottom: 0;
    }

    /* 滚动到底部的时候固定按钮的位置 */
    &.scroll-to-pos {
      position: absolute;
      bottom: 0;
    }
  }

  &-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 44px;
    margin: 0 20px;
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    border-radius: 22px;
    user-select: none;

    span {
      line-height: 16px;
    }

    span:nth-child(2) {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  &.clock-in-days {
    margin-top: 10px;
    font-size: 13px;
    color: #666;

    span {
      font-weight: bold;
      color: #00b389;
    }
  }
}
</style>
