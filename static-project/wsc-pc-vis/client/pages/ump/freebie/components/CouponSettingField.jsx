
import { Select, Form } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, NumberInput, Notify } from 'zent';
import get from 'lodash/get';
import { getCouponList } from '../api';

const { getControlGroup } = Form;

class CouponSetting extends Component {
  static propTypes = {
    value: PropTypes.object,
    showGoodsSelect: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: {
      couponRequired: false,
      couponId: '',
      couponNum: 0,
      scoreRequired: false,
      score: 0,
    },
    showGoodsSelect: false,
  };

  state = {
    selectData: [],
    selectPlaceholder: '',
  };

  constructor() {
    super();
    this.getCouponList();
  }

  getCouponList() {
    getCouponList()
      .then(data => {
        let result;
        let placeholder;
        if (!data || !data.length) {
          placeholder = '你还未创建优惠券';
          result = [];
        } else {
          result = data;
          placeholder = '请选择';
        }
        this.setState({
          selectData: result.map(item => {
            return {
              value: Number(item.id),
              text: item.title,
            };
          }),
          selectPlaceholder: placeholder,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }

  // 优惠选择
  onCouponCheck = evt => {
    if (!evt.target.checked) {
      this.changeProps({
        couponRequired: false,
        couponId: '',
        couponNum: 0,
      });
    } else {
      this.changeProps({ couponRequired: true });
    }
  };

  onSelectChange = (evt, selected) => {
    this.changeProps({ couponId: selected.value });
  };

  // 积分选择
  onScoreCheck = evt => {
    if (!evt.target.checked) {
      this.changeProps({
        scoreRequired: false,
        score: 0,
      });
    } else {
      this.changeProps({ scoreRequired: evt.target.checked });
    }
  };

  changeProps(newValue) {
    this.props.onChange(newValue, { merge: true });
  }

  onBlur(newValue) {
    // eslint-disable-next-line react/prop-types
    this.props.onBlur(newValue, { merge: true });
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { disabled } = this.props;
    const { couponRequired, couponId, couponNum, scoreRequired, score } = this.props.value;
    const { selectData, selectPlaceholder } = this.state;
    const { pointsName } = _global;

    return (
      <div className="preferential-wrapper">
        <div className="coupon-wrapper">
          <Checkbox
            disabled={disabled}
            checked={couponRequired}
            onChange={evt => this.onCouponCheck(evt)}
          >
            送优惠券
          </Checkbox>
          {couponRequired && (
            <div className="inline">
              <Select
                disabled={disabled}
                data={selectData}
                onChange={this.onSelectChange}
                value={couponId}
                placeholder={selectPlaceholder}
              />
              <NumberInput
                disabled={disabled}
                value={couponNum}
                className="number"
                decimal={0}
                width={50}
                onChange={val => this.changeProps({ couponNum: val })}
                onBlur={e => this.onBlur({ couponNum: e.target.value })}
              />
              &nbsp; 张&nbsp;
            </div>
          )}
        </div>
        {(get(_global, 'mpAccount.serviceType') === 2 && get(_global, 'mpAccount.verifyType') >= 0) && (
          <div className="score-wrapper">
            <Checkbox
              disabled={disabled}
              checked={scoreRequired}
              onChange={evt => this.onScoreCheck(evt)}
            >
              送{pointsName}
            </Checkbox>
            {scoreRequired && (
              <div className="inline">
                <NumberInput
                  disabled={disabled}
                  min={0}
                  decimal={0}
                  width={70}
                  value={score}
                  onChange={val => this.changeProps({ score: val })}
                  onBlur={evt => this.onBlur({ score: evt.target.value })}
                />
                <span>{pointsName}</span>
              </div>)
            }
          </div>
        )}
      </div>
    );
  }
}

export default getControlGroup(CouponSetting);
