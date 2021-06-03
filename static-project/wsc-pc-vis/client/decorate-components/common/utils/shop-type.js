import get from 'lodash/get';

export const isWscShop = () => {
  const shopType = get(window._global, 'shopInfo.shopType');
  // 微商城 shopType in (0,2,9)
  return shopType === 9 || shopType === 0 || shopType === 2;
};
