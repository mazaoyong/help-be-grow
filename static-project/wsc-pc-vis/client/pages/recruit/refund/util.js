import qs from 'qs';
import Big from 'big.js';

// 获取html query
export function parseParams() {
  const separators = ['?', '#'];
  let str = window.location.href;
  separators.forEach(symbol => {
    const temp = str.split(symbol);
    str = temp[1] || temp[0];
  });
  return qs.parse(str);
}

// 获取单天均价
export function calcDayPrice({
  refundItemDTO,
  userAsset: {
    totalQuantityOfDay,
    unit,
  },
}) {
  if (!totalQuantityOfDay) {
    return '';
  }
  return Big((refundItemDTO && refundItemDTO.realPay) || 0).div(totalQuantityOfDay).div(100).toFixed(2);
}

// 计算最多可退金额
export function calcMaxRefundFee({ refundItemDTO }, item) {
  const realPay = (item && item.simpleOrderCreateCommand && item.simpleOrderCreateCommand.realPay) || 0;
  const itemSurplusRefundAmt = (refundItemDTO && refundItemDTO.itemSurplusRefundAmt) || 0;
  return cent2yuan(realPay || itemSurplusRefundAmt);
}

// 计算最多可退课时/天数
export function calcMaxRefundValue({
  userAsset,
  courseTime,
  courseType,
  refundCourseDTO,
}) {
  const { courseSellType, quantityOfDay } = userAsset || {};
  if (courseSellType === 1) {
    const maxRefundValue = courseTime ? (courseTime.locked + courseTime.remaining) : 0;
    return Big(maxRefundValue || 0).div(100).toFixed();
  }
  if (courseType === 0 || courseSellType === 0 || courseSellType === 2) {
    return quantityOfDay;
  }
  return '';
}

// 计算建议退款价格
export function calcSuggestedFee(
  {
    userAsset,
    courseTime,
    courseType,
    refundItemDTO = {},
  },
  {
    refundCourseValue = 0,
    simpleOrderCreateCommand = {},
  },
) {
  const { courseSellType, totalQuantityOfDay } = userAsset || {};
  // no advice
  if (courseType === 0 || courseSellType === 3) {
    return '';
  }
  const realPay = typeof refundItemDTO.realPay !== 'undefined' ? refundItemDTO.realPay
    : (simpleOrderCreateCommand.realPay || 0);
  if (courseSellType === 1) {
    return courseTime.total ? Big(refundCourseValue)
      .times(realPay)
      .div(courseTime.total)
      .div(100)
      .toFixed(2)
      : 0;
  }
  if (courseSellType === 2) {
    return totalQuantityOfDay ? Big(refundCourseValue)
      .times(realPay)
      .div(totalQuantityOfDay)
      .div(100)
      .toFixed(2)
      : 0;
  }
  return '';
}

// 金额/课时，服务器数据->实际数据
export function cent2yuan(source, fixed) {
  return Big(source || 0).div(100).toFixed(fixed);
}

// 金额/课时，实际数据->服务器数据
export function yuan2cent(num) {
  if (isNaN(num)) {
    num = 0;
  }
  return Number(Big(num).mul(100).valueOf());
}

// 格式化资产数量信息
export function parseQuantityStr(userAsset) {
  switch (userAsset.unit) {
    case 1:
      return userAsset.quantity + '天';
    case 2:
      return userAsset.quantity + '周';
    case 3:
      return userAsset.quantity + '个月';
    case 4:
      return userAsset.quantity + '年';
    default:
      return '';
  }
}

// 格式化表单列表
export function formatList(target = [], data) {
  return Object.keys(data).filter(key => key.includes('-'))
    .reduce((arr, key) => {
      const keys = key.split('-');

      const itemIndex = keys[1];
      const itemKey = keys[0];
      let item = 0;

      if (!arr[itemIndex]) {
        arr[itemIndex] = {};
      }

      if (itemKey === 'payType') {
        item = data[key];
      } else if ((arr[itemIndex].courseSellType === 0 || arr[itemIndex].courseSellType === 2) && itemKey === 'refundCourseValue') {
        item = Number(data[key]);
      } else {
        item = Number(Big(Number(data[key])).times(100).valueOf());
      }

      if (itemKey === 'payType' || itemKey === 'realPay') {
        if (!arr[itemIndex].simpleOrderCreateCommand) {
          arr[itemIndex].simpleOrderCreateCommand = {};
        }
        if (itemKey === 'payType') {
          arr[itemIndex].simpleOrderCreateCommand = Object.assign({}, arr[itemIndex].simpleOrderCreateCommand, item);
        }
        if (itemKey === 'realPay') {
          arr[itemIndex].simpleOrderCreateCommand[itemKey] = item;
        }
        return arr;
      }

      arr[itemIndex][itemKey] = Number(item);
      return arr;
    }, target);
}
