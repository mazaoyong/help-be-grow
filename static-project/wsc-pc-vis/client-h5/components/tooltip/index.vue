<template>
  <div>
    <div
      @click="onToggle"
    >
      <slot />
    </div>
    <!-- <transition
      @before-enter="beforeEnter"
    >

    </transition> -->
  </div>
</template>

<script>
// content 距离 trigger 的位置
import Vue from 'vue';
import Content from './Content.vue';
const OFFSET = 8;
let instance;
export default {
  props: {
    position: {
      type: String,
      default: 'bottom-right',
    },
    maxWidth: {
      type: String,
      default: '259px',
    },
    containerSelector: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showTip: false,
      toolTipStyle: {
        maxWidth: this.maxWidth,
      },
    };
  },

  created() {
    document.addEventListener('click', function(ev) {
      instance && (instance.showTip = false);
    });
  },

  methods: {
    getContainerEl() {
      return document.querySelector(this.containerSelector);
    },
    onToggle(ev) {
      ev.stopPropagation();

      function createInstance() {
        if (instance) {
          return instance;
        }
        instance = new (Vue.extend(Content))({
          el: document.createElement('div'),
        });

        const containerEl = this.getContainerEl();

        if (containerEl) {
          containerEl.appendChild(instance.$el);
        } else {
          document.body.appendChild(instance.$el);
        }
        return instance;
      }

      const contentInstance = createInstance.call(this);

      contentInstance.showTip = false;
      contentInstance.showTip = true;
      contentInstance.slotContent = this.$slots.content;
      contentInstance.toolTipStyle = this.toolTipStyle;
      contentInstance.$nextTick(() => {
        contentInstance.toolTipStyle = Object.assign({}, this.toolTipStyle, this.genContentPositionStyle());
      });
    },
    genContentPositionStyle() {
      const trigger = this.$slots.default[0];
      const triggerEl = trigger && trigger.elm;
      const contentEl = instance.$el;

      if (triggerEl) {
        const direction = this.getTriggerRelativePosition(triggerEl);

        const contentWidth = contentEl.offsetWidth;
        // const contentHeight = contentEl.offsetHeight;

        // const triggerWidth = triggerEl.offsetWidth;
        const triggerHeight = triggerEl.offsetHeight;

        const contentX = direction.right - contentWidth;
        const contentY = triggerHeight + direction.top + OFFSET;

        return {
          left: `${contentX}px`,
          top: `${contentY}px`,
        };
      }
    },

    getTriggerRelativePosition(triggerEl) {
      const containerEl = this.getContainerEl();
      if (containerEl) {
        const triggerDirection = triggerEl.getBoundingClientRect();
        const containerDirection = containerEl.getBoundingClientRect();
        console.log(triggerDirection, containerDirection);

        const containerScrollTop = containerEl.scrollTop;
        const containerScrollLeft = containerEl.scrollLeft;

        return {
          ...triggerDirection,
          x: triggerDirection.x - containerDirection.x + containerScrollLeft,
          y: triggerDirection.y - containerDirection.y + containerScrollTop,
          left: triggerDirection.left - containerDirection.left + containerScrollLeft,
          top: triggerDirection.top - containerDirection.top + containerScrollTop,
          right: triggerDirection.right - containerDirection.left + containerScrollLeft,
          bottom: triggerDirection.bottom - containerDirection.top + containerScrollTop,
        };
      } else {
        return triggerEl.getBoundingClientRect();
      }
    },
  },
};
</script>

<style lang="scss">

</style>
