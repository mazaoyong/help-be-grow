
import { Select, Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Checkbox, NumberInput, Notify } from 'zent';
import { getCouponListAPI } from '../../api';

import './coupon-field.scss';

const { getControlGroup } = Form;

class CouponSetting extends Component {
  static propTypes = {
    value: PropTypes.object,
    showGoodsSelect: PropTypes.bool,
    onChange: PropTypes.func,
    unchangable: PropTypes.bool,
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

  constructor(props) {
    super(props);
    this.getCouponList();
  }

  getCouponList() {
    getCouponListAPI()
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
              value: item.id,
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
    const {
      target: { checked },
    } = evt;
    if (!checked) {
      this.changeProps({
        couponRequired: false,
        couponId: 0,
        couponNum: 1,
      });
    } else {
      this.changeProps({ couponRequired: true });
    }
  };

  syncCouponRequired = () => {
    this.changeProps({
      couponRequired: this.props.value.couponRequired,
    });
  };

  onSelectChange = (evt, selected) => {
    this.changeProps({
      couponId: selected.value,
    });
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
    const nextValue = Object.assign(this.props.value, {
      ...newValue,
    });
    this.props.onChange(nextValue);
  }

  render() {
    const { couponId, couponNum, couponRequired } = this.props.value;
    const { unchangable } = this.props;
    const { selectData, selectPlaceholder } = this.state;

    return (
      <div className="preferential-wrapper">
        <div className="coupon-wrapper">
          <Checkbox
            checked={couponRequired}
            onChange={evt => this.onCouponCheck(evt)}
            disabled={unchangable}
          />
          {couponRequired && (
            <div className="inline">
              <Select
                data={selectData}
                onChange={this.onSelectChange}
                value={couponId}
                placeholder={selectPlaceholder}
                disabled={unchangable}
              />
              <NumberInput
                value={couponNum}
                className="number"
                decimal={0}
                width={50}
                onChange={newNum =>
                  this.changeProps({
                    couponNum: newNum,
                  })
                }
                disabled={unchangable}
                // onBlur={e => this.changeProps({ couponNum: e.target.value })}
              />
              &nbsp; 张&nbsp;
              <a
                className={cx('coupon-refresh', { 'disabled': unchangable })}
                href="javascript:;"
                onClick={!unchangable && this.getCouponList.bind(this)}>
                刷新
              </a>{' '}
              |{' '}
              {!unchangable
                ? (<a
                  href={`${_global.url.www}/ump/tradeincard#add`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  新建
                </a>)
                : (<a className={cx('coupon-create', { 'disabled': unchangable })}>新建</a>)
              }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default getControlGroup(CouponSetting);
