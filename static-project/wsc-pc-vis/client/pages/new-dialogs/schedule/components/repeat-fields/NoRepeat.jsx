
import { Form } from '@zent/compat';
import React from 'react';
import openDateRangePickerDialog from '@ability-center/schedule/date-range-picker';
import travel from '@youzan/utils/date/travel';

const { FormSection, FormDatePickerField, FormSelectField } = Form;

/* function validateSchoolTime(_, value) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(value)) {
      const isValid = value.every(v => !!v);
      if (isValid) resolve();
      // eslint-disable-next-line prefer-promise-reject-errors
      else reject('上课时间不能为空');
    }
    resolve();
  });
} */

const NoRepeatField = props => {
  const {
    type = 0,
    disabled,
    operateType,
    refetchOptions,
    dateRangeConfig,
    defaultOptions = {},
  } = props || {};
  // const [startDate, setStartDate] = useState('');

  // 合并时间选项
  let mergedOptions = dateRangeConfig || [];
  if (type === 1 || operateType === 2) {
    const defaultOption = defaultOptions.schoolTime;
    if (defaultOption) {
      const defaultOptionIndex = (dateRangeConfig || []).findIndex(conf =>
        conf.value === defaultOption.value
      );
      if (defaultOptionIndex > -1) {
        dateRangeConfig.splice(defaultOptionIndex, 1);
      }
      mergedOptions = [defaultOption].concat(dateRangeConfig);
    }
  }

  const openDateRangePicker = () => {
    openDateRangePickerDialog(1, 'dateRangePicker').finally(() => {
      if (refetchOptions) {
        refetchOptions();
      }
    });
  };

  return (
    <FormSection name="noRepeat">
      <FormDatePickerField
        required
        width="250px"
        label="开课日期："
        name="startDate"
        dateFormat="YYYY-MM-DD"
        validations={{ required: true }}
        disabledDate={(date) => {
          return date < travel(-90, new Date(), 'day');
        }}
        disabled={operateType === 2 ? false : disabled}
        validationErrors={{ required: '请选择开课日期' }}
      />
      {// 如果不是按周重复，渲染时间范围选择的组件
        type !== 2 ? (
          <section style={{ lineHeight: '30px' }}>
            <FormSelectField
              required
              width="250px"
              label="上课时间："
              name="schoolTime"
              className="inline-ele"
              placeholder="请选择时间"
              data={mergedOptions}
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请选择时间',
              }}
            />
            <a className="inline-ele operator" onClick={openDateRangePicker}>
            设置时间段
            </a>
          </section>
        ) : null}
    </FormSection>
  );
};

export default NoRepeatField;
