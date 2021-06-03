import React from 'react';
import { DateRangeQuickPicker, IDateRangeQuickPickerProps } from 'zent';
import { IDateRangeQuickPickerControlType, ITimeType } from '../../../types/filter';

type DatePickerChangeHandler = IDateRangeQuickPickerProps['onChange'];
const formatTemp = 'YYYY-MM-DD';

// 预设
const presetDays = [
  {
    text: '今',
    value: 0,
  },
  {
    text: '昨',
    value: 1,
  },
  {
    text: '近7天',
    value: 7,
  },
  {
    text: '近30天',
    value: 30,
  },
];

const DateRangeQuickPickerType: React.FC<IDateRangeQuickPickerControlType> = (props) => {
  const { onChange, value: currentValue, ...passiveProps } = props;

  // 快速选择时间的value需要做处理
  const convertValues = React.useMemo<[ITimeType[], any]>(() => {
    if (Array.isArray(currentValue)) {
      let tempChooseDay;
      const [timeArr, chooseDay] = currentValue;
      if (!Array.isArray(timeArr)) {
        return [currentValue, tempChooseDay];
      }
      // 如果数组第一项为数组，那么第二项作为preset
      tempChooseDay = isNaN(Number(chooseDay))
        ? /* istanbul ignore next */ chooseDay
        : Number(chooseDay);
      return [timeArr, tempChooseDay];
    }
    /* istanbul ignore next */
    return [[], ''];
  }, [currentValue]);

  const handleChange = React.useCallback<DatePickerChangeHandler>(
    (timeArr, chooseDays) => {
      onChange && onChange([timeArr, chooseDays]);
    },
    [onChange]
  );

  return (
    <DateRangeQuickPicker
      format={formatTemp}
      preset={presetDays as IDateRangeQuickPickerControlType['preset']}
      {...passiveProps}
      chooseDays={convertValues[1]}
      value={convertValues[0] as [ITimeType?, ITimeType?]}
      onChange={handleChange}
    />
  );
};

export default DateRangeQuickPickerType;
