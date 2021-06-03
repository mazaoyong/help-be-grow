/* eslint-disable camelcase */
import { ajax } from '@youzan/vis-ui';
import cookie from 'zan-utils/browser/cookie';
import args from 'zan-utils/url/args';

const from = args.get('from');
const kdtId = window._global.kdt_id;
const whiteList = ['降价拍', '团购返现', '周期购'];
const goodsSkuCache = {};
const goodsJumpCache = {};

function getPostData(data) {
  const {
    goodsId,
    selectedNum,
    selectedSkuComb,
    messages,
    postage = 0,
    activityAlias = '',
    activityId = 0,
    activityType = 0,
    orderFrom = '',
  } = data;
  /* eslint-disable */
  const goodsData = {
    goods_id: goodsId,
    sku_id: selectedSkuComb.id,
    price: selectedSkuComb.price,
    num: selectedNum,
    dc_ps: cookie('dc_ps') || '',
    qr: cookie('qr') || '',
    ...messages
  };
  const commonData = {
    postage,
    activity_alias: activityAlias,
    activity_id: activityId,
    activity_type: activityType,
    kdt_id: kdtId,
    use_wxpay: _global.wxpay_env ? 1 : 0,
    order_from: orderFrom,
    store_id: _global.offline_id || 0
  };
  /* eslint-enable */

  if (from) commonData.from = from;

  return {
    goodsData,
    commonData,
  };
}

export default {
  getGoodsActivity({ kdtId, goodsId }) {
    if (goodsJumpCache.hasOwnProperty(goodsId)) {
      return Promise.resolve(goodsJumpCache[goodsId]);
    }

    return ajax({
      url: '/v2/ump/activityInfo/activity.json',
      errorMsg: '获取商品数据失败，请重试',
      data: {
        kdt_id: kdtId,
        goods_id: goodsId,
      },
    }).then((activityInfo) => {
      let jumpToGoodsPage = false;
      for (let i = 0; i < whiteList.length; i++) {
        if (activityInfo.indexOf(whiteList[i]) !== -1) {
          jumpToGoodsPage = true;
          break;
        }
      }

      goodsJumpCache[goodsId] = jumpToGoodsPage;
      return jumpToGoodsPage;
    });
  },

  getGoodsSku(alias) {
    if (goodsSkuCache.hasOwnProperty(alias)) {
      return Promise.resolve(goodsSkuCache[alias]);
    }

    return ajax({
      url: '/v2/showcase/sku/skudata.json',
      errorMsg: '获取商品规格数据失败，请重试',
      data: {
        alias,
      },
    }).then((skuData) => {
      goodsSkuCache[alias] = skuData;
      return skuData;
    });
  },

  addWish(data) {
    return ajax({
      url: '/v2/trade/wish/add.json?kdt_id=' + kdtId,
      type: 'POST',
      errorMsg: '心愿添加失败',
      data,
    });
  },

  deleteWish(goodsId) {
    return ajax({
      url: '/v2/trade/wish/list.json?kdt_id=' + kdtId,
      type: 'DELETE',
      errorMsg: '心愿删除失败',
      data: {
        goods_id: goodsId,
      },
    });
  },

  addToCart(data) {
    return ajax({
      url: '/v2/trade/cart/goods.jsonp',
      dataType: 'jsonp',
      errorMsg: '添加购物车失败，请重试',
      data,
    });
  },

  goToBuy(data) {
    return ajax({
      url: '/v2/trade/common/cache.json',
      method: 'POST',
      errorMsg: '购买失败，请重试',
      data,
    });
  },

  getAddCartData(data) {
    const { goodsData, commonData } = getPostData(data);
    return {
      ...goodsData,
      ...commonData,
    };
  },

  getBuyData(data) {
    const { goodsData, commonData } = getPostData(data);
    return {
      goodsList: JSON.stringify([goodsData]),
      common: JSON.stringify(commonData),
    };
  },
};
