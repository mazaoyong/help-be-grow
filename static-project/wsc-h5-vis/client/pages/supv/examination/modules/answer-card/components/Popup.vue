<template>
  <div class="answer-card-popup">
    <vis-popup
      v-model="value"
      :lazy-render="false"
      :class="{
        'vis-standard-popup--fix-bottom': !value,
        'vis-standard-popup--android': isAndoird,
      }"
      @close="$emit('input', false)"
    >
      <header @click="$emit('input', !value)">
        <vis-icon
          v-if="value"
          class="answer-card-popup__btn-fold"
          name="fold"
          size="24px"
        />
        <vis-icon
          v-else
          class="answer-card-popup__btn-unfold"
          name="unfold"
          size="24px"
        />

        <slot name="header" />
      </header>

      <main>
        <slot name="content" />
      </main>

      <slot name="footer" />
    </vis-popup>
  </div>
</template>

<script>
import { Popup as VisPopup, Icon as VisIcon } from '@youzan/vis-ui';
import UA from '@youzan/utils/browser/ua_browser';

export default {
  name: 'answer-card-popup',

  components: {
    VisPopup,
    VisIcon,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isAndoird: UA.isAndroid(),
    };
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer-card-popup {
  .vis-standard-popup {
    z-index: 1;
    display: block !important;
  }

  // 弹层收起时
  .vis-standard-popup--fix-bottom {
    transform: translateY(calc(100% - 48px));

    .vis-standard-popup__content {
      overflow: hidden;
    }
  }

  .vis-standard-popup__content {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    height: 48px;
    padding: 0 23px 0 16px;
    background: $white;
    box-shadow: inset 0 -1px 0 0 $light-gray-2;
    box-sizing: border-box;
    flex: 0 0 auto;
    justify-content: space-between;
    align-items: center;
  }

  main {
    flex: 1 1 auto;
    padding: 0 16px 16px 0;
  }

  .vis-icon {
    position: absolute;
  }

  &__btn-fold,
  &__btn-unfold {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.is-iphonex {
  .vis-standard-popup--fix-bottom.vis-standard-popup--android {
    transform: translateY(calc(100% - 82px));

    header {
      height: 82px;
      padding-bottom: 34px;
    }
  }

  .vis-standard-popup--android {
    .vis-standard-popup__content {
      padding-bottom: 34px;
    }
  }
}
</style>
