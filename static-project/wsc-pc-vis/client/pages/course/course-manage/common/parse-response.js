import { Notify } from 'zent';
import isArray from 'lodash/isArray';
import { isEmpty, cloneDeep, has, get } from 'lodash';
import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import getEduCourseDetail from '../common/transfer-educourse-detail';
import { PUBLISH_STATUS } from '../constants';

function parseOldSkuIn(data) {
  const sku = [];
  [1, 2, 3, 4, 5].forEach(index => {
    if (data[`skuName${index}`] && data[`skuName${index}Value`]) {
      const skuItem = data[`skuName${index}`];
      skuItem.leaf = data[`skuName${index}Value`].map(item => {
        if (item && typeof item.id !== 'undefined') {
          item._id = item.id;
          delete item.id;
        }
        return item;
      });
      if (typeof skuItem.id !== 'undefined') {
        skuItem._id = skuItem.id;
        delete skuItem.id;
      }
      sku.push(skuItem);
    }
  });
  return sku;
}

// 对输入数据进行处理
export default function parseResponse({ ...data }) {
  data.price = data.price / 100;

  if (data.skuName1 && data.skuName1Value) {
    data.sku = parseOldSkuIn(data);
  }

  // 如果遇到错误的stock数据，就抛弃这个数据，让用户去修复
  let isStockError = false;
  if (isArray(data.stocks)) {
    const skuTotalLength =
      (data.skuName1 ? 1 : 0) *
      ((data.skuName1Value || []).length || 1) *
      ((data.skuName2Value || []).length || 1) *
      ((data.skuName3Value || []).length || 1);

    if (data.stocks.length !== skuTotalLength) {
      isStockError = true;
    } else {
      data.stocks.forEach(item => {
        item.price = item.price / 100;
      });
    }
  } else if (!isEmpty(data.stocks)) {
    isStockError = true;
  }

  if (isStockError) {
    data.stocks = [];
    Notify.error('非常抱歉，商品库存信息出现错误，请重新设置');
  }

  data.changeDirectory = data.directory.changeDirectory;
  if (isArray(data.directory.directoryList) && data.directory.directoryList.length > 0) {
    data.directoryList = data.directory.directoryList;
  }

  // 开课时间格式化
  data.beginTime = [];
  data.beginTime[0] = data.courseStartAt || null;
  data.beginTime[1] = data.courseEndAt || null;

  // 分销员海报初始化
  data.distributorPics = (data.distributorPics || []).map(url => ({ cover: url, picture: {} }));

  // 定时上架时间格式化，如果为非定时上架，时间置为空
  data.timingPublishAt =
    data.publishStatus === PUBLISH_STATUS.PUBLISH_TIME ? data.timingPublishAt : null;

  // 如果限购数小于1，置为null表示不勾选限购
  if (data.quota < 1) {
    data.quota = null;
  }

  // 参加会员折扣
  data.joinLevelDiscount = !!data.joinLevelDiscount;

  // 转换videoModel数据
  data.videoModel = mapKeysToSnakeCase(data.videoModel);

  // 报名信息核对
  data.registerInfo = [];
  data.registerInfo.push(data.intentTime ? 'intentTime' : '');
  data.registerInfo.push(data.intentAddress ? 'intentAddress' : '');

  // 加粉推广
  if (has(data, 'joinGroupSetting.groupOpen')) {
    if (has(data, 'joinGroupSetting.codeType') && data.joinGroupSetting.codeType) {
      data.joinGroupSetting.liveQRValue = {
        codeId: data.joinGroupSetting.codeId,
        codeName: data.joinGroupSetting.codeName,
        codePicture: data.joinGroupSetting.codePicture,
      };
    } else {
      data.joinGroupSetting.normalQRValue = {
        cover: data.joinGroupSetting.codePicture,
        picture: { attachment_full_url: data.joinGroupSetting.codePicture },
      };
    }
  }

  // 不同Stocks
  if (data.courseType === 1 && data.courseSellType !== 0) {
    data.sellStocks = cloneDeep(data.stocks);
  }

  if (data.courseType === 1 && data.courseSellType === 0) {
    data.isFromCustomer = true;
    if (get(data, 'applyCourse.applyCourseType') === 0) {
      data.isFromOldCustomer = true;
    }
  }

  // 课程关联班级下拉列表
  if (has(data, 'applyCourse.eduCourse.classRelatedInfo')) {
    data.applyCourse.eduCourse.classRelatedInfo = getEduCourseDetail(data.applyCourse.eduCourse.classRelatedInfo);
    if (has(data, 'sellStocks.length') && data.courseType === 1 && data.courseSellType === 3) {
      data.applyCourse.eduCourse.classRelatedInfo.content.forEach(item => {
        if (
          data.sellStocks.filter(stockItem => {
            return stockItem.eduClassDTO && stockItem.eduClassDTO.id === item.id;
          }).length > 0
        ) {
          item.type = 0;
        }
      });
    }
  }

  // 课程有效时间,返回的两个值都可能为空
  data.validityPeriod = {
    range: data.validityPeriodRange,
    unit: data.validityPeriodUnit || 1,
  };
  return data;
}
