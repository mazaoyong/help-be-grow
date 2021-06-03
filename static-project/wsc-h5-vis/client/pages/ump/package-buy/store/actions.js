import { Toast } from 'vant';
import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import api from '../api';
import * as BuyApi from '@/common-api/buy';
import { payCheck, moneyToYuan } from '../common';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import * as Log from '../track';

const setShareConfig = (activityInfo) => {
  try {
    const { title, pictureUrl, price, type } = activityInfo;
    // 微信分享
    const text = type === 1 ? `最低 ${moneyToYuan(price)} 元` : `${moneyToYuan(price)} 元`;

    const shareData = {
      title: `${title}限时套餐${text}`,
      desc: '快来和我一起报名吧！',
      cover: pictureUrl,
      link: getShareLink(window.location.href),
    };
    setShareData(shareData);
  } catch (e) {
    console.log(e);
  }
};

const actions = {
  // 获取活动列表
  FETCH_PACKAGES({ state, commit }, payload) {
    const { activityAlias, productAlias } = payload;
    api.getPackageList({ activityAlias, productAlias })
      .then(res => {
        if (res[0] && res[0].activity) {
          setShareConfig({ ...res[0].activity });
        }
        commit('INIT_DATA', res);
      })
      .catch(() => {
        commit('INIT_DATA', []);
      });
  },
  // 去购买
  GO_BUY({ state }) {
    const { payGoodsList = [], isMatchPackage, currentActivity } = state;

    Log.logClickSubmit({
      type: isMatchPackage ? 1 : 0,
      num: payGoodsList.length,
    });

    const errMsg = payCheck(payGoodsList, isMatchPackage);

    if (errMsg) {
      return Toast(errMsg);
    }

    const activityAlias = currentActivity.activityAlias;
    const activityId = currentActivity.activityId;

    // @TODO gaotian
    // 下单页白名单
    Promise.resolve().then(() => {
      const productInfoList = (payGoodsList || []).map(item => ({
        alias: item.alias,
        id: item.goodsId,
        skuId: item.skuId,
        num: item.num,
        owlType: item.owlType,
      }));

      const params = {
        productInfoList,
      };

      const umpInfo = {};
      umpInfo.promotionType = 7;
      umpInfo.promotionId = activityId;
      umpInfo.promotionAlias = activityAlias;
      params.umpInfo = umpInfo;

      return BuyApi.postBookKey(params).then(({ bookKey }) => {
        BuyApi.goTradeBuy({
          book_key: bookKey,
        });
      });
    });
  },

  // 获取商品sku
  FETCH_GOODS_SKU({ state, commit }, payload) {
    const { activityId, productAlias, packageIndex, goodsIndex } = payload;
    const actGoodsId = `${activityId}${productAlias}`;

    // 请求过sku数据不再请求
    if (state.goodsSkus[actGoodsId]) {
      commit('SHOW_SKU_POPUP', {
        sku: state.goodsSkus[actGoodsId],
        packageIndex,
        goodsIndex,
        productAlias,
      });
      return;
    }

    Toast.loading();
    api.getSkus({
      activityId,
      productAlias,
    }).then(res => {
      const skus = mapKeysToSnakeCase(res);
      (skus.list || []).forEach(item => {
        if (!item.is_selected) {
          item.stock_num = 0;
        }
      });

      commit('SHOW_SKU_POPUP', {
        sku: skus,
        packageIndex,
        goodsIndex,
        productAlias,
      });
      Toast.clear();
    }).catch(() => {
      Toast('获取规格信息失败');
    });
  },
};
export default actions;
