export const mutations = {
  SWITCH_PREPAY_CARD_CHECK_STATUS(state, { card, cardType }) {
    const { checked } = state[cardType];
    const index = checked.indexOf(card.summaryCardNo);
    if (index !== -1) {
      checked.splice(index, 1);
    } else {
      checked.push(card.summaryCardNo);

      // 礼品卡与储值卡互斥
      // 老版储值的逻辑
      if (cardType === 'giftCard') {
        state.valueCard.checked = [];
      } else if (cardType === 'valueCard') {
        state.giftCard.checked = [];
      }
    }
  },
};
