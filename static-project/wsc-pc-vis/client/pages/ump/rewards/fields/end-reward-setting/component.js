
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, LayoutRow as Row } from 'zent';
const RadioGroup = Radio.Group;
const { getControlGroup } = Form;

class EndRewardRelatedSettings extends PureComponent {
  onEndSettingChange = (e) => {
    this.props.onChange(e.target.value);
  };

  getEndAwardDesc = () => {
    const { courseProduct } = this.props;
    switch (courseProduct.courseSellType) {
      case 0:
        return '手动到期后发放';
      case 1:
        return '消课率达到100%后发放';
      case 2:
        return '课程有效期最后一天发放';
      case 3:
        return '结课后发放';
    }
  }

  render() {
    const { value, courseProduct, isView } = this.props;
    return (
      <RadioGroup
        value={value}
        onChange={this.onEndSettingChange.bind(this)}
        disabled={isView}
      >
        <Row>
          <Radio value={1}>结课后立即发放</Radio>
          <div className='endaward-setting-desc'>{this.getEndAwardDesc()}</div>
        </Row>
        <Row>
          {courseProduct.isRelatedEndCer && <Radio value={2}>随毕业证书发放</Radio>}
          {!courseProduct.isRelatedEndCer && <Pop trigger='hover' content='此线下课还未设置毕业证书'><div><Radio disabled={true} value={2}>随毕业证书发放</Radio></div></Pop>}
        </Row>
      </RadioGroup>);
  }
}

export default getControlGroup(EndRewardRelatedSettings);
