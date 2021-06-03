import { navigateEnv } from '@/common/utils/env';

function getChatText(shopConfig) {
  let text = '客服';
  try {
    const config = JSON.parse(shopConfig.webImInGoodsConfig);
    if (config.default) {
      text = config.label;
    }
  } catch (error) {}
  return text;
}

export default {
  icons(state, getters, rootState) {
    const { shopConfig, env } = rootState;
    const rule = [
      {
        show: Boolean(+shopConfig.isWebImInGoods),
        icon: 'chat-o',
        class: 'js-im-icon',
        text: getChatText(shopConfig),
        click(event) {
          if (env.isGuang) {
            event.stopPropagation();
            navigateEnv();
          }
        },
        log: ['click_contact_service', '点击联系客服'],
      },
      {
        show: Boolean(+shopConfig.showShopBtn),
        icon: 'shop-o',
        class: '',
        text: '店铺',
        click() {
          navigateEnv();
        },
        log: ['click_shop', '点击店铺'],
      },
    ];

    return rule.filter(item => item.show);
  },
};
