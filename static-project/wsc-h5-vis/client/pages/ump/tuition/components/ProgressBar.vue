<template>
  <section class="progress-bar">
    <header>
      <div ref="messageContainer" class="message">
        <!-- 此处不接受用户输入，保证无风险 -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span ref="messageChild" class="message-child" v-html="message" />
      </div>
      <div class="pop-tip">
        {{ popTip }}
      </div>
    </header>
    <div class="bar">
      <span
        v-for="point of points"
        :key="point.number"
        class="point"
        :class="{ last: point.last, ani: animation }"
        :style="{
          left: `${point.position}%`,
          backgroundColor: point.fill ? '#ff4a00' : '#fdddc3',
        }"
      >
        <van-icon
          v-if="point.fill && !point.last"
          name="success"
          size="8"
          color="#fff"
        />
        <figure v-if="point.last" class="redpacket" />
        <span
          v-if="point.text && !point.last"
          class="point-desc"
          :class="{ first: point.first }"
        >
          {{ point.text }}
        </span>
      </span>
      <div
        class="progress"
        :class="{ ani: animation }"
        :style="{ width: `${width}%` }"
      />
    </div>
  </section>
</template>

<script>
import Vue from 'vue';
import { Icon } from 'vant';

export default Vue.extend({
  /** progress 是 html 原生标签 */
  name: 'progress-bar',
  components: {
    'van-icon': Icon,
  },

  props: {
    notStart: {
      type: Boolean,
      default: false,
    },
    animation: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Array,
      default: () => [],
    },
    message: {
      type: String,
      default: '',
    },
    progress: {
      type: Number,
      default: 0,
    },
    popTip: {
      type: String,
      default: 'loading',
    },
  },
  computed: {
    points() {
      if (this.animation) {
        return [
          {
            position: 0,
            fill: true,
            text: '',
            first: true,
          },
          {
            position: 100,
            fill: false,
            text: '',
            last: true,
          },
        ];
      }
      const length = this.config.length;
      if (length === 0) {
        return [];
      }
      if (length === 1) {
        const [config] = this.config;
        return [
          {
            number: 0,
            position: 0,
            fill: !this.notStart && this.progress > 0,
            text: '',
            first: true,
          },
          {
            number: config.helpCnt,
            position: 100,
            fill: false,
            text: `${config.amount / 100}元`,
            last: true,
          },
        ];
      }
      return this.config.map((item, idx) => {
        const { amount, helpCnt } = item;
        const last = idx === length - 1;
        const fill = !this.notStart && this.progress >= helpCnt && !last;
        return {
          last,
          fill,
          number: helpCnt,
          position: ((100 / (length - 1)) * idx).toFixed(2),
          text: `${amount / 100}元`,
          first: idx === 0,
        };
      });
    },
    width() {
      const length = this.points.length;

      const unit = 100 / (length - 1);
      let width = 0;
      let currentPoint;
      let nextPoint;
      for (let idx = 0; idx < length; idx++) {
        const point = this.points[idx];
        if (point.fill) {
          if (idx > 0) {
            width += unit;
          }
          currentPoint = point;
        } else {
          nextPoint = point;
          break;
        }
      }

      if (!currentPoint) {
        return '0';
      }

      if (!nextPoint) {
        return '100';
      }

      const total = nextPoint.number - currentPoint.number;

      width += ((this.progress - currentPoint.number) / total) * unit;

      return width.toFixed(2);
    },
  },

  updated() {
    this.adjustMessageSize();
  },

  mounted() {
    this.adjustMessageSize();
  },

  methods: {
    // 调整字号，确保一行能显示下
    adjustMessageSize() {
      /**
       * 思路：文字单独开一个容器(子容器），CSS 保证不换行，父容器设置 overflow： hidden，
       *      那么在父容器的定宽下，一行显示不全的时候，子容器宽度必然大于父容器，
       *      这时，只需把父容器的宽度除子容器的宽度，即可得到缩放倍数，给子容器加上这个缩放即可。
       */
      const messageContainer = this.$refs.messageContainer;
      const messageChild = this.$refs.messageChild;
      if (!(messageContainer && messageChild)) {
        return;
      }

      const {
        width: messageContainerWidth,
      } = messageContainer.getBoundingClientRect();

      const {
        width: messageChildWidth,
      } = messageChild.getBoundingClientRect();

      if (messageChildWidth <= messageContainerWidth) {
        return;
      }
      const scale = messageContainerWidth / messageChildWidth;
      messageChild.style.transform = `scale(${scale.toFixed(2)})`;
    },
  },
});
</script>

<style lang="scss" scoped>
$bar-background: #fdddc3;

.progress-bar {
  box-sizing: border-box;
  padding-bottom: 8px;
}

header {
  height: 28px;
  display: flex;
  justify-content: space-between;

  .message {
    flex: 1;
    align-self: flex-end;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
    overflow: hidden;
    margin-right: 4px;
    .message-child {
      display: inline-block;
      word-break: keep-all;
      white-space: nowrap;
      transform-origin: 0 center;
    }
  }

  .pop-tip {
    flex: none;
    height: 24px;
    display: flex;
    justify-content: center;
    background-color: #ff4a00;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    box-sizing: border-box;
    padding: 3px 6px;
    color: white;
    position: relative;
    align-items: center;
    z-index: 1;
    align-self: flex-start;
    &:after {
      background-color: #ff4a00;
      display: block;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      position: absolute;
      border-radius: 1px;
      left: 0;
      right: 0;
      margin: auto;
      bottom: -3px;
      content: "";
    }
  }
}

.bar {
  background: $bar-background;
  height: 6px;
  border-radius: 3px;
  position: relative;
  margin: 10px 22px 10px 6px;
  .point {
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bar-background;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 2;
    background: #ff4a00;
    transform: translateX(-50%);
    &.last {
      width: 24px;
      height: 24px;
      &.ani {
        background: linear-gradient(90deg, #ff4a00 50%, #fdddc3 0%);
        background-size: 200%;
        background-position: 100% 0;
        animation: point-grow 800ms ease-in-out infinite;
      }
    }

    .redpacket {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(https://b.yzcdn.cn/public_files/2cca9040c7be53f1fb6a0361f05e97f1.png);
      animation: shake 400ms infinite;
    }
    .point-desc {
      position: absolute;
      bottom: -16px;
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #ff4a00;
      word-break: keep-all;
      &.first {
        left: 0;
      }
    }
  }
  .progress {
    border-radius: inherit;
    background: #ff4a00;
    left: 0;
    top: 0;
    height: 100%;
    /* width: 50%; */
    position: absolute;
    z-index: 1;
    &.ani {
      animation: grow 800ms ease-in-out infinite;
    }
  }

  @keyframes grow {
    from {
      width: 80%;
    }
    25% {
      width: 98%;
    }
    75% {
      width: 98%;
    }
    to {
      width: 80%;
    }
  }

  @keyframes point-grow {
    from {
      background-position: 100% 0;
    }

    25% {
      background-position: 100% 0;
    }

    50% {
      background-position: 0% 0;
    }

    75% {
      background-position: 100% 0;
    }

    to {
      background-position: 100% 0;
    }
  }

  /* @TODO: 提取到公用样式里 */
  @keyframes shake {
    from {
      transform: rotate(0);
    }
    25% {
      transform: rotate(10deg);
    }
    75% {
      transform: rotate(-10deg);
    }
    to {
      transform: rotate(0);
    }
  }
}
</style>
