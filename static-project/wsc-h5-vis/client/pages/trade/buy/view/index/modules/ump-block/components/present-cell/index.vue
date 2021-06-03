<template>
  <card-cell title="赠品" :is-editable="!isOrderCreated" @click="onClickCell">
    <present-list-item
      v-for="item in presentList"
      :key="item.title"
      v-bind="item"
    />
  </card-cell>
</template>

<script>
import { CardCell } from '@/pages/trade/buy/components/card';
import PresentListItem from '../present-list-item';
import { openPresentDetailPopup } from '../present-detail';

export default {
  name: 'present-cell',

  components: {
    CardCell,
    PresentListItem,
  },

  state: ['present', 'goods', 'shop'],

  getters: ['isOrderCreated'],

  computed: {
    // 买赠列表
    presentList(state) {
      const { coupons = [], presents = [], score = 0 } = this.present;
      const { pointsName } = this.shop;
      const list = [];

      if (presents.length) {
        list.push({
          title: '送课程大礼包',
          desc: presents.map(
            item => `送${item.title} ${item.presentSkuDesc} ${item.num}份`
          ),
          goodsList: presents,
        });
      }

      if (coupons.length) {
        list.push({
          title: '送优惠券',
          desc: coupons.map(
            item =>
              `送${item.num}张${item.condition}${
                item.discount > 0 ? '打' : '减'
              }${item.valueDesc}${item.unitDesc}优惠券`
          ),
        });
      }

      if (score > 0) {
        list.push({
          title: `送${pointsName}`,
          desc: [`送${score}${pointsName}`],
        });
      }

      return list;
    },
  },

  methods: {
    onClickCell() {
      openPresentDetailPopup({
        props: {
          presentList: this.presentList,
          goodsList: this.present.presents,
        },
      });
    },
  },
};
</script>
