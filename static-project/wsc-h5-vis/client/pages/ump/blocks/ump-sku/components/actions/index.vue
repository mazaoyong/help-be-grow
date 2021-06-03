<template>
  <div class="sku-actions">
    <van-button
      v-for="(button, index) in buttons"
      :key="index"
      class="button"
      :color="getColor(index)"
      :style="{ color: getFontColor(index) }"
      square
      @click="handleClick(button.type)"
    >
      {{ button.text }}
    </van-button>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import { mapState } from 'vuex';

export default {
  components: {
    'van-button': Button,
  },

  props: {
    // eslint-disable-next-line vue/require-prop-types
    payload: {
      default: null,
    },
  },

  computed: {
    ...mapState(['activityType', 'selectedSku', 'skuButtonsMap']),
    buttons() {
      return this.skuButtonsMap[+this.activityType];
    },
  },

  methods: {
    handleClick(type) {
      if (!this.selectedSku) {
        Toast('请选择规格');
        return;
      }
      this.$emit('click', this.selectedSku);
    },

    getColor(index) {
      if (index === this.buttons.length - 1) {
        return this.$theme.colors.main;
      }
      return this.$theme.colors.vice;
    },

    getFontColor(index) {
      if (index === this.buttons.length - 1) {
        return '#fff';
      }
      return this.$theme.colors.main;
    },
  },
};
</script>

<style lang="scss" scoped>
.sku-actions {
  display: flex;
  padding: 4px 16px;

  .button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 0 none;

    &:first-child {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    &:last-child {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
}
</style>
