const { _global } = window;

const moneyToYuan = money => {
  money = parseFloat(money / 100) || 0;
  return +(Math.round(money * (10 ** 2)) / (10 ** 2)).toFixed(2);
};

const getSkuPrice = (hasMultiSkus, skus, totalStock) => {
  let price = 0;
  let priceInYuan = 0;
  let priceInFen = 0;

  if (hasMultiSkus) {
    const filterNum = totalStock ? 0 : -1;
    const sortSku = skus
      .filter(v => v.stockNum > filterNum)
      .sort((a, b) => a.collocationPrice - b.collocationPrice);
    const len = sortSku.length;
    const minPrice = sortSku[0].collocationPrice;
    const maxPrice = sortSku[len - 1].collocationPrice;

    price = maxPrice;
    priceInYuan = minPrice !== maxPrice ? `${moneyToYuan(minPrice)}-${moneyToYuan(maxPrice)}` : moneyToYuan(minPrice);
    priceInFen = minPrice !== maxPrice ? [minPrice, maxPrice] : maxPrice;
  } else {
    price = skus[0].collocationPrice;
    priceInYuan = moneyToYuan(skus[0].collocationPrice);
    priceInFen = skus[0].collocationPrice;
  }
  return {
    price,
    priceInYuan,
    priceInFen,
  };
};

const getOriginPrice = (hasMultiSkus, price, skus, totalStock) => {
  const filterNum = totalStock ? 0 : -1;
  const sortSku = skus
    .filter(v => v.stockNum > filterNum)
    .sort((a, b) => a.price - b.price);
  const len = sortSku.length;

  if (!hasMultiSkus) {
    return {
      price,
      originPrice: moneyToYuan(price),
    };
  }

  const minPrice = sortSku[0].price;
  const maxPrice = sortSku[len - 1].price;

  const originPrice = minPrice !== maxPrice ? `${moneyToYuan(minPrice)}-${moneyToYuan(maxPrice)}` : moneyToYuan(minPrice);
  const priceInFen = minPrice !== maxPrice ? [minPrice, maxPrice] : minPrice;
  return {
    price: maxPrice,
    originPrice,
    priceInFen,
  };
};

const getDesc = (hasMultiSkus, isMatchPackage, num = 1) => {
  let desc = '';

  if (isMatchPackage) {
    desc = `已选择商品数量：${num}`;
  }

  if (hasMultiSkus) {
    desc = '请选择规格';
  }
  return desc;
};

// 加购或下单校验
const payCheck = (payGoodsList, isMatchPackage) => {
  const goodsListLength = payGoodsList.length;
  const isNeedChooseSku = payGoodsList.some(v => !v.skuId);

  if (goodsListLength < 1) {
    return '至少选择一个套餐';
  }

  if (isMatchPackage && goodsListLength < 2) {
    return '至少选择一个搭配商品';
  }

  if (isNeedChooseSku) {
    return '还有商品没选规格';
  }

  return '';
};

// 获取下单数据
const getPayData = (currentActivity, payGoodsList) => {
  const { activityAlias, activityId } = currentActivity;
  const common = {
    kdt_id: _global.kdt_id,
    activityAlias,
    activityId,
    type: 'package',
  };

  return {
    common: JSON.stringify(common),
    goodsList: JSON.stringify(payGoodsList),
  };
};

const getCurrentActivityPrice = (skus, skuId) => {
  let originPrice = 0;
  let activityPrice = 0;
  let price = 0;

  skus.forEach(v => {
    if (v.id === skuId) {
      price = v.collocationPrice;
      // activityPrice = moneyToYuan(v.collocationPrice);
      originPrice = moneyToYuan(v.price);
      activityPrice = v.collocationPrice;
    }
  });

  return {
    originPrice,
    activityPrice,
    collocationPrice: price,
  };
};

export {
  moneyToYuan,
  getSkuPrice,
  getOriginPrice,
  getDesc,
  payCheck,
  getPayData,
  getCurrentActivityPrice,
};
