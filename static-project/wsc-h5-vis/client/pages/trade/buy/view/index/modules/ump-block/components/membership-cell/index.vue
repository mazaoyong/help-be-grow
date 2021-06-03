<template>
  <card-cell
    v-log:click="{
      ei: 'edu_click_btn',
      en: '教育下单点击页面按钮',
      pt: 'trade',
      params: {
        btn_name: 'edu_membership_cell',
      },
    }"
    title="会员优惠"
    tip="暂无会员优惠可用"
    icon="info-o"
    :value="value"
    :is-editable="!isOrderCreated"
    @click="onClickCell"
    @click-icon.stop="onClickIcon"
  />
</template>

<script>
import { CardCell } from '@/pages/trade/buy/components/card';
import { openMembershipTipsPopup } from '../membership-tips';
import { openMembershipListPopup } from '../membership-list';

export default {
  name: 'membership-cell',

  components: {
    CardCell,
  },

  state: ['customerCard', 'unavailableCustomerCards'],

  getters: ['chosenCustomCard', 'isOrderCreated'],

  computed: {
    value() {
      if (this.chosenCustomCard.name) {
        return this.chosenCustomCard.name;
      }

      return '有可使用的会员优惠';
    },
  },

  methods: {
    onClickIcon() {
      openMembershipTipsPopup();
    },

    onClickCell() {
      const self = this;
      const prevId = this.customerCard.chosenId;
      // console.log(this.customerCard.list);
      // console.log(this.unavailableCustomerCards);
      // const list = [
      //   {
      //     chosen: false,
      //     desc: "部分商品",
      //     id: "3623_122",
      //     name: "2折卡",
      //   },
      //   {
      //     chosen: false,
      //     desc: "部分商品会员价",
      //     id: "37673_1",
      //     name: "4折卡",
      //   },
      //   {
      //     chosen: false,
      //     desc: "部分商品会员价",
      //     id: "627673_1",
      //     name: "3折卡",
      //   },
      // ]
      openMembershipListPopup({
        props: {
          chosenCard: prevId,
          cards: this.customerCard.list,
          unavailableCards: this.unavailableCustomerCards,
          // unavailableCards: list,
        },
        on: {
          select(id, closePopup) {
            if (self.isOrderCreated || prevId === id) {
              return;
            }

            // 选中卡之后会重新调用comfirm更新订单信息
            // 如果更新失败，则回填之前选中的卡
            self.$commit('SET_CHOSEN_CUSTOM_CARD_ID', id);
            self
              .$dispatch('FETCH_POST_CONFIRM_ORDER', { source: 'customerCard' })
              .then(() => {
                closePopup();
              })
              .catch(() => {
                self.$commit('SET_CHOSEN_CUSTOM_CARD_ID', prevId);
              });
          },
        },
      });
    },
  },
};
</script>
