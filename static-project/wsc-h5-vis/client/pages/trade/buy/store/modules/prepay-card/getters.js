import { some, includes } from 'lodash';

export const getters = {
  useExclusionCard(state) {
    const giftCardList = state.giftCard.list;
    const valueCardList = state.valueCard.list;
    const giftCardChecked = state.giftCard.checked;
    const valueCardChecked = state.valueCard.checked;

    // 存在互斥卡时，需要禁用优惠券和店铺活动
    const hasExclusion =
      some(
        giftCardList,
        (card) =>
          card.isExclusion && includes(giftCardChecked, card.summaryCardNo)
      ) ||
      some(
        valueCardList,
        (card) =>
          card.isExclusion && includes(valueCardChecked, card.summaryCardNo)
      );
    return hasExclusion;
  },
};
