
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox, Tag } from 'zent';
import chooseBenefit from '../../benefit-choose';
import './style.scss';

const { getControlGroup } = Form;

const testValid = sellTypeData => {
  if (sellTypeData === undefined) return true;
  if (sellTypeData.isSingleChecked && sellTypeData.price === 0) return true;
  return sellTypeData.isSingleChecked && sellTypeData.price && +sellTypeData.price >= 0;
};

const unique = (arrayA, arrayB) => {
  const idsA = arrayA.map(one => one.id);
  arrayB = arrayB.filter(one => !idsA.includes(one.id));
  return [...arrayA, ...arrayB];
};

class VipBenefitField extends Component {
  openDialog = () => {
    const { isIn, list } = this.props.value;
    chooseBenefit({
      onChoose: data => {
        if (Array.isArray(data) && data.length > 0) {
          const benefitData = {
            isIn,
            list: unique(list, data),
          };
          this.props.onChange(benefitData);
          this.props.self.setState({
            benefitData,
          });
        }
      },
      config: {
        ...window._global,
        cards: list,
      },
    });
  };
  onClose = id => {
    let { list, isIn } = this.props.value;
    list = list.filter(one => one.id !== id);
    this.props.onChange({
      isIn,
      list,
    });
    this.props.self.setState({
      benefitData: {
        isIn,
        list,
      },
    });
  };
  onCheckedChange = e => {
    const data = {
      isIn: e.target.checked,
      list: this.props.value.list,
    };
    this.props.onChange(data);
    this.props.self.setState({
      benefitData: data,
    });
  };
  render() {
    const { list, isIn } = this.props.value;
    const visible = true;
    return (
      <div className="vip-benefit-select-field">
        <Checkbox
          disabled={!testValid(this.props.sellTypeData)}
          checked={isIn}
          onClick={this.onCheckedChange}
        >
          归属会员权益
        </Checkbox>
        {isIn ? (
          <a onClick={this.openDialog} outline>
            添加会员权益
          </a>
        ) : null}
        <div className="vip-benefit-select-field__list">
          {list.map(one => {
            return (
              <Tag
                key={one.id}
                className="zent-tag-vip"
                closable
                theme="grey"
                outline
                visible={visible}
                onVisibleChange={this.onVisibleChange}
                onClose={() => this.onClose(one.id)}
              >
                {one.name}
              </Tag>
            );
          })}
        </div>
      </div>
    );
  }
}

export default getControlGroup(VipBenefitField);
