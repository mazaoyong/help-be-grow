import { PRODUCT_TYPE } from './constants';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export function goodsListAdaptor(goodsList) {
  return goodsList.map(item => {
    return {
      id: item.productId,
      title: item.title,
      price: ((item.price || '') / 100).toFixed(2),
      image_url: item.cover || '',
    };
  });
}

export function pctListAdaptor(pctList) {
  return pctList.map(item => {
    return {
      id: item.productId,
      title: item.title,
      price: ((item.price || '') / 100).toFixed(2),
      cover: item.cover || '',
    };
  });
}

export function formatList(allRecommends = []) {
  allRecommends = orderBy(allRecommends, ['serialNo', 'productId'], ['desc', 'desc']);
  return {
    sorted: allRecommends,
    owlRecommends: allRecommends.filter(item => item.productType === PRODUCT_TYPE.pct),
    nonOwlRecommends: allRecommends.filter(item => item.productType !== PRODUCT_TYPE.pct),
  };
}

// 把选择组件中选到的商品转成业务适用的格式
export function icGoodsAdaptor(goodsList = []) {
  return goodsList.map(item =>
    Object.assign({}, item, {
      id: item.productId,
      productId: item.id,
      productType: item.goodsType === 31 ? 1 : 0,
      serialNo: 0,
      cover: get(item, 'cover') || get(item, 'pictures[0].url', ''),
    }),
  );
}

// 增加商品
export function addGoodsToRecommends(newGoodsList = [], allRecommends = []) {
  const idList = allRecommends.map(item => item.productId);
  newGoodsList.forEach(item => {
    if (idList.indexOf(item.productId) < 0) {
      allRecommends.push(item);
    }
  });
  return allRecommends;
}

// 拼装请求数据
export function genSaveList(oldList, currentList) {
  const ret = {
    currentList,
    addList: [],
    deleteList: [],
    updateList: [],
  };
  const oldIdList = oldList.map(item => item.productId);
  const currentIdList = currentList.map(item => item.productId);
  // get delete list
  oldList.forEach(item => {
    if (currentIdList.indexOf(item.productId) < 0) {
      ret.deleteList.push(item);
    }
  });
  // get updateList & addList
  currentList.forEach(item => {
    if (oldIdList.indexOf(item.productId) < 0) {
      ret.addList.push(item);
    } else {
      const oldItem = oldList.find(oldItem => oldItem.productId === item.productId);
      if (oldItem.serialNo !== item.serialNo) {
        ret.updateList.push(item);
      }
    }
  });
  return ret;
}
