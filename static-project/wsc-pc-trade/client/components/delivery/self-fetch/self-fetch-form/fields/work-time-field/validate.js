const validations = {
  validTime(values, value) {
    if (!value || value.length === 0 || (value.length === 1 && value[0].workDays.length === 0)) {
      return '请至少选择一天接待时间';
    }
    return true;
  },
};

export { validations };
