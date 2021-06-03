<template>
  <van-popup
    v-model="show"
    position="bottom"
    round
    class="present-pop"
  >
    <div class="present-pop__title">
      <span>课程大礼包</span>
      <vis-icon
        name="close-o"
        font-size="16px"
        color="#bbb"
        @click="onCloseSkuPromotionPop"
      />
    </div>
    <present-list
      :present-good-list="presentGoodList"
      bg-color="#f2f3f5"
      :is-can-redirect="isCanRedirect"
    />
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
import { Icon } from '@youzan/vis-ui';
import PresentList from '../../PresentList';

export default {
  name: 'present-pop',

  components: {
    'van-popup': Popup,
    'vis-icon': Icon,
    PresentList,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    presentGoodList: {
      type: Array,
      default: () => {
        return [];
      },
    },

    isCanRedirect: {
      type: Boolean,
      default: false,
    },
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

  methods: {
    onCloseSkuPromotionPop() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.present-pop {
  height: 450px;

  &__title {
    position: relatvie;
    height: 38px;
    line-height: 38px;
    font-weight: 500;
    font-size: 17px;
    text-align: center;

    .vis-icon {
      position: absolute;
      right: 15px;
      top: 11px;
    }
  }
}
</style>
