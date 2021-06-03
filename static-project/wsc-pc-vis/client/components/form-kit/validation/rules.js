const isEmpty = value => {
  if (typeof value === 'string') {
    value = value.trim();
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return !value;
};

const defaultMsgMap = {
  required: '必填',
  email: '请填写正确的邮箱地址',
  number: '请填写数字',
  mobile: '请填写正确的手机号码',
};
const originRules = {
  required(value) {
    return !isEmpty(value);
  },
  email(value) {
    return isEmpty(value) || /\S+@\S+\.\S+/.test(value);
  },
  number(value) {
    return isEmpty(value) || /^\d+$/.test(value);
  },
  mobile(value) {
    return isEmpty(value) || /^[0-9]{1,14}$/.test(value);
  },
};

const rules = {};
Object.keys(originRules).forEach(k => {
  if (!defaultMsgMap[k]) {
    console.warn(`${k} miss default msg`);
  }
  rules[k] = (...args) => originRules[k](...args) || defaultMsgMap[k];
});

export { originRules };

export default rules;
