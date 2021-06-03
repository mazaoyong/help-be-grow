import { Form } from '@zent/compat';
import React, { Component } from 'react';
import DateRangeField from 'components/field/data-range';
import cx from 'classnames';

const { Field } = Form;

const format = 'YYYY-MM-DD';

export default class BeginTime extends Component {
  render() {
    const { beginTime, label, disabled, disabledMsg, courseType, courseSellType } = this.props;
    return (
      <Field
        name="beginTime"
        className={cx({ hide: courseType === 1 && courseSellType !== 0 })}
        label={label}
        component={DateRangeField}
        value={beginTime}
        disabled={[disabled, !beginTime[0]]}
        disabledMsg={disabledMsg}
        formatTime={format}
        placeholder={['开课日期', '结课日期']}
        showTime={false}
        helpDesc="结课日期可不填写"
        validateOnChange={true}
        validations={{
          min(_, value) {
            if (!!value[0] && !!value[1]) {
              return new Date(value[1]) >= new Date(value[0]);
            }
            return true;
          },
          max(_, value) {
            if (!!value[0] && !!value[1]) {
              return !(new Date(value[1]) - new Date(value[0]) >= 1000 * 60 * 60 * 24 * 365);
            }
            return true;
          },
          start(_, value) {
            if (value[1]) {
              return !!value[0];
            }
            return true;
          },
        }}
        validationErrors={{
          min: '请选择不早于上课时间的日期',
          max: '上课时间不可超过一年',
          start: '请输入上课时间',
        }}
      />
    );
  }
}
