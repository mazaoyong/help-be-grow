
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';

const { FormRadioGroupField, FormDatePickerField, getControlGroup } = Form;

class PublishComponent extends Component {
  onChangeDate = val => {
    this.props.onChange({ publishStatus: 2, timingPublishAt: val });
  };

  render() {
    let { value } = this.props;
    return (
      <div className="publish-type-group">
        <FormRadioGroupField name="publishStatus" value={value.publishStatus} required>
          <Radio value={1}>立即开售</Radio>
          <Radio value={2}>定时开售，设置开售时间</Radio>
          <Radio value={3}>暂不开售,存为草稿</Radio>
        </FormRadioGroupField>
        <FormDatePickerField
          name="timingPublishAt"
          className="zent-picker-demo"
          showTime
          dateFormat="YYYY-MM-DD HH:mm:ss"
          min={new Date()}
          value={value.timingPublishAt}
          onChange={this.onChangeDate}
          disabled={value.publishStatus !== 2}
        />
      </div>
    );
  }
}

export default getControlGroup(PublishComponent);
