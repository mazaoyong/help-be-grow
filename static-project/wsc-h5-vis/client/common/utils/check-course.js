import _format from 'date-fns/format';
import { COURSE_TYPE, COURSE_SELL_TYPE, VALID_PERIOD_UNIT_DESC } from '../../pages/edu/constant';

// 正式课
export const checkFormal = (dto = {}) => {
  return dto.courseType === COURSE_TYPE.FORMAL;
};

// 体验课
export const checkCausal = (dto = {}) => {
  return dto.courseType === COURSE_TYPE.CASUAL;
};

// 按课时
export const checkByCount = (dto = {}) => {
  return checkFormal(dto) && dto.courseSellType === COURSE_SELL_TYPE.COUNT;
};

// 按时段
export const checkByDuration = (dto = {}) => {
  return checkFormal(dto) && dto.courseSellType === COURSE_SELL_TYPE.DURATION;
};

// 按期
export const checkBySession = (dto = {}) => {
  return checkFormal(dto) && dto.courseSellType === COURSE_SELL_TYPE.SESSION;
};

// 自定义
export const checkByDiy = (dto = {}) => {
  return checkFormal(dto) && dto.courseSellType === COURSE_SELL_TYPE.DIY;
};

// 返回有效期
/**
 * @description 返回课程有效期
 * courseSellType  线下课售卖类型
 * validityPeriodType 有效期类型
 * courseEffectiveType 生效时间类型
 * validityPeriodRange 有效期
 * validityPeriodUnit 有效期时间单位
 * startTime 后端计算资产开始时间
 * endTime 后端计算资产结束时间
 * skuVal 时段的 sku 信息
 */
export const getValidTime = (dto = {}) => {
  let valueResult = '';
  function getValue() {
    // 线下课售卖类型
    const sellType = dto.courseSellType;

    // 有效期类型 1-永久有效 2-多少天生效
    const periodType = dto.validityPeriodType;

    // 生效时间类型1首次签到后生效 2付款完成多少天后生效 3付款完成后立即生效
    const courseEffectiveType = dto.courseEffectiveType;

    // 有效期
    const validityPeriodRange = dto.validityPeriodRange;

    // 有效期时间单位
    const validityPeriodUnit = dto.validityPeriodUnit;

    const startYMD = _format(dto.startTime, 'YYYY年MM月DD日');
    const endYMD = _format(dto.endTime, 'YYYY年MM月DD日');

    // 非有效期类型显示时间范围
    let timeStatus = dto.startTime ? `${startYMD} - ${endYMD}` : '';
    if (dto.rangeTime) {
      timeStatus = dto.rangeTime;
    }
    // 按课时
    if (sellType === 1) {
      if (periodType === 1) {
        return '永久有效';
      }
      if (periodType === 2) {
        if (courseEffectiveType === 1) {
          if (timeStatus) return timeStatus;
          return validityPeriodRange ? `${validityPeriodRange}${VALID_PERIOD_UNIT_DESC[validityPeriodUnit]}（首次上课签到后生效）` : '';
        }
        return timeStatus;
      }
      return '';
    // 按时段
    } else if (sellType === 2) {
      if (timeStatus) return timeStatus;
      if (courseEffectiveType === 1) {
        return dto.skuVal ? `${dto.skuVal}（首次上课签到后生效）` : '';
      }
      return '';
    // 按期、自定义
    } else {
      return timeStatus;
    }
  }
  valueResult = getValue();
  return {
    name: '有效期',
    value: valueResult,
  };
};

/**
 * @description 课时或次数
 * @param {*} dto
 * courseSellType
 * countRemaining
 * countTotal
 * sessionRemaining
 * sessionTotal
 */
export const getCourseTimes = (dto = {}) => {
  function getValue() {
    if (dto.courseSellType === 1) return `剩余${dto.countRemaining / 100}/共${dto.countTotal / 100}课时`;
    if (dto.courseSellType === 3) return `剩余${dto.sessionRemaining}/共${dto.sessionTotal}次`;
    return '';
  }
  function getName() {
    if (dto.courseSellType === 1) return '课时';
    if (dto.courseSellType === 3) return '上课次数';
    return '';
  }
  return {
    name: getName(),
    value: getValue(),
  };
};
