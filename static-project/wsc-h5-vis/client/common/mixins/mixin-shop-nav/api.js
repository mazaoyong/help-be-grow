import ajax from 'captain-ajax';

const global = window._global;
// 叮当app不显示店铺导航（迁移自原店铺导航代码）
const isDingdangApp = global.platform === 'c2a7b9269fd095fa5b1467769433688';
const hideShopNav = (global.open_app_config || {}).hide_shop_nav;

export const getShopNav = () => {
  if (hideShopNav || isDingdangApp) {
    return new Promise((resolve, reject) => {
      reject({ hideNav: true });
    });
  }
  return ajax({
    url: '/wscshop/showcase/shopnav/nav_v2.json',
    data: {
      url: window.location.href,
      'kdt_id': global.kdt_id,
      'showcase_type': 'feature',
      // 'return_type': 'json'
    },
  }).then(resp => {
    const shopNav = resp.data || {};
    shopNav.navData = shopNav.navs;
    return shopNav;
  }).catch(err => {
    console.log(err);
  });
};
