import forEach from 'lodash/forEach';
import { Notify } from 'zent';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import fullfillImage from '@youzan/utils/fullfillImage';

const NO_STYLE = {};

/**
 * [getSubEntry 获取最终的subEntry]
 * @param  {[type]} subEntry [description]
 * @param  {[type]} num      [description]
 * @return {[type]}          [description]
 */
export function validSubEntry(subEntry, num) {
  let subEntryFinal;
  if (num > 0 && subEntry.length > num) {
    subEntryFinal = subEntry.slice(0, num);
    Notify.error(`最多添加 ${num} 个广告，其余 ${subEntry.length - num} 个广告添加失败`);
  } else {
    subEntryFinal = subEntry;
  }
  return subEntryFinal;
}

/**
 * [tranferSubEntry 添加新增广告]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function transferSubEntry(data) {
  const subEntryData = [];
  if (data.length > 0) {
    forEach(data, item => {
      subEntryData.push({
        type: 'image_ad_selection',
        title: '',
        image_id: item.attachment_id,
        image_url: item.attachment_url,
        image_thumb_url: item.thumb_url,
        image_width: Number(item.width),
        image_height: Number(item.height),
        link_id: '',
        link_type: '',
        link_title: '',
        link_url: '',
        alias: '',
      });
    });
  }
  return subEntryData;
}

/**
 * [tranferSubEntry 添加新增广告] 绘制热区
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function transferHotAreaSubEntry(data) {
  const subEntryData = [];
  if (data.length > 0) {
    forEach(data, item => {
      subEntryData.push({
        type: 'image_ad_selection',
        title: '',
        image_id: item.attachment_id,
        image_url: item.attachment_url,
        image_thumb_url: item.thumb_url,
        image_width: Number(item.width),
        image_height: Number(item.height),
        link_type: 'hotarea',
        hot_areas: [],
      });
    });
  }
  return subEntryData;
}

export function transferOtherToHotAreaSubEntry(data) {
  const subEntryData = [];
  if (data.length > 0) {
    forEach(data, item => {
      subEntryData.push({
        type: 'image_ad_selection',
        title: '',
        image_id: item.image_id,
        image_url: item.image_url,
        image_thumb_url: item.image_thumb_url,
        image_width: item.image_width,
        image_height: item.image_height,
        link_type: 'hotarea',
        hot_areas: [],
      });
    });
  }
  return subEntryData;
}

export function transferHotAreaToOtherSubEntry(data) {
  const subEntryData = [];
  if (data.length > 0) {
    forEach(data, item => {
      subEntryData.push({
        ...item,
        type: 'image_ad_selection',
        link_id: '',
        link_type: '',
        link_title: '',
        link_url: '',
        alias: '',
      });
    });
  }
  return subEntryData;
}

/**
 * [updateSubEntry 修改实时更新subEntryData]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateSubEntry(data, itemIndex, subEntryData) {
  if (subEntryData.length > 0) {
    return map(subEntryData, (item, index) => {
      return index === itemIndex ? data : item;
    });
  }
  return subEntryData;
}

export function transformImageUrl(subEntryData, globalConfig) {
  let newSubEntryData = [];
  const subEntryDataBak = cloneDeep(subEntryData);
  if (subEntryDataBak && subEntryDataBak.length > 0) {
    newSubEntryData = map(subEntryDataBak, item => {
      const imageUrl = item.image_url;
      const imageThumbUrl = item.image_thumb_url;
      item.image_url = fullfillImage(imageUrl, '!730x0.jpg', globalConfig.url);
      item.image_thumb_url = fullfillImage(imageThumbUrl, '!730x0.jpg', globalConfig.url);
      return item;
    });
  }
  return newSubEntryData;
}

export function getClipHeightStyle(height) {
  if (height) {
    return {
      maxHeight: height,
      overflow: 'auto',
    };
  }

  return NO_STYLE;
}
