const idCardTest = /(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^\d\*{16}\w$)/;
const phoneTest = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

function isNotNull(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return false;
    }
    return value.every(v => isNotNull(v));
  }
  return value !== null && value !== undefined && value !== '';
}

class RulesCollection {
  constructor() {
    this.isRequired = this.isRequired.bind(this);
    this.maxLength = this.maxLength.bind(this);
    this.minLength = this.minLength.bind(this);
    this.regExpTest = this.regExpTest.bind(this);
    this.isIdCard = this.isIdCard.bind(this);
    this.isPhone = this.isPhone.bind(this);
    this.isValidAddress = this.isValidAddress.bind(this);
  }

  isRequired(value) {
    return isNotNull(value);
  }
  // 最长
  maxLength(value, size) {
    return this.isRequired(value) && value.toString().length <= size;
  }
  minLength(value, size) {
    if (size === 0) {
      return true;
    }
    return this.isRequired(value) && value.toString().length >= size;
  }
  regExpTest(value, regExp) {
    return this.isRequired(value) && new RegExp(regExp).test(value);
  }
  isIdCard(value) {
    return this.regExpTest(
      value,
      idCardTest,
    );
  }
  isPhone(value) {
    return this.regExpTest(
      value,
      phoneTest,
    );
  }
  isValidAddress(value, size) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.length >= size && value.slice(0, size).every(v => isNotNull(v));
  }
}

export default RulesCollection;
