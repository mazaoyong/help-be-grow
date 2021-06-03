import { QuestionLevel, QuestionType } from '../types';
import num from '@youzan/utils/number';
export const getLevelText = (level: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.Easy:
      return '简单';
    case QuestionLevel.Normal:
      return '普通';
    case QuestionLevel.Medium:
      return '较难';
    default:
      return '';
  }
};

export const getTypeText = (type: QuestionType) => {
  switch (type) {
    case QuestionType.Single:
      return '单选题';
    case QuestionType.Multiple:
      return '多选题';
    case QuestionType.Judge:
      return '判断题';
    case QuestionType.FillBlank:
      return '填空题';
    case QuestionType.Subjective:
      return '问答题';
    default:
      return '';
  }
};

export const getPctGoodsText = (type: number) => {
  switch (type) {
    case 10:
      return '线下课';
    case 1:
      return '专栏';
    case 2:
      return '内容';
    case 4:
      return '直播';
    default:
      return '';
  }
};

export const safeAdd = (num1: number, num2: number, ...nums: number[]) => {
  const result = num.accAdd(num1, num2);
  if (nums.length === 0) return result;
  return safeAdd(result, nums[0], ...nums.slice(1));
};

export const safeMul = (num1: number, num2: number, ...nums: number[]) => {
  const result = num.accMul(num1, num2);
  if (nums.length === 0) return result;
  return safeMul(result, nums[0], ...nums.slice(1));
};

/**
 * 将时间间隔格式化为小时：分钟：秒
 *
 * @param {number} durationInTimeStamp 要格式化的时间间隔
 * @param {boolean} isSecond 是否以秒为单位
 * @return {string} 格式化后的字符串
 */
export function formatTimeDuration(durationInTimeStamp:number, isSecond:boolean = false): string {
  const padStr = (num: number) => String(num).padStart(2, '0');
  const duration = isSecond ? durationInTimeStamp : Math.round(durationInTimeStamp / 1000);
  if (duration <= 0) {
    return '00:00:00';
  }
  const seconds = padStr(duration % 60);
  const minutes = padStr(Math.floor(duration / 60) % 60);
  const hours = padStr(Math.floor(duration / 3600));
  return `${hours}:${minutes}:${seconds}`;
}
