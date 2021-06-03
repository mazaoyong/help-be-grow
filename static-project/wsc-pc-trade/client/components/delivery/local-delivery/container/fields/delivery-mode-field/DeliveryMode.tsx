import React, { PureComponent } from 'react';
import { Radio, Icon, Pop } from 'zent';
import { Form } from '@zent/compat';
import { DELIVERY_MODE } from '../../../constants/form';

const RadioGroup = Radio.Group;

export interface IProps {
  value: number;
  onChange: (v: number) => void;
}

class DeliveryMode extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  isValueEqual = (checked: number, compared: number) => {
    if (checked === DELIVERY_MODE.DISTANCE && compared === DELIVERY_MODE.AREA) {
      return true;
    }
    return checked === compared;
  };

  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="custom-delivery-mode">
        <RadioGroup
          className="template"
          value={value}
          onChange={this.handleChange}
          isValueEqual={this.isValueEqual}
        >
          <Radio className="area" value={DELIVERY_MODE.AREA}>
            地图划分版
          </Radio>
          <Radio value={DELIVERY_MODE.SIMPLE}>
            简易文字版
            <Pop
              trigger="hover"
              content={
                <p>
                  简易版：没有超区校验，适合配送范围内地图信息不完善的地区，如新开发区、欠发达地区等。
                  <br />
                  起送价：是优惠券/码和满减优惠抵扣后的商品金额，运费不计入起送价。
                </p>
              }
              position="top-center"
            >
              <Icon type="help-circle" />
            </Pop>
          </Radio>
        </RadioGroup>
        {(value === DELIVERY_MODE.AREA || value === DELIVERY_MODE.DISTANCE) && (
          <div className="calc">
            <div className="calc-label">收费标准：</div>
            <RadioGroup value={value} onChange={this.handleChange}>
              <Radio value={DELIVERY_MODE.AREA}>按区域收取配送费</Radio>
              {value === DELIVERY_MODE.AREA && (
                <p className="help-desc">配送区域内商品会不计算距离，按区域收取固定配送费。</p>
              )}
              <Radio className="distance-radio" value={DELIVERY_MODE.DISTANCE}>
                按距离收取配送费
              </Radio>
              {value === DELIVERY_MODE.DISTANCE && (
                <p className="help-desc">
                  因考虑实际送货路况，配送费计算按步行距离，非地图直线距离。
                </p>
              )}
            </RadioGroup>
          </div>
        )}
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(DeliveryMode);
