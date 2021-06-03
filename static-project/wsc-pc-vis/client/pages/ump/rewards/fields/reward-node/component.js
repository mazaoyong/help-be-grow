
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, NumberInput, Pop } from 'zent';
import assign from 'lodash/assign';
import { REWARDS_TYPE_MAP } from '../../constants';
const RadioGroup = Radio.Group;
const { getControlGroup } = Form;
const ERROR_MESSAGE = '你已设置过该课程这一节点的奖励了，无法重新设置';

const END_CLASS_TEXTS = [
  '课程到期后发放',
  '课时全部消耗后发放',
  '课程有效期最后一天发放',
  '结课后发放'
];

class RewardNodeComponent extends PureComponent {
  onConditionChange = e => {
    const { rewardType = 'processing' } = this.props;
    this.props.onChange(assign({}, this.props.value, {
      rewardNodeType: REWARDS_TYPE_MAP[rewardType],
      conditionType: e.target.value,
    }));
  }

  onRewardNodeValueChange = value => {
    const message = this.validate(value);
    const { rewardNodeType } = this.props.value;
    if (message) {
      this.props.zentForm.setFieldExternalErrors({
        rewardNode: message,
      });
    } else {
      this.props.zentForm.setFieldExternalErrors({
        rewardNode: false,
      });
    }
    this.props.onChange({
      rewardNodeType,
      rewardNodeValue: !value ? 1 : +value,
      conditionType: 8,
    });
  }

  validate = value => {
    const { courseProduct } = this.props;
    if (courseProduct.alias && courseProduct.rewardNode && courseProduct.rewardNode.length) {
      if (courseProduct.rewardNode.filter(item => (
        courseProduct.courseSellType === item.conditionType && (courseProduct.courseSellType === 1
          ? item.conditionValue / 100 === value
          : item.conditionValue === value)
      )).length) {
        return ERROR_MESSAGE;
      }
    }
    if (courseProduct.courseSellType === 1 && !value) {
      return '请输入消课课时';
    }
  }

  getHelpDec = () => {
    return '支持店铺内所有课程教务排课签到消课发放奖励，暂不支持手动扣减课时消课以及指定课程消课发放奖励。';
  }

  getProcessingJsx() {
    const { value, zentForm, isView, isAdd } = this.props;
    const { rewardNodeType, rewardNodeValue } = value;
    return (
      <>
        <div className='reward-node-row'>
          <span>每完成</span>
          <NumberInput
            className='reward-node-input-wrap'
            width='149px'
            name='rewardNodeValue'
            disabled={(rewardNodeType !== 4 && !isAdd) || isView}
            value={rewardNodeValue}
            onChange={this.onRewardNodeValueChange}
            // decimal={2}
            min={1}
            max={999}
            showStepper
          />
          <span>次签到消课后发放</span>
        </div>
        <div className='reward-node-desc'>{this.getHelpDec()}</div>
        { zentForm.getFieldError('rewardNodeValue') && <div className='reward-node-error'>{ERROR_MESSAGE}</div>}
      </>
    );
  }

  getStartJsx() {
    const { value, isView, courseProduct } = this.props;
    const { conditionType } = value;
    const disableStartCer = courseProduct.alias && !courseProduct.isRelatedStartCer;
    return (
      <RadioGroup
        value={conditionType}
        onChange={this.onConditionChange}
        disabled={isView}
      >
        <Radio value={4}>
          <span>购买后立即发放</span>
        </Radio>
        { !disableStartCer && <Radio className='start-reward-group' value={5}>随入学证书发放</Radio> }
        { disableStartCer && <Pop trigger='hover' content='此线下课还未设置入学证书'><div><Radio className='start-reward-group__pop' disabled={true} value={5}>随入学证书发放</Radio></div></Pop> }
        {/* {rewardNodeType === 2 && startNodeSet && <div className='reward-node-error'>{ERROR_MESSAGE}</div>} */}
      </RadioGroup>
    );
  }

  getEndJsx() {
    const { value, isView, courseProduct } = this.props;
    const { conditionType } = value;
    const disableEndCer = courseProduct.alias && !courseProduct.isRelatedEndCer;
    return (
      <RadioGroup
        value={conditionType}
        onChange={this.onConditionChange}
        disabled={isView}
      >
        <Radio value={6}>
          <span>结课后立即发放</span>
          <div className='reward-node-desc'>{END_CLASS_TEXTS[courseProduct.courseSellType || 0]}</div>
        </Radio>
        { !disableEndCer && <Radio className='start-reward-group' value={7}>随毕业证书发放</Radio> }
        { disableEndCer && <Pop trigger='hover' content='此线下课还未设置毕业证书'><div><Radio className='start-reward-group__pop' disabled={true} value={7}>随毕业证书发放</Radio></div></Pop> }
        {/* {rewardNodeType === 2 && startNodeSet && <div className='reward-node-error'>{ERROR_MESSAGE}</div>} */}
      </RadioGroup>
    );
  }

  // helpDesc='适用于按期售卖的线下课，可输入0～3650天'
  // helpDesc='适用于按期售卖的线下课，可输入0～9999课时'
  render() {
    const { rewardType } = this.props;

    return (
      <>
        {rewardType === 'processing' && this.getProcessingJsx()}
        {rewardType === 'start' && this.getStartJsx()}
        {rewardType === 'end' && this.getEndJsx()}
      </>
    );
  }
};

export default getControlGroup(RewardNodeComponent);
