
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio } from 'zent';
const { getControlGroup } = Form;
const RadioGroup = Radio.Group;

class StartRewardRelatedSettings extends PureComponent {
  onStartSettingChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value, courseProduct, isView } = this.props;
    return (<RadioGroup onChange={this.onStartSettingChange} value={value} disabled={isView}>
      <Radio value={1}>购买后立即发放</Radio>
      { courseProduct.isRelatedStartCer && <Radio className='start-reward-group' value={2}>随入学证书发放</Radio> }
      { !courseProduct.isRelatedStartCer && <Pop trigger='hover' content='此线下课还未设置入学证书'><div><Radio className='start-reward-group' disabled={true} value={2}>随入学证书发放</Radio></div></Pop> }
    </RadioGroup>);
  }
}

export default getControlGroup(StartRewardRelatedSettings);
