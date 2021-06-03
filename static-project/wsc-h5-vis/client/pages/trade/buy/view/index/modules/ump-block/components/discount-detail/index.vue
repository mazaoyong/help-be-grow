<template>
  <popup
    :value="value"
    :buttons="buttons"
    v-on="proxyListeners"
  >
    <div slot="title">
      {{ title }}
    </div>
    <div
      v-for="(detail, index) in discountDetail"
      :key="index"
      class="discount-detail__list"
    >
      <discount-item
        :tag-name="detail.name"
        :description="detail.title"
        :discount-info="detail.value"
      />
    </div>
    <discount-total
      v-if="discountDetail.length > 1"
      :total="total"
    />
  </popup>
</template>

<script>
import { Popup } from '@youzan/vis-ui';
import accAdd from '@youzan/utils/number/accAdd';
import DiscountItem from './discount-item';
import DiscountTotal from './discount-total';

export default {
  name: 'discount-detail',

  components: {
    Popup,
    DiscountItem,
    DiscountTotal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '',
    },

    discountDetail: {
      type: Array,
      default: () => {
        return [];
      },
    },

    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      buttons: [
        {
          text: '知道了',
          color: this.$theme.colors.main,
          onClick: this.onClickClose,
        },
      ],

      total: 0,
    };
  },

  mounted() {
    let total = 0;
    this.discountDetail.forEach(detail => {
      total = accAdd(total, detail.value);
    });
    this.total = total;
  },

  methods: {
    onClickClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .discount-detail {
    &__list {
      padding: 20px 16px;
    }
  }
</style>
