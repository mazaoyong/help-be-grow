export function formatInput({ goodsItemList = [] }) {
  return {
    online: {
      type: 'part',
      value: goodsItemList.map(goodsItem => {
        const sku = goodsItem.skuIdList.filter(Boolean).map(skuId => ({ skuId }));
        return {
          id: goodsItem.goodsId,
          goodsId: goodsItem.goodsId,
          isSku: sku.length > 0,
          skuInfo: {
            sku,
          },
        };
      }),
    },
  };
}

export function formatOutput(selected) {
  const goodsItemList = [];

  Object.keys(selected).forEach(key => {
    const _value = selected[key] && selected[key].value;
    if (_value) {
      _value.forEach(item => {
        goodsItemList.push({
          goodsId: item.id,
          skuIdList: item.isSku ? item.skuInfo.sku.map(({ skuId }) => skuId) : [],
        });
      });
    }
  });

  return goodsItemList;
}

export function convertSkuInfo(skuInfo) {
  const columns = [];
  let index = 1;
  while (true) {
    const k = skuInfo['skuName' + index];
    const v = skuInfo['skuName' + index + 'Value'];
    if (!k || !v) {
      break;
    }
    columns.push({
      _id: k.dictId,
      text: k.text,
      spec: v.map(({ text }) => ({
        text,
      })),
    });
    // check next
    index++;
  }

  const sku = skuInfo.stocks.map(stock => {
    const result = {
      skuId: stock.id,
      price: stock.price,
      stock: stock.stockNum,
      canSelect: (stock.price !== 0) && (stock.stockNum !== 0), // other canSelect will be set here
    };
    let index = 1;
    while (true) {
      const k = stock['k' + index + 'Id'];
      const v = stock['v' + index];
      if (!k || !v) {
        break;
      }
      result['IFWEN2234_N3K_32R2' + k] = v;
      // check next
      index++;
    }
    return result;
  });
  return {
    sku,
    columns,
  };
}

export function isEnabled(arr, target) {
  return arr && arr.indexOf(target) !== -1;
}
