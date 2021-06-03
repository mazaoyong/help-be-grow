<template>
  <div
    v-theme.main-btn
    class="pc-action-block"
    :class="actionClassName"
    @click="() => actionHandler.call(this)"
  >
    {{ actionText }}
  </div>
</template>

<script>
import {
  resolveActionState,
  ActionState,
  actionText,
  actionHandler,
  actionClassName,
} from './resolveState';

export default {
  name: 'pc-action-block',

  rootState: ['goodsData', 'goodsType'],

  rootGetters: ['needCollectInfo'],

  data() {
    return {
      actionState: ActionState.UNSELL,
    };
  },

  computed: {
    actionText() {
      return actionText[this.actionState];
    },

    actionClassName() {
      return actionClassName[this.actionState];
    },

    actionHandler() {
      return actionHandler[this.actionState];
    },
  },

  watch: {
    goodsData: {
      immediate: true,
      handler(data) {
        if (data) {
          const {
            isOwnAsset,
            sellStatus,
          } = data;
          this.actionState = resolveActionState(
            isOwnAsset,
            sellStatus,
            window._global.user.has_login,
          );
        }
      },
    },
  },
};
</script>

<style lang="scss">
.pc-action-block {
  width: 102px;
  height: 32px;
  margin-top: 8px;
  font-size: 14px;
  line-height: 32px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background: #00b389;
  border-radius: 2px;
  box-sizing: border-box;

  &.action {
    &--disabled {
      color: #c8c9cc;
      background: #f7f8fa;
      border: 1px solid #ebedf0;
    }
  }
}
</style>
