import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import get from 'lodash/get';
import { Notify } from 'zent';

// 点击确认选择商品时给商品信息添加 skuInfo
export const addSkuinfo = (array = [], skuData = [], singleSkuMode = true) => {
  // todo 选择多个sku的情况
  array.forEach(element => {
    const indexOfSku = findIndex(
      skuData,
      o => o.alias === element.alias && typeof element.alias !== 'undefined',
    );
    if (indexOfSku > -1) {
      element.skuInfo = skuData[indexOfSku].skuInfo;
    }
  });
};

// 判断所选的商品都已经选择了 规格
export const checkSkuinfo = (array, hasSku, maxSelectedNum) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const notChooseSkuLength = element.items.filter(item => {
      // 选择规格模式下
      return hasSku && item.skuSize > 0 && typeof item.skuInfo === 'undefined';
    }).length;
    if (notChooseSkuLength > 0) {
      Notify.error(`请选择已选择${element.error}商品的型号`);
      return false;
    }
    if (maxSelectedNum) {
      let selectedNum = 0;
      array.forEach(item => {
        selectedNum += (item.items || []).length;
      });
      if (selectedNum > maxSelectedNum) {
        Notify.error(`关联的商品不能超过${maxSelectedNum}个`);
        return false;
      }
    }
  }
  return true;
};

// 返回商品中有规格信息的商品列表
// 入参 二维数组
// 出参 一维数组
export const filterSkuinfo = array => {
  const skuInfoList = array.map(items => {
    return items.filter(item => !isEmpty(item.skuInfo));
  });
  return flatten(skuInfoList);
};

export const getMediaType = value => {
  if (isPlainObject(value)) {
    return value.mediaType;
  }
  return 0;
};

// 获取知识付费分组信息
export const filterNeededItems = (group, ignoreGroup) => {
  const distribution = get(ignoreGroup, 'distribution.value', []);
  const offline = get(ignoreGroup, 'offline.value', []);
  const online = get(ignoreGroup, 'online.value', []);

  if (!get(window._global, 'isYZEdu')) {
    distribution.push(10);
    offline.push(10);
    online.push(10);
  }

  function filter(groups, channels) {
    const arr = [];

    groups.forEach(group => {
      const subType = group.groupId.subType;
      const mediaType = group.groupId.mediaType;

      const groupInIgnorelist = channels.filter(channel => {
        if (Array.isArray(channel)) {
          if (+channel[0] === +subType && +channel[1] === mediaType) {
            return true;
          }
        } else {
          if (+channel === subType) {
            return true;
          }
        }
        return false;
      });

      if (groupInIgnorelist.length === 0) {
        arr.push(group);
      }
    });
    return arr;
  }

  return {
    online: filter(group, online),
    distribution: filter(group, distribution),
    offline: filter(group, offline),
  };
};
