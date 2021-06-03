<template>
  <main
    ref="wrapper"
    class="chat-list-container js-scroller"
    @scroll="handleListScroll"
    @touchmove="handleMove"
  >
    <div
      ref="inner"
      class="list-inner"
      :style="{
        paddingBottom: padding + 'px'
      }"
    >
      <slot name="top" />

      <div v-if="showHeader" class="inner-header">
        <slot name="header" />
      </div>

      <div ref="innerBody" class="inner-body">
        <van-loading
          v-if="valueLocal && type === 'up'"
          type="spinner"
          class="list-inner__loading"
          size="20px"
        />
        <slot />
        <van-loading
          v-if="valueLocal && type === 'bottom'"
          type="spinner"
          class="list-inner__loading"
          size="20px"
        />
      </div>

      <div class="inner-footer">
        <slot name="footer" />
      </div>
    </div>
  </main>
</template>

<script>
import { Button, Loading } from 'vant';
import throttle from 'lodash/throttle';

let prevScrollTop = -100;

export default {

  name: 'chat',

  components: {
    [Button.name]: Button,
    [Loading.name]: Loading,
  },

  props: {
    loadmoreoffset: {
      type: [String, Number],
      default: 50,
    },
    type: {
      type: String,
      default: 'up',
    },
    value: { // loading
      type: Boolean,
      default: false,
    },
    finish: {
      type: Boolean,
      default: false,
    },
    lastOldItemId: {
      type: [Number, String],
      default: -1,
    },
    padding: [String, Number],
  },

  data() {
    return {
      scrollToBottomTimer: null,
      throttleScroll: null,
      reachBoundFn: null,
      throttleMove: null,
      valueLocal: this.value,

      isScrolling: false,
      showHeader: false, // 展示顶部列表区域
    };
  },

  watch: {
    value(newVallue) {
      this.valueLocal = newVallue;
    },
  },

  created() {

  },

  mounted() {
    // 滚动到新消息处，也要重置新消息状态
    this.$el.addEventListener('scroll', throttle(() => {
      const item = document.querySelector(`#chat-item--${this.lastOldItemId}`);
      if (item) {
        const rect = item.getBoundingClientRect();
        if (rect && rect.bottom < window.innerHeight) {
          this.$emit('update-last-old-item');
        }
      }
    }, 200));
  },

  methods: {
    handleListScroll(event) {
      if (this.isScrolling) {
        return;
      }

      // 判断滚动方向
      const wrapper = this.$refs.wrapper;
      let direction = 'up';
      if (prevScrollTop >= 0) {
        direction = wrapper.scrollTop - prevScrollTop > 0 ? 'down' : 'up';
      }
      prevScrollTop = wrapper.scrollTop;

      if (!this.throttleScroll) {
        const inner = this.$refs.inner;
        this.throttleScroll = throttle(() => {
          const rect = inner.getBoundingClientRect();
          event.listSize = { width: rect.width, height: rect.height };
          event.listOffset = {
            x: wrapper.scrollLeft,
            y: -wrapper.scrollTop,
          };
          this.$emit('scroll', event);
        }, 16, {
          trailing: true,
        });
      }
      this.throttleScroll();

      // 判断是否到达列表加载边界
      if (this.reachBound()(direction)) {
        // 如果不在加载 && 没有被 finish
        if (!this.valueLocal && !this.finish) {
          this.valueLocal = true;
          this.$emit('loadmore', direction);
          this.$emit('input', true);
        }
      }
    },
    handleMove(event) {
      // event.stopPropagation();
      if (!this.throttleMove) {
        this.throttleMove = throttle(() => {
          this.$emit('move', event);
        }, 16, {
          trailing: true,
        });
      }
      this.throttleMove();
    },
    reachTop() {
      const wrapper = this.$refs.wrapper;
      const offset = +this.loadmoreoffset || 0;
      return (!!wrapper) && (wrapper.scrollTop <= offset);
    },

    reachBottom(offsetNum) {
      const wrapper = this.$refs.wrapper;
      const inner = this.$refs.inner;
      const offset = offsetNum || (+this.loadmoreoffset || 0);
      if (wrapper && inner) {
        const innerHeight = inner.getBoundingClientRect().height;
        const wrapperHeight = wrapper.getBoundingClientRect().height;
        return wrapper.scrollTop >= innerHeight - wrapperHeight - offset;
      }
      return false;
    },

    reachBodyTop(direction) {
      const wrapper = this.$refs.wrapper;
      const innerBody = this.$refs.innerBody;
      const offset = +this.loadmoreoffset || 0;

      if (wrapper && innerBody) {
        const innerBodyTop = innerBody.getBoundingClientRect().top;
        const wrapperHeight = wrapper.getBoundingClientRect().height;
        if (direction === 'up') {
          return innerBodyTop + offset >= 0 && innerBodyTop + offset <= wrapperHeight;
        } else if (this.showHeader) {
          return innerBodyTop < wrapperHeight + offset && innerBodyTop > 0;
        }
      }
      return false;
    },

    reachBound() {
      if (!this.reachBoundFn) {
        this.reachBoundFn = this.reachBodyTop.bind(this);
      }
      return this.reachBoundFn;
    },

    /**
       * 以下方法暴露上上层组件
       */
    getContentHeight() {
      const inner = this.$refs.inner;
      return inner.getBoundingClientRect().height;
    },

    // 命名不规范 此为滑动距离
    getScrollHeight() {
      const wrapper = this.$refs.wrapper;
      return wrapper.scrollTop;
    },

    getWrapperHeight() {
      const wrapper = this.$refs.wrapper;
      return wrapper.getBoundingClientRect().height;
    },

    scrollToBottom(effect) {
      const wrapper = this.$refs.wrapper;
      const inner = this.$refs.inner;
      const bottomHeight = inner.getBoundingClientRect().height - wrapper.getBoundingClientRect().height + 20;

      if (!effect) {
        wrapper.scrollTop = bottomHeight;
        return true;
      }

      cancelAnimationFrame(this.scrollToBottomTimer);
      const fn = () => {
        var oTop = wrapper.scrollTop;
        if (oTop < bottomHeight) {
          wrapper.scrollTop = oTop + 100;
          this.scrollToBottomTimer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(this.scrollToBottomTimer);
        }
      };
      this.scrollToBottomTimer = requestAnimationFrame(fn);
    },
    scrollTo(offset, effect) {
      if (typeof offset === 'number') {
        offset = offset < 0 ? 0 : offset;
        const wrapper = this.$refs.wrapper;
        const inner = this.$refs.inner;
        const bottomHeight = inner.getBoundingClientRect().height - wrapper.getBoundingClientRect().height + 20;
        const maxOffset = offset > bottomHeight ? bottomHeight : offset;
        if (effect) {
          cancelAnimationFrame(this.scrollToBottomTimer);
          const type = wrapper.scrollTop < offset ? 'up' : 'down';
          const fnUp = () => {
            var oTop = wrapper.scrollTop;
            if (oTop < maxOffset) {
              wrapper.scrollTop = oTop + 100;
              this.scrollToBottomTimer = requestAnimationFrame(fnUp);
            } else {
              wrapper.scrollTop = offset;
              cancelAnimationFrame(this.scrollToBottomTimer);
            }
          };
          const fnDown = () => {
            var oTop = wrapper.scrollTop;
            if (oTop > offset) {
              wrapper.scrollTop = oTop - 100;
              this.scrollToBottomTimer = requestAnimationFrame(fnDown);
            } else {
              wrapper.scrollTop = offset;
              cancelAnimationFrame(this.scrollToBottomTimer);
            }
          };
          this.scrollToBottomTimer = requestAnimationFrame(type === 'up' ? fnUp : fnDown);
        } else {
          wrapper.scrollTop = offset;
        }
      }
    },

    scrollToItem(msgId) {
      this.isScrolling = true;
      const item = document.querySelector(`#chat-item--${msgId}`);
      if (item) {
        item.scrollIntoView();
      } else {
        this.scrollToBottom();
      }
      this.$nextTick(() => {
        this.isScrolling = false;
      });
    },

    scrollToTop() {
      this.isScrolling = true;
      this.showHeader = true;
      this.$refs.wrapper.scrollTop = 0;
      prevScrollTop = 0;
      this.$nextTick(() => {
        this.isScrolling = false;
      });
    },
  },
};
</script>

<style lang="scss">
  .chat-list-container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    padding-bottom: 20px;
  }
  .list-inner {
    overflow: hidden;

    &__loading {
      margin: 10px auto;
    }
  }
</style>
