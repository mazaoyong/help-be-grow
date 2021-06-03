
import { Form, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox, NumberInput } from 'zent';
import classnames from 'classnames';
import { CouponSelector } from '@youzan/react-components';
// import { compareVersion } from 'shared/fns/compare-version';
import { get } from 'lodash';
import { getCouponListAPI } from '../../api';

const CheckboxGroup = Checkbox.Group;
const { getControlGroup } = Form;

// 是否是专享版小程序
// const isCommonWeapp =
//   get(window._global, 'weappStatus.isValid') === false &&
//   get(window._global, 'weappStatus.useCommon') === true;

// 小程序已经绑定并且发布成功，才会有版本号
// const weappVersion = get(window._global, 'weappVersion.latestVersion');
// 并且稳定版本大于2.29.4
// const hasWeappBinded = weappVersion
//   ? compareVersion(weappVersion, '2.29.4') >= 0
//   : isCommonWeapp === true;

class Reward extends Component {
  // checkbox 事件
  onCheckboxChange = val => {
    const scoreChecked = val.includes(2);
    const couponChecked = val.includes(1);

    const newSettings = {
      scoreChecked,
      couponChecked,
    };

    if (!val.includes(1)) {
      newSettings.coupon = [];
    }
    if (!val.includes(2)) {
      newSettings.score = {};
    }

    this.props.onChange(newSettings, { merge: true });
  };

  // 获取已勾选的项
  getChecked = () => {
    const checked = [];
    const gciRewardSetting = this.props.value;

    if (gciRewardSetting.couponChecked) {
      checked.push(1);
    }

    if (gciRewardSetting.scoreChecked) {
      checked.push(2);
    }
    return checked;
  }

  // 删除优惠券
  onCouponDelete = (rewardId) => {
    if (this.props.disabled) {
      return;
    }
    const gciRewardSetting = this.props.value;

    const newCouponSetting = gciRewardSetting.coupon.filter(item => item.rewardId !== rewardId);

    this.props.onChange({
      coupon: newCouponSetting,
    }, { merge: true });
  };

  // 分数改变事件
  onScoreChange = value => {
    this.props.onChange({
      score: {
        rewardType: 2,
        rewardCount: value,
      },
    }, { merge: true });
  };

  onScoreBlur = evt => {
    this.props.onChange({
      score: {
        rewardType: 2,
        rewardCount: evt.target.value,
      },
    }, { merge: true });
  };

  // 修改优惠券张数
  onCouponCountChange = (id, count) => {
    const coupons = get(this.props.value, 'coupon') || [];
    const newCoupons = coupons.map(item => {
      if (item.rewardId === id && item.rewardCount !== count) {
        item.rewardCount = count;
      }
      return item;
    });
    this.props.onChange({ coupon: newCoupons }, { merge: true });
  }

  getCouponList = ({ keyword, pageNo, pageSize }) => {
    return getCouponListAPI({ keyword, pageNo, pageSize });
  };

  // 计算优惠券张数
  getCouponCount = () => {
    const selectCoupons = get(this.props.value, 'coupon');
    return selectCoupons.map(item => +item.rewardCount).reduce((acc, cur) => acc + cur);
  }

  // 选择优惠券回调
  onCouponSelected = selected => {
    const selectCoupon = selected.map(item => {
      return Object.assign({}, item, {
        rewardId: '' + item.id,
        rewardCount: item.amount, // 选择张数
        rewardType: 1,
      });
    });

    this.props.onChange({ coupon: selectCoupon }, { merge: true });
    this.props.onBlur({ coupon: selectCoupon }, { merge: true });
    CouponSelector.close();
  };

  // 打开优惠券选择弹出框
  openCouponDialog = e => {
    if (this.props.disabled) {
      return;
    }
    e.preventDefault();
    const { url, isSuperStore } = _global;

    const amountMap = {};
    let coupons = get(this.props.value, 'coupon') || [];
    coupons = coupons.map(item => Object.assign({}, item, { id: parseInt(item.rewardId) }));

    coupons.forEach(item => {
      amountMap[item.rewardId] = item.rewardCount;
    });

    CouponSelector.open({
      fetchApi: this.getCouponList,
      onChange: this.onCouponSelected,
      showStepper: true, // 数量选择
      maxTypeLimit: 5,
      maxNumLimit: 5,
      selected: coupons,
      amountMap,
      btnLink: isSuperStore ? `${url.store}/ump/coupon` : `${url.www}/ump/tradeincard`,
      overLimitMsg: (
        <p style={{ width: 500 }}>
          你选择的优惠券存在领取人或领取次数限制。在该活动中将不受到优惠券限制影响，所有用户均可领取。你确定选择该优惠券吗？
        </p>
      ),
    });
  };

  getColumns() {
    return [
      {
        title: '优惠券',
        name: 'title',
        width: '30%',
        bodyRender: row => <span>{row.title}</span>,
      },
      {
        title: '优惠内容',
        width: '30%',
        name: 'preferentialDesc',
      }, {
        title: '赠券数',
        name: 'amount',
        width: '20%',
        bodyRender: row => {
          const count = row.rewardCount || row.amount;

          if (this.props.disabled) {
            return count;
          }

          return (
            <NumberInput
              value={count}
              showStepper
              width="80px"
              min={1}
              max={Math.min(5, row.remainQty)}
              onChange={evt => this.onCouponCountChange(row.rewardId, evt)}
            />
          );
        },
      },
      {
        title: '操作',
        name: 'opt',
        width: '20%',
        bodyRender: row => (
          <span
            className={this.props.disabled ? 'gray' : 'cursor-link'}
            onClick={() => this.onCouponDelete(row.rewardId)}
          >
            删除
          </span>
        ),
      },
    ];
  }

  render() {
    const { pointsName } = _global;
    const { value: gciRewardSetting, disabled } = this.props;

    let countInputClass = 'reward-field-pass';
    if (get(gciRewardSetting, 'score.rewardCount') <= 0) {
      countInputClass = '';
    }

    const selectCoupons = get(gciRewardSetting, 'coupon');
    const checked = this.getChecked();

    return (
      <CheckboxGroup value={checked} onChange={this.onCheckboxChange} disabled={disabled}>
        <Checkbox value={1}>送优惠券</Checkbox>
        <br />
        {checked.includes(1) && (
          <div>
            <a
              className={classnames('punch_choose-link-wrapper', {
                'cursor-link': !disabled,
                gray: disabled,
              })}
              href="javascript:void(0);"
              onClick={this.openCouponDialog}
            >
              选择优惠券
            </a>
          </div>
        )}
        {selectCoupons.length > 0 && (
          <>
            <Table
              datasets={selectCoupons}
              columns={this.getColumns()}
              className="coupon-select-result"
            />
            {this.getCouponCount() > 5 && (
              <p style={{ color: '#f44' }}>
                优惠券选择最多不得超过5张
              </p>)
            }
            <p className="gray">
              最多可添加5张优惠券
            </p>
          </>
        )}
        <div className="field-inline score-wrapper">
          <Checkbox value={2}>送</Checkbox>
          &nbsp;
          <NumberInput
            width="170px"
            addonAfter={pointsName}
            autoComplete="off"
            className={countInputClass}
            min={0}
            max={99999}
            disabled={disabled || !checked.includes(2)}
            value={get(gciRewardSetting, 'score.rewardCount') || ''}
            onChange={this.onScoreChange}
            onBlur={this.onScoreBlur}
          />
        </div>
      </CheckboxGroup>
    );
  }
}

export default getControlGroup(Reward);
