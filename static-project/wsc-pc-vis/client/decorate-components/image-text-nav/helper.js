import { Notify } from 'zent';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import fullfillImage from '@youzan/utils/fullfillImage';

/**
 * [tranferSubEntry 添加图片]
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
 * [getSubEntry 获取最终的subEntry]
 * @param  {[type]} subEntry [description]
 * @param  {[type]} num      [description]
 * @return {[type]}          [description]
 */
export function validSubEntry(subEntry, num) {
  let subEntryFinal;
  if (num > 0 && subEntry.length > num) {
    subEntryFinal = subEntry.slice(0, num);
    Notify.error('你添加的广告数量超过最大值，已经自动删除多余的广告。');
  } else {
    subEntryFinal = subEntry;
  }
  return subEntryFinal;
}

/**
 * preview前格式化image url（调fullfillImage）
 * @param {*} subEntryData
 * @param {*} globalConfig
 */
export function transformImageUrl(subEntryData, globalConfig) {
  let newSubEntryData = [];
  const subEntryDataBak = cloneDeep(subEntryData);
  if (subEntryDataBak.length > 0) {
    newSubEntryData = map(subEntryDataBak, item => {
      const imageUrl = item.image_url;
      const imageThumbUrl = item.image_thumb_url;
      item.image_url = fullfillImage(imageUrl, '!520x0.jpg', globalConfig.url);
      item.image_thumb_url = fullfillImage(imageThumbUrl, '!520x0.jpg', globalConfig.url);
      return item;
    });
  }
  return newSubEntryData;
}

/**
 * 判断是否显示默认图片
 * @param {*} subEntry
 */
export function isDefaultImage(subEntry) {
  const newSubEntry = cloneDeep(subEntry);
  if (isArray(newSubEntry) && newSubEntry.length > 0) {
    forEach(newSubEntry, item => {
      if (!item.image_url) {
        // 默认图片
        item.image_url = fullfillImage(
          '/public_files/2018/03/08/837f3d12e14b299778ae5fea5c05a3a3.png'
        );
        item.image_width = 200;
        item.image_height = 200;
      }
    });
  }
  return newSubEntry;
}
