import { Select } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cb from 'classnames';
import { NumberInput, Notify } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { getCouponList } from './api';

import './style.scss';

class CouponSetting extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    value: {
      couponRequired: false,
      couponId: '',
      couponNum: 0,
    },
    className: '',
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.getCouponList();

    this.state = {
      selectData: [],
      selectPlaceholder: '',
    };
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

  syncCouponRequired = () => {
    this.changeProps({
      couponRequired: this.state.couponRequired,
    });
  };

  onSelectChange = (evt, selected) => {
    this.changeProps({
      couponId: selected.value,
    });
  };

  changeProps(newValue) {
    const nextValue = Object.assign(this.props.value, {
      ...newValue,
    });
    this.props.onChange(nextValue);
  }

  render() {
    const { couponId, couponNum, couponRequired } = this.props.value;
    const { selectData, selectPlaceholder } = this.state;
    const { className, disabled } = this.props;

    // eslint-disable-next-line standard/no-callback-literal
    const clas = cb('coupon-container-wrapper', className);

    return (
      <div className={clas}>
        <div className="coupon-wrapper">
          {couponRequired && (
            <div className="inline">
              <Select
                data={selectData}
                onChange={this.onSelectChange}
                value={couponId}
                placeholder={selectPlaceholder}
                disabled={disabled}
              />
              <NumberInput
                value={couponNum}
                className="number"
                disabled={disabled}
                decimal={0}
                width={50}
                onChange={value =>
                  this.changeProps({
                    couponNum: value,
                  })
                }
                // onBlur={e => this.changeProps({ couponNum: e.target.value })}
              />
              &nbsp; 张&nbsp;
              <ShowWrapper
                isInStoreCondition={!isInStoreCondition({ supportBranchStore: true })}
              >
                <a href="javascript:;" onClick={this.getCouponList.bind(this)}>
                  刷新
                </a>{' '}
                |{' '}
                <a
                  href={`${_global.url.www}/ump/tradeincard#add`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  新建
                </a>
              </ShowWrapper>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CouponSetting;
