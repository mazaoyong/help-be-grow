/**
 * @file 解析拼团活动数据，生成分享文案
 * @description 分享文案是「拼团立省 X 元」，X 是参加拼团的各商品中原价与拼团价之差的最大值
 * @see {@link https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=79429}
 * @author Xiao Jianjian <zhengjian@youzan.com>
 */

import formatMoney from '@/pages/course/detail/utils/formatMoney';

/**
 * 获取商品的 sku->原价的 Map
 *
 * @param {Object} skuData - 商品信息 sku 配置
 * @param {boolean} skuData.hasSku - 是否有 sku
 * @param {Array.<{id: number, price: number}>} skuData.list - sku 信息列表
 * @return {Object.<number, number>} map
 */
const getSkuOriginPriceMap = (skuData) => {
  if (!skuData.hasSku) {
    return {};
  }
  const skuPriceTable = skuData.list?.reduce((map, { id, price }) => {
    map[id] = price;
    return map;
  }, Object.create(null));
  return skuPriceTable || {};
};

/**
 * 获取拼团活动的分享文案
 *
 * @param {Object} goodsData - 解析后的商品信息，用来取 sku 对应的原价
 * @param {Object} goodsData.sku - 商品信息 sku 配置
 * @param {boolean} goodsData.sku.hasSku - 是否有 sku
 * @param {Array.<{id: number, price: number}>} goodsData.sku.list - sku 信息列表
 * @param {Object.<number, {price: number}>} skuActivityPriceMap -「skuId -> 活动价」的 Map
 * @param {number} singleSkuPrice - 无 SKU 时候的活动价
 * @return {{title: string}} 拼团活动分享文案配置
 */
const getShareInfo = (goodsData = {}, skuActivityPriceMap, singleSkuPrice) => {
  const { sku = {} } = goodsData;

  let discount = -Infinity;

  if (sku.hasSku) {
    const skuOriginPriceMap = getSkuOriginPriceMap(sku);
    // 计算两个 Price Map 的最高差价
    discount = Object.entries(skuActivityPriceMap).reduce((result, [skuId, { price }]) => {
      // undefined 等强行转换 0
      const _discount = Number(skuOriginPriceMap[skuId]) - Number(price);
      return Math.max(_discount, result);
    }, discount);
  } else {
    // 没有 SKU 就一个价格啦
    discount = Number(sku.maxPrice) - singleSkuPrice;
  }

  const shareInfo = {
    title: goodsData.title,
  };

  // 差价小于 0 ，指定出问题了，走降级逻辑
  if (Number.isNaN(discount) || discount <= 0) {
    shareInfo.title += '超低限时拼团价';
  } else {
    shareInfo.title += `拼团立省${formatMoney(discount)}元`;
  }

  return shareInfo;
};

export default getShareInfo;
