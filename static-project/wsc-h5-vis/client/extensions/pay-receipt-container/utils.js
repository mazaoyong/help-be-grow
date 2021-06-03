import { PAY_STATE } from './constants';

/* 生成 payStateText */
export class PayStateText {
  constructor(typeText, successText) {
    if (typeText) {
      this.typeText = typeText;
    } else {
      this.typeText = '报名';
    }

    if (successText) {
      this.successText = successText;
    } else {
      this.successText = '完成';
    }

    this.payStateTextMap = {
      [PAY_STATE.CLOSED]: `${this.typeText}失败`,
      [PAY_STATE.PAID]: `${this.typeText}${this.successText}`,
      [PAY_STATE.CREATED]: `正在${this.typeText}中`,
      [PAY_STATE.WAIT_PAY]: `正在${this.typeText}中`,
    };
  }

  getStateText(state) {
    return this.payStateTextMap[state];
  }

  getSuccessText() {
    return this.payStateTextMap[PAY_STATE.PAID];
  }
}
