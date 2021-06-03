import { BusinessHour } from '@youzan/react-components';
const validations = {
  validBussinessHour(values, value) {
    if (value.mode === BusinessHour.Mode.DAILY_REPEAT) {
      return BusinessHour.validation.daily(value.dailyValue, { validateAll: true });
    } else if (value.mode === BusinessHour.Mode.WEEKLY_REPEAT) {
      return BusinessHour.validation.weekly(value.weeklyValue, { validateAll: true });
    }
    return true;
  },
};

export { validations };
