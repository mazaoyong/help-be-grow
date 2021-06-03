<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :need-log="true"
    :log-id="item.id"
    :title="item.name"
    :subtitle="item.summary"
    :status-list="statusList"
    :footer-corner-text="priceText"
    :footer-corner-text-class="priceTextClass"
  />
</template>

<script>
import ListItem from 'components/list-item';

const BUY_STATUS = {
  PAID: 0,
  NORMAL: 1,
  FREE: 2,
};

export default {
  name: 'benefit-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      baseUrl: 'https://h5.youzan.com/v2',
    };
  },

  computed: {
    isPaid() {
      return this.buyStatus === BUY_STATUS.PAID;
    },

    buyStatus() {
      const {
        price,
        isBought = false,
      } = this.item.buyStatus || {};

      if (isBought) return BUY_STATUS.PAID;
      if (price === 0) return BUY_STATUS.FREE;

      return BUY_STATUS.NORMAL;
    },

    price() {
      const price = this.item.price ||
        (this.item.buyStatus && this.item.buyStatus.price) ||
        '';
      return price || price === 0 ? (price / 100).toFixed(2) : price;
    },

    // 价格文字
    priceText() {
      return [
        '已购买',
        this.price ? `￥ ${this.price}` : '',
        '免费',
      ][this.buyStatus];
    },

    priceTextClass() {
      if (this.isPaid) return '';

      return 'text-red';
    },

    statusList() {
      const list = [];
      const {
        periodsCount = 0,
        subscriptionsCount = 0,
      } = this.item;

      const periodInfo = ' 已包含内容' + periodsCount + '个';
      if (periodsCount) list.push(periodInfo);

      if (!this.isPaid && subscriptionsCount) list.push(subscriptionsCount + '人已购');

      return list;
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return `${this.baseUrl}/ump/paidcontent/index?page=vipbenefit&alias=${this.item.alias}&kdt_id=${this.kdtId}`;
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
