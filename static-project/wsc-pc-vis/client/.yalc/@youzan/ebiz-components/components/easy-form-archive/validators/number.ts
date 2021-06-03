import { IMoneyRangeRule, IIntRangeRule } from "../types";

export function moneyRange(rule: IMoneyRangeRule) {
  const { max, min, message, isCent = false } = rule;
  const maxCent = max * 100;
  const minCent = min * 100;
  return (val: number | string) => {
    let money = +val;
    if (!isCent) {
      money = money * 100;
    }
    if (money % 1 !== 0 || !(money >= 0)) {
      return {
        name: 'moneyRange_invalid',
        message: '请输入正确的价格'
      };
    }
    if (money < minCent || money > maxCent) {
      return {
        name: 'moneyRange_over',
        message: message  || `价格范围${min}-${max}`
      };
    }
    return null;
  }
}

export function intRange(rule: IIntRangeRule) {
  const { max, min, message } = rule;
  return (val: string | number) => {
    const isInt = /[0-9]+/.test(`${val}`);
    if (!isInt) {
      return {
        name: 'intRange_invalid',
        message: '请输入正确的整数'
      };
    }
    if (val < min || val > max) {
      return {
        name: 'intRange_over',
        message: message || `整数范围${min}-${max}`
      };
    }
    return null;
  }
}
