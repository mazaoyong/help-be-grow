const validations = {
  validAreaCode(values, value) {
    const areaCode = value.areaCode || '';
    if (areaCode !== '' && !/^\d+$/.test(areaCode)) {
      return '区号为数字';
    }
    return true;
  },
  validLocalNumber(values, value) {
    const localNumber = value.localNumber;
    if (!/^\d+$/.test(localNumber)) {
      return '电话为数字';
    }
    return true;
  },
};

export { validations };
