export function logRecommendGoods(index) {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'recommend_goods',
    en: '点击推荐商品',
    pt: 'paidStatus',
    params: {
      index,
    },
  });
}
